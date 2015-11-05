var express = require('express');
var router = express.Router();

router.get('/download-to-server', function(req, res) {
    downloadTestVideoToServer(res);
    //res.send((err === null) ? {msg: 'success'} : {msg: err});
});

function downloadTestVideoToServer(res) {
    var path = require('path');
    var fs = require('fs');
    var youtubedl = require('youtube-dl');
    var video = youtubedl('https://www.youtube.com/watch?v=7qFF2v8VsbA');

    video.on('info', function (info) {
        // TODO find a way to get error
        console.log('Download started');
        console.log('filename: ' + info.filename);
        console.log('size; ' + info.size);
        var output = path.join('data', 'videos', info.id + '.mp4');
        video.pipe(fs.createWriteStream(output));
        // TODO proper error handling
        if (res.statusCode === 200) {
            res.send(info.filename);
        } else {
            res.send(res.statusCode);
        }
    });
}

module.exports = router;