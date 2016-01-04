var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var youtube = require('youtube-api');
var jsonTransform = require("node-json-transform").DataTransform;
youtube.authenticate(JSON.parse(fs.readFileSync('api_key.json', 'utf8')));

router.get('/download', function(req, res) {
    var videoId = req.query['id'];
    downloadVideo(videoId, function(status, output, clientFileName) {
        if (status === 200) {
            res.status(status).download(path.join(global.appRoot, output), clientFileName);
        } else {
            res.status(status).send(output);
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
        maxResults: 50,
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


function downloadVideo(videoId, cb) {
    var youtubedl = require('youtube-dl');
    var video = youtubedl(videoId, ['-f bestaudio']);

    video.on('info', function (info) {
        var serverFileName = info.id + '.' + info.ext;
        var clientFileName = info.fulltitle.replace('/', '|') + '.' + info.ext;
        var output = path.join('data', 'videos', serverFileName);
        var stream = video.pipe(fs.createWriteStream(output));
        stream.on('finish', function() {
            cb(200, output, clientFileName);
        });
        stream.on('error', function(error) {
            cb(500, error)
        });

    });

    video.on('error', function(error) {
        console.log('video download error: ' + error);
        cb(400, error);
    });

}

module.exports = router;