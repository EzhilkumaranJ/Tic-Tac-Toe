var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');
var path = require('path');

var filePath = path.join(__dirname, ".", 'index.html');

app.use(express.static('public'));

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

    socket.on('selection', function(selectionData) {
        console.log(selectionData);
        var thisRoom = rooms[selectionData.room];
        var cellX = [selectionData.cell.x];
        var cellY = [selectionData.cell.y];

        if (thisRoom['player1'] === socket) {
            currentPlayer = 1;
            thisRoom.board[cellX][cellY] = 1;
            thisRoom.firstPlayerTurn = false;
        } else {
            currentPlayer = 2;
            thisRoom.board[cellX][cellY] = 0;
            thisRoom.firstPlayerTurn = true;
        }

        var gameBoard = thisRoom.board;
        // Calculating game result
        thisRoom.state = null;
        // For rows
        if(gameBoard[0][0] === 1 && gameBoard[1][0] === 1 && gameBoard[2][0] === 1) {
            thisRoom.state = "Won";
            playerWon = 1;
        }
        if(gameBoard[0][0] === 0 && gameBoard[1][0] === 0 && gameBoard[2][0] === 0) {
            thisRoom.state = "Won";
            playerWon = 2;
        }
        if(gameBoard[0][1] === 1 && gameBoard[1][1] === 1 && gameBoard[2][1] === 1) {
            thisRoom.state = "Won";
            playerWon = 1;
        }
        if(gameBoard[0][1] === 0 && gameBoard[1][1] === 0 && gameBoard[2][1] === 0) {
            thisRoom.state = "Won";
            playerWon = 2;
        }
        if(gameBoard[0][2] === 1 && gameBoard[1][2] === 1 && gameBoard[2][2] === 1) {
            thisRoom.state = "Won";
            playerWon = 1;
        }
        if(gameBoard[0][2] === 0 && gameBoard[1][2] === 0 && gameBoard[2][2] === 0) {
            thisRoom.state = "Won";
            playerWon = 2;
        }
        // For columns
        if(gameBoard[0][0] === 1 && gameBoard[0][1] === 1 && gameBoard[0][2] === 1) {
            thisRoom.state = "Won";
            playerWon = 1;
        }
        if(gameBoard[0][0] === 0 && gameBoard[0][1] === 0 && gameBoard[0][2] === 0) {
            thisRoom.state = "Won";
            playerWon = 2;
        }
        if(gameBoard[1][0] === 1 && gameBoard[1][1] === 1 && gameBoard[1][2] === 1) {
            thisRoom.state = "Won";
            playerWon = 1;
        }
        if(gameBoard[1][0] === 0 && gameBoard[1][1] === 0 && gameBoard[1][2] === 0) {
            thisRoom.state = "Won";
            playerWon = 2;
        }
        if(gameBoard[2][0] === 1 && gameBoard[2][1] === 1 && gameBoard[2][2] === 1) {
            thisRoom.state = "Won";
            playerWon = 1;
        }
        if(gameBoard[2][0] === 0 && gameBoard[2][1] === 0 && gameBoard[2][2] === 0) {
            thisRoom.state = "Won";
            playerWon = 2;
        }
        // For diagonals
        if(gameBoard[0][0] === 1 && gameBoard[1][1] === 1 && gameBoard[2][2] === 1) {
            thisRoom.state = "Won";
            playerWon = 1;
        }
        if(gameBoard[0][0] === 0 && gameBoard[1][1] === 0 && gameBoard[2][2] === 0) {
            thisRoom.state = "Won";
            playerWon = 2;
        }
        if(gameBoard[2][0] === 1 && gameBoard[1][1] === 1 && gameBoard[0][2] === 1) {
            thisRoom.state = "Won";
            playerWon = 1;
        }
        if(gameBoard[2][0] === 0 && gameBoard[1][1] === 0 && gameBoard[0][2] === 0) {
            thisRoom.state = "Won";
            playerWon = 2;
        }

        if (thisRoom.state !== 'won') {
            // Check for game draw
            var draw = check_draw(thisRoom.board);
            // If game is not draw then it is in_progress
            if (!draw) {
                thisRoom.state = 'in_progress'
            } else {
                thisRoom.state = 'draw';
            }
        }

        var socket1 = thisRoom['player1'];
        var socket2 = thisRoom['player2'];
        socket1.emit(
            'game-state', {
                "playerTurn": thisRoom.firstPlayerTurn,
                "board": thisRoom.board,
                "state": thisRoom.state
            });
        socket2.emit(
            'game-state', {
                "playerTurn": !thisRoom.firstPlayerTurn,
                "board": thisRoom.board,
                "state": thisRoom.state
            });
    });

});

check_draw = function(board) {
    // Iterate through all the cells in the board
    // Check if all the cells are filled
    // If all cells are filled, then return true else return false
    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 2; j++) {
            if (board[i][j] === undefined) {
                return false;
            }
        }
    }
    return true;
};

var checkPlayer = function(room) {
    var thisRoom = rooms[room];
    if (_.has(thisRoom, 'player1') && _.has(thisRoom, 'player2')) {
        console.log("Game starts");

        thisRoom.firstPlayerTurn = true;
        thisRoom.board = [[], [], []];
        thisRoom.state = "in_progress";

        var socket1 = thisRoom['player1'];
        var socket2 = thisRoom['player2'];
        socket1.emit(
            'connection-message', {
                "player": 1,
                "playerTurn": true,
                "board": thisRoom.board,
                "state": thisRoom.state
            });
        socket2.emit(
            'connection-message', {
                "player": 2,
                "playerTurn": false,
                "board": thisRoom.board,
                "state": thisRoom.state
            });
    } else {
        console.log("Waiting");
    }
};

http.listen(8000, function () {
    console.log("Listening on port 8000");
});