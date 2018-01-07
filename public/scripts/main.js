// Declaring globals
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
    // Submit form
    $('#roomForm').submit(function (event) {
        event.preventDefault();
        currentRoom = $('input[name=roomid]').val();
        // On submitting form, emit a event with room id
        socket.emit('connect-to-room', {
            'roomId': currentRoom
        });
    });

    // listening on wait event which displays waiting state for first connected user
    // When only one player connects
    socket.on('wait', function (data) {
        gameState = data.gameState;
        currentRoom = data.room;

        if (gameState === "waiting") {
            $('#room').hide();
            $('#waitingState').show();
            roomLink.innerText = currentRoom;
        }
    });

    // When both player connects
    socket.on('start', function (data) {
        console.log("game started");
        // Resetting the display
        $('#room').hide();
        $('#canvas').show();
        $('#waitingState').hide();
        $('#endGame').hide();

        // Draw game board
        drawGameBoard();

        // populating the global variables with values come from start event handler
        playerTurn = data.playerTurn;
        gameBoard = data.board;
        gameState = data.state;
        playerNumber = data.player;

        // Display game state message and turn message to both the player
        // Current game status
        $('#gameState').show();
        // whose turn
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

// When player clicks on canvas cell
canvas.addEventListener('click', function(event){
    console.log('canvas clicked');
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;

    // calculating coordinates of cell when clicked
    positionX = Math.floor(x / 100);
    positionY = Math.floor(y / 100);
    console.log(positionX);
    console.log(positionY);

    // Checking if players turn and state of game is ready or in progress
    // To click on the cell and registers input sign as ("X" or "O")
    if (playerTurn === true && !gameBoard[positionX][positionY] && (gameState === "ready" || gameState === "in_progress")) {
        // Setting player turn as false even before waiting for the server to make sure user don't click twice
        playerTurn = false;

        if (playerNumber === 1) {
            drawCross(positionX, positionY);
        } else {
            drawCircle(positionX, positionY);
        }
        // Emit selection event with current room and selected cell
        socket.emit('playerSelection', {
            'cell': {
                'x': positionX,
                'y': positionY
            },
            'room': currentRoom
        });
    }
});

// Listening game-state event sent from server
socket.on('game-state', function (data) {
    playerTurn = data.playerTurn;
    gameBoard = data.board;
    gameState = data.state;
    playerWon = data.playerWon;

    // draw circle and cross on both clients depending on the selection
    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 2; j++) {
            if (gameBoard[i][j] === 1) {
                drawCross(i, j);
            } else if(gameBoard[i][j] === 2) {
                drawCircle(i, j);
            }
        }
    }

    // Display game state message and turn message to both the player
    // Also display new game button when game is draw or someone won/lost
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

// When clicks on new game button to start a new game
newGameBtn.addEventListener('click', function () {
    // Emit a new-game event with currentRoom to the server
    socket.emit('new-game', {'roomId': currentRoom});
});

// Listening on new-game event sent from server
socket.on('new-game', function () {
    $('#newGame').hide();
});

// When one player disconnects, listen on the end-game event sent from the server
socket.on('end-game', function (data) {
    var msg = data.msg;
    $('#gameState').hide();
    $('#canvas').hide();
    $('#turnMsg').hide();
    $('#waitingState').show();
    $('#endGame').show();
    $('#newGame').hide();
});