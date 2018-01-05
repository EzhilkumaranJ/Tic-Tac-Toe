var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');
var path = require('path');

var filePath = path.join(__dirname, ".", 'index.html');

app.use(express.static('public'));

var gameServer = require('./game_app.js');

app.get('/', function(request, response){
    response.sendFile(filePath);
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('connect-to-room', function (data) {
        console.log(data);
        var roomId = data.roomId;
        console.log(roomId);

        // Create empty room
        gameServer.createRoom(roomId);

        // Add Players
        gameServer.addPlayers(roomId, socket);

        // Initialize the game
        gameServer.startGame(roomId);
    });

    socket.on('playerSelection', function (selectionData) {
        // process on the player selected data
        gameServer.processInput(socket, selectionData);

        // Calculate game result, state on the basis of player selection
        gameServer.calculateResult(selectionData);

        // Broadcast game result to the players
        gameServer.broadcastResult(socket, selectionData);
    });

});

http.listen(8000, function () {
    console.log("Listening on port 8000");
});