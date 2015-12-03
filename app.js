var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var video = require('./routes/video');

var app = express();
var server = app.listen(3001);
var io = require('socket.io').listen(server);
var dl = require('delivery');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/video', video);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


io.on('connection', function(socket) {
    console.log('user connected');

    socket.on('download_to_server', downloadToServer);
    socket.on('download_to_client', function(videoId) {
        downloadToClient(videoId, socket)
    });

});

function downloadToServer(videoId) {
    video.downloadVideo(function(statusCode, path, fileName) {
        if (statusCode === 400) {
            io.emit('download_failed', 'Error: video download failed.');
        } else {
            io.emit('download_success', 'Success: video ' + fileName + ' downloaded.');
        }
    });
}

function downloadToClient(videoId, socket) {
    video.downloadVideo(function(statusCode, path, fileName) {
        if (statusCode == 200) {
            socket.emit('download_to_client_success', fileName);
        }
    });


    //video.downloadVideo(function(statusCode, path, fileName) {
    //    //var http = require('http');
    //    //var fs = require('fs');
    //    //
    //    //var file = fs.createWriteStream("file.jpg");
    //    //socket.sendFile(file);
    //    console.log('downloadToClient ' + path + " " + fileName);
    //    app.get(path, function(req, res) {
    //        res.download(path);
    //    });
    //});



    //var delivery = dl.listen(socket);
    //delivery.on('delivery.connect', function(delivery) {
    //    video.downloadVideo(function(statusCode, path, fileName) {
    //        if (statusCode === 200) {
    //            delivery.send({
    //                name: fileName,
    //                path: path
    //            });
    //        }
    //    });
    //});
}

module.exports = app;
