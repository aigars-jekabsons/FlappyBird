var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var util = require('util');

io.on('connection', function (socket) {
    console.log("a user connected");
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    // When the client sends a message...
    socket.on("score", function (data) {
        console.log("got message: " + util.inspect(data));
        // ...emit a "message" event to every other socket
        io.emit("score", data);
    });
});

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/images',express.static(__dirname + '/images'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/templates/index.html');
});

app.get('/leaderboard',function(req,res){
    res.sendFile(__dirname+'/templates/leaderboard.html');
});

server.listen(8080,function(){ // Listens to port 80
    console.log('Listening on '+server.address().port);
});