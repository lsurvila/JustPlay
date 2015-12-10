var express = require('express');
var router = express.Router();

router.get('/download-to-server', function(req, res) {
    downloadVideo(function(status, path) {
        res.sendStatus(status);
    });
});

router.get('/download-to-client', function(req, res) {
    downloadVideo(function(status, serverFileName, clientFileName) {
        if (status == 200) {
            // TODO spaces in filename -> fail
            // TODO non-hardcoded directory
            // TODO send status
            res.download('/Users/liudassurvila/Documents/WebStormProjects/JustPlay/' + 'data/videos/' + serverFileName, clientFileName);
        }
        //res.sendStatus(status);
    });
});

function downloadVideo(cb) {
    var path = require('path');
    var fs = require('fs');
    var youtubedl = require('youtube-dl');
    var video = youtubedl('YnPKmZ7-m-A');

    video.on('info', function (info) {
        var serverFileName = info.id + '.' + info.ext;
        var clientFileName = info.fulltitle + '.' + info.ext;
        var output = path.join('data', 'videos', serverFileName);
        var stream = video.pipe(fs.createWriteStream(output));
        stream.on('finish', function() {
            cb(200, serverFileName, clientFileName);
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