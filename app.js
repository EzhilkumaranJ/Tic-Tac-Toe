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

    // player connect to game room
    socket.on('connect-to-room', function (data) {
        console.log(data);
        var roomId = data.roomId;
        console.log(roomId);

        // Create empty room
        gameServer.createRoom(roomId);

        // Add Players
        var result = gameServer.addPlayers(roomId, socket);

        // Start the game
        if (result) {
            gameServer.startGame(roomId);
        }

    });

    // player disconnects
    socket.on('disconnect', function () {
        var room = checkRoom(socket);
        console.log(room);
        if (room) {
            // Remove client
            var result = gameServer.removeClient(room, socket);

            // Start the game
            if (result) {
                gameServer.startGame(_.findKey(gameServer.gameRoom, room));
            }
        }
    });

    // player select a cell
    socket.on('playerSelection', function (selectionData) {
        // process on the player selected data
        gameServer.processInput(socket, selectionData);

        // Calculate game result, state on the basis of player selection
        gameServer.calculateResult(selectionData);

        // Broadcast game result to the players
        gameServer.broadcastResult(socket, selectionData);
    });

    // player click on new game
    socket.on('new-game', function (data) {
        var roomId = data.roomId;
        // start new game
        gameServer.newGame(roomId);
    });

    // Check Room function
    function checkRoom(socket) {
        var rooms = gameServer.gameRoom;
        console.log(rooms);
        for (var room in rooms) {
            if (rooms[room]['player1'] === socket || rooms[room]['player2'] === socket) {
                return rooms[room];
            }
        }
        return null;
    }
});

http.listen(8000, function () {
    console.log("Listening on port 8000");
});