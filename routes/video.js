var express = require('express');
var router = express.Router();

router.get('/download-to-server', function(req, res) {
    downloadToServer(function(result) {
        if (result === 400) {
            res.status(result).send('error');
        } else {
            res.send(result);
        }
    });
});

router.get('/download-to-client', function(req, res) {
    var path = require('path');
    var fs = require('fs');
    var youtubedl = require('youtube-dl');
    var video = youtubedl('5LG2Ar2ny0M');


    video.on('error', function (error) {
        res.status(400).send(error.message);
    });

    video.on('info', function (info) {
        console.log('Download started');
        console.log('filename: ' + info.filename);
        console.log('size; ' + info.size);
        var output = path.join('data', 'videos', info.filename + '.mp4');
        video.pipe(fs.createWriteStream(output));
        console.log('sending file');
        res.download('/Users/liudassurvila/Documents/WebStormProjects/JustPlay/' + output);
        console.log('send file complete');
    });
});

function downloadToServer(cb) {
    var path = require('path');
    var fs = require('fs');
    var youtubedl = require('youtube-dl');
    var video = youtubedl('5LG2Ar2ny0M');

    video.on('error', function(error) {
        cb(400);
    });

    video.on('info', function (info) {
        console.log('Download started');
        console.log('filename: ' + info.filename);
        console.log('size; ' + info.size);
        var output = path.join('data', 'videos', info.filename + '.mp4');
        video.pipe(fs.createWriteStream(output));
        cb(info.filename);
    });
}

module.exports = router;
module.exports.downloadToServer = downloadToServer;