var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');
var path = require('path');

var filePath = path.join(__dirname, ".", 'index.html');

app.get('/', function(request, response){
    response.sendFile(filePath);
});

var rooms = {};

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('connect-to-room', function (data) {
        var room = data.room;
        console.log(room);

        if (_.has(rooms, room)) {
            var thisRoom = rooms[room];
            if(!_.has(thisRoom, 'player1')) {
                thisRoom["player1"] = socket;
                console.log(rooms);
                checkPlayer(room);
            } else if(!_.has(thisRoom, 'player2')) {
                thisRoom["player2"] = socket;
                console.log(rooms);
                checkPlayer(room);
            } else {
                console.log("Room is full");
                console.log(rooms);
            }
        } else {
            rooms[room] = {"player1": socket};
            console.log(rooms);
        }
    });

});

var checkPlayer = function(room) {
    if (_.has(rooms[room], 'player1') && _.has(rooms[room], 'player2')) {
        console.log("Game starts");
        var socket1 = rooms[room]['player1'];
        var socket2 = rooms[room]['player2'];
        socket1.emit('connection-message', {"msg": "Display board"});
        socket2.emit('connection-message', {"msg": "Display board"});
    } else {
        console.log("Waiting");
    }
};

http.listen(8000, function () {
    console.log("Listening on port 8000");
});