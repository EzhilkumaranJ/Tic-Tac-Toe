var _ = require('underscore');

var gameServer = {};

gameServer.gameRoom = {};

gameServer.createRoom = function(roomId) {
    console.log("createRoom function", roomId);
    if (!_.has(gameServer.gameRoom, roomId)) {
        gameServer.gameRoom[roomId] = {};
    }
};

gameServer.addPlayers = function (roomId, player) {
    var thisRoom = gameServer.gameRoom[roomId];
    console.log(thisRoom);

    if (!_.has(thisRoom, "player1")) {

        thisRoom["player1"] = player;

    } else if (!_.has(thisRoom, "player2")) {

        thisRoom["player2"] = player;

    } else {
        console.log("Room is full");
    }
};

gameServer.startGame = function (roomId) {
    var thisRoom = gameServer.gameRoom[roomId];

    if (_.has(thisRoom, 'player1') && _.has(thisRoom, 'player2')) {
        var socket1 = thisRoom['player1'];
        var socket2 = thisRoom['player2'];

        thisRoom.state = "ready";
        thisRoom.firstPlayerTurn = true;
        thisRoom.board = [[], [], []];
        console.log("both connected");

        socket1.emit('start', {
            "player": 1,
            "playerTurn": true,
            "board": thisRoom.board,
            "state": thisRoom.state
        });
        socket2.emit('start', {
            "player": 2,
            "playerTurn": false,
            "board": thisRoom.board,
            "state": thisRoom.state
        });

    } else {
        thisRoom.state = 'waiting';
        if(_.has(thisRoom, 'player1' )) {
            var socket1 = thisRoom['player1'];
            socket1.emit('wait', {
                'gameState': thisRoom.state,
                'room': roomId
            });
        } else {
            var socket2 = thisRoom['player2'];
            socket2.emit('wait', {
                'gameState': thisRoom.state,
                'room': roomId
            });
        }
    }
};

gameServer.processInput = function (socket, selectionData) {
    var thisRoom = gameServer.gameRoom[selectionData.room];
    var cellX = selectionData.cell.x;
    var cellY = selectionData.cell.y;

    if (thisRoom['player1'] === socket) {
        thisRoom.board[cellX][cellY] = 1;
        thisRoom.firstPlayerTurn = false;
    } else {
        thisRoom.board[cellX][cellY] = 2;
        thisRoom.firstPlayerTurn = true;
    }
};

gameServer.calculateResult = function (selectionData) {
    var thisRoom = gameServer.gameRoom[selectionData.room];
    var gameBoard = thisRoom.board;
    thisRoom.state = null;
    thisRoom.playerWon = null;

    // For rows
    if(gameBoard[0][0] === 1 && gameBoard[0][1] === 1 && gameBoard[0][2] === 1) {
        thisRoom.state = "won";
        thisRoom.playerWon = 1;
    }
    if(gameBoard[0][0] === 2 && gameBoard[0][1] === 2 && gameBoard[0][2] === 2) {
        thisRoom.state = "won";
        thisRoom.playerWon = 2;
    }
    if(gameBoard[1][0] === 1 && gameBoard[1][1] === 1 && gameBoard[1][2] === 1) {
        thisRoom.state = "won";
        thisRoom.playerWon = 1;
    }
    if(gameBoard[1][0] === 2 && gameBoard[1][1] === 2 && gameBoard[1][2] === 2) {
        thisRoom.state = "won";
        thisRoom.playerWon = 2;
    }
    if(gameBoard[2][0] === 1 && gameBoard[2][1] === 1 && gameBoard[2][2] === 1) {
        thisRoom.state = "won";
        thisRoom.playerWon = 1;
    }
    if(gameBoard[2][0] === 2 && gameBoard[2][1] === 2 && gameBoard[2][2] === 2) {
        thisRoom.state = "won";
        thisRoom.playerWon = 2;
    }
    // For columns
    if(gameBoard[0][0] === 1 && gameBoard[1][0] === 1 && gameBoard[2][0] === 1) {
        thisRoom.state = "won";
        thisRoom.playerWon = 1;
    }
    if(gameBoard[0][0] === 2 && gameBoard[1][0] === 2 && gameBoard[2][0] === 2) {
        thisRoom.state = "won";
        thisRoom.playerWon = 2;
    }
    if(gameBoard[0][1] === 1 && gameBoard[1][1] === 1 && gameBoard[2][1] === 1) {
        thisRoom.state = "won";
        thisRoom.playerWon = 1;
    }
    if(gameBoard[0][1] === 2 && gameBoard[1][1] === 2 && gameBoard[2][1] === 2) {
        thisRoom.state = "won";
        thisRoom.playerWon = 2;
    }
    if(gameBoard[0][2] === 1 && gameBoard[1][2] === 1 && gameBoard[2][2] === 1) {
        thisRoom.state = "won";
        thisRoom.playerWon = 1;
    }
    if(gameBoard[0][2] === 2 && gameBoard[1][2] === 2 && gameBoard[2][2] === 2) {
        thisRoom.state = "won";
        thisRoom.playerWon = 2;
    }
    // For diagonals
    if(gameBoard[0][0] === 1 && gameBoard[1][1] === 1 && gameBoard[2][2] === 1) {
        thisRoom.state = "won";
        thisRoom.playerWon = 1;
    }
    if(gameBoard[0][0] === 2 && gameBoard[1][1] === 2 && gameBoard[2][2] === 2) {
        thisRoom.state = "won";
        thisRoom.playerWon = 2;
    }
    if(gameBoard[0][2] === 1 && gameBoard[1][1] === 1 && gameBoard[2][0] === 1) {
        thisRoom.state = "won";
        thisRoom.playerWon = 1;
    }
    if(gameBoard[0][2] === 2 && gameBoard[1][1] === 2 && gameBoard[2][0] === 2) {
        thisRoom.state = "won";
        thisRoom.playerWon = 2;
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
};

var check_draw = function(board) {
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

gameServer.broadcastResult = function (socket, selectionData) {
    var thisRoom = gameServer.gameRoom[selectionData.room];
    var socket1 = thisRoom['player1'];
    var socket2 = thisRoom['player2'];
    socket1.emit(
        'game-state', {
            "playerTurn": thisRoom.firstPlayerTurn,
            "board": thisRoom.board,
            "state": thisRoom.state,
            "playerWon": thisRoom.playerWon == 1 ? true : false
        });
    socket2.emit(
        'game-state', {
            "playerTurn": !thisRoom.firstPlayerTurn,
            "board": thisRoom.board,
            "state": thisRoom.state,
            "playerWon": thisRoom.playerWon == 2 ? true : false
        });
};

gameServer.newGame = function (roomId) {
    var thisRoom = gameServer.gameRoom[roomId];
    var socket1 = thisRoom['player1'];
    var socket2 = thisRoom['player2'];
    socket1.emit('new-game', {});
    socket2.emit('new-game', {});
    thisRoom.state = null;
    gameServer.startGame(roomId);
};

gameServer.removeClient = function (room, socket) {
    var player;
    var client;
    console.log(room);
    console.log(socket);
    if (room['player1'] === socket) {
        player = 'player1';
    } else {
        player = 'player2';
    }
    delete room[player];
    room.endMsg = "end";

    if (_.has(room, 'player1')) {
        client = room['player1'];
    } else {
        client = room['player2'];
    }

    client.emit('end-game', {'msg': room.endMsg});
};

module.exports = gameServer;