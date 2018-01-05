var socket = io();
var playerNumber;
var positionX;
var positionY;
var playerTurn;
var gameBoard;
var gameState;
var currentRoom;
var playerWon;

gameRoomConnectBtn.addEventListener('click', function () {

    $('#roomForm').submit(function (event) {
        event.preventDefault();
        currentRoom = $('input[name=roomid]').val();
        socket.emit('connect-to-room', {
            'roomId': currentRoom
        });
    });

    socket.on('wait', function (data) {
        gameState = data.gameState;
        currentRoom = data.room;

        if (gameState === "waiting") {
            $('#room').hide();
            $('#waitingState').show();
            roomLink.innerText = currentRoom;
        }
    });

    socket.on('start', function (data) {
        console.log("game started");
        $('#room').hide();
        $('#waitingState').hide();

        drawGameBoard();

        playerTurn = data.playerTurn;
        gameBoard = data.board;
        gameState = data.state;
        playerNumber = data.player;

        gameStateMsg.innerText = gameState;

        if (playerTurn) {
            turnMsg.innerText = "Your Turn";
        } else {
            turnMsg.innerText = "Waiting";
        }
    });
});

canvas.addEventListener('click', function(event){
    console.log('canvas clicked');
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;

    positionX = Math.floor(x / 100);
    positionY = Math.floor(y / 100);
    console.log(positionX);
    console.log(positionY);

    if (playerTurn === true && !gameBoard[positionX][positionY] && (gameState === "ready" || gameState === "in_progress")) {
        // Setting player turn as false even before waiting for the server to make sure user don't click twice
        playerTurn = false;

        if (playerNumber === 1) {
            drawCross(positionX, positionY);
        } else {
            drawCircle(positionX, positionY);
        }
        socket.emit('playerSelection', {
            'cell': {
                'x': positionX,
                'y': positionY
            },
            'room': currentRoom
        });
    }
});

socket.on('game-state', function (data) {
    playerTurn = data.playerTurn;
    gameBoard = data.board;
    gameState = data.state;
    playerWon = data.playerWon;

    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 2; j++) {
            if (gameBoard[i][j] === 1) {
                drawCross(i, j);
            } else if(gameBoard[i][j] === 2) {
                drawCircle(i, j);
            }
        }
    }

    if (gameState === "won") {
        turnMsg.innerText = "";
        if (playerWon) {
            gameStateMsg.innerText = "You Won";
        } else {
            gameStateMsg.innerText = "You Lost";
        }
        $('#newGame').show();
    } else {
        gameStateMsg.innerText = gameState;

        if (playerTurn) {
            turnMsg.innerText = "Your Turn";
        } else {
            turnMsg.innerText = "Waiting";
        }
    }
});

newGameBtn.addEventListener('click', function () {
    $('#newGame').hide();
    socket.emit('new-game', {'roomId': currentRoom});
});
