var express = require('express');
var router = express.Router();

router.get('/test', function(req, res) {
    downloadTestVideo();
    res.send('respond with a resource');
});

function downloadTestVideo() {
    var path = require('path');
    var fs = require('fs');
    var youtubedl = require('youtube-dl');
    var video = youtubedl('https://www.youtube.com/watch?v=7qFF2v8VsaA');

    video.on('info', function (info) {
        console.log('Download started');
        console.log('filename: ' + info.filename);
        console.log('size; ' + info.size);
        var output = path.join('data', 'videos', info.id + '.mp4');
        video.pipe(fs.createWriteStream(output));
    });
}

module.exports = router;