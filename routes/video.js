var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var youtube = require('youtube-api');
var jsonTransform = require("node-json-transform").DataTransform;
youtube.authenticate(
    {
        'type': 'key',
        'key': process.env.YOUTUBE_API_KEY
    }
);

router.get('/download', function(req, res) {
    var videoId = req.query['id'];
    var writeToDisk = parseInt(req.query['writeToDisk']);
    downloadVideo(videoId, writeToDisk, function(status, video, fileLocation, clientFileName, extension, error) {
        if (status === 200) {
            if (writeToDisk === 1) {
                res.status(status).download(path.join(global.appRoot, fileLocation), clientFileName + "." + extension);
            } else {
                res.status(status);
                res.setHeader('Content-Disposition', 'attachment; filename=' + clientFileName + "." + extension);
                res.setHeader('Content-Type', 'audio/' + extension);
                video.pipe(res);
            }
        } else if (error.code !== 'ECONNRESET') {
            res.status(status).send(error);
        }
    });
});

router.get('/search', function(req, res) {
    var query = req.query['q'];
    searchVideos(query, function(status, result) {
        res.status(status).send(result);
    });
});

function searchVideos(query, cb) {
    var request = {
        part: 'snippet',
        q: query,
        maxResults: 10,
        type: 'video',
        fields: 'items',
        videoCategoryId: 10
    };
    youtube.search.list(request, function(err, data) {
        if (err === null) {
            var map = {
                list : 'items',
                item : {
                    id : "id.videoId",
                    title : "snippet.title",
                    imageUrl : "snippet.thumbnails.high.url"
                }
            };
            var dataTransform = jsonTransform(data, map);
            var result = dataTransform.transform();
            cb(200, result);
        } else {
            cb(err.code, err);
        }
    });
}


function downloadVideo(videoId, writeToDisk, cb) {
    var youtubedl = require('youtube-dl');
    var video = youtubedl(videoId, ['-f bestaudio']);

    video.on('info', function (info) {
        var clientFileName = info.fulltitle.replace('/', '|');
        if (writeToDisk === 1) {
            var output = path.join('data', 'videos', info.id + '.' + info.ext);
            var fileStream = video.pipe(fs.createWriteStream(output));
            fileStream.on('finish', function() {
                cb(200, null, output, clientFileName, info.ext, null);
            });
            fileStream.on('error', function() {
                cb(500, null, null, null, null, error);
            });
        } else {
            cb(200, video, null, clientFileName, info.ext, null);
        }
    });

    video.on('error', function(error) {
        console.log('video download error: ' + error);
        cb(400, null, null, null, null, error);
    });

}

module.exports = router;