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
    var video = youtubedl('5LG2Ar2ny0M');


    video.on('error', function (error) {
        res.status(500).send(error.message);
    });

    video.on('info', function (info) {
        console.log('Download started');
        console.log('filename: ' + info.filename);
        console.log('size; ' + info.size);
        var output = path.join('data', 'videos', info.filename + '.mp4');
        video.pipe(fs.createWriteStream(output));
        res.send(info.filename);
    });
}

module.exports = router;