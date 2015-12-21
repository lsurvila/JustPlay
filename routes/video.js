var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/download', function(req, res) {
    var videoId = req.query['id'];
    downloadVideo(videoId, function(status, output, clientFileName) {
        if (status == 200) {
            res.download(path.join(global.appRoot, output), clientFileName);
        } else {
            // sends status only if failed
            res.sendStatus(status);
        }
    });
});

function downloadVideo(videoId, cb) {

    var fs = require('fs');
    var youtubedl = require('youtube-dl');
    var video = youtubedl(videoId);

    video.on('info', function (info) {
        var serverFileName = info.id + '.' + info.ext;
        var clientFileName = info.fulltitle.replace('/', '|') + '.' + info.ext;
        var output = path.join('data', 'videos', serverFileName);
        var stream = video.pipe(fs.createWriteStream(output));
        stream.on('finish', function() {
            cb(200, output, clientFileName);
        });
        stream.on('error', function() {
            cb(400)
        });

    });

    video.on('error', function(error) {
        console.log('video download error: ' + error);
        cb(400);
    });

}

module.exports = router;