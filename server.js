var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var util = require('util');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

io.on('connection', function (socket) {

    console.log("a user connected");
    app.post('/controlData',function(req,res){
        var ControlValue = [req.body.data] 
        console.log('receivedControlData',req.body)
          io.emit("control-change", ControlValue);
          res.send('Control '+ ControlValue + 'ValueHasBeenReceived');
          res.end();
     });
    socket.on('receiveControls', function(data){
        console.log('receivedControlData',data)
        io.emit("control-change", data);
    })

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    // When the client sends a message...
    socket.on("score", function (data) {
        console.log("got message: " + util.inspect(data));
        // ...emit a "message" event to every other socket
        io.emit("score", data);
    });

    socket.on("score", function (data) {
        console.log("got message: " + util.inspect(data));
        // ...emit a "message" event to every other socket
       
    });



});

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/images',express.static(__dirname + '/images'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.get('/leaderboard',function(req,res){
    res.sendFile(__dirname+'/leaderboard.html');
});



server.listen(8080,function(){ // Listens to port 8081
    console.log('Listening on '+server.address().port);
});