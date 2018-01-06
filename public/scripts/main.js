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

        $('#gameState').show();
        $('#turnMsg').show();

        if (gameState === "ready") {
            $('#stateText').removeClass('won').removeClass('lost').removeClass('draw').removeClass('inProgress').addClass('ready').text("READY");
        }

        if (playerTurn) {
            $('#turnText').text("YOUR TURN");
        } else {
            $('#turnText').text("WAITING");
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
        $('#turnMsg').hide();
        if (playerWon) {
            $('#stateText').removeClass('ready').removeClass('inProgress').addClass('won').text("YOU WON");
        } else {
            $('#stateText').removeClass('ready').removeClass('inProgress').addClass('lost').text("YOU LOST");
        }
        $('#newGame').show();
    } else {
        if (gameState === "in_progress") {
            $('#stateText').removeClass('ready').addClass('inProgress').text("IN PROGRESS");
        }
        if (gameState === "draw") {
            $('#stateText').removeClass('ready').removeClass('inProgress').addClass('draw').text("DRAW");
            $('#turnMsg').hide();
            $('#newGame').show();
        }
        if (playerTurn) {
            $('#turnText').text("YOUR TURN");
        } else {
            $('#turnText').text("WAITING");
        }
    }
});

newGameBtn.addEventListener('click', function () {
    socket.emit('new-game', {'roomId': currentRoom});
    socket.on('new-game', function () {
        $('#newGame').hide();
    });
});
