var express = require('express');
var router = express.Router();

router.get('/test', function(req, res) {
    downloadTestVideo();
    res.send('respond with a resource');
});

function downloadTestVideo() {
    var fs = require('fs');
    var youtubedl = require('youtube-dl');
    var video = youtubedl('https://www.youtube.com/watch?v=7qFF2v8VsaA');

    video.on('info', function (info) {
        console.log('Download started');
        console.log('filename: ' + info.filename);
        console.log('size; ' + info.size);
    });

    video.pipe(fs.createWriteStream('myvideo.mp4'));
}

module.exports = router;