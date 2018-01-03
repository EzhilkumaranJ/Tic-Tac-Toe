var socket = io();

var playerNumber;
var positionX;
var positionY;
var playerTurn;
var gameBoard;
var gameState;

window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    size = canvas.offsetWidth;
    square = Math.floor(size/3);
};
function drawGameBoard() {
    //Line 1
    context.beginPath();
    context.moveTo(square, 0); //defines starting point of line 1
    context.lineTo(square, 300); //ending point of line 1
    context.stroke();
    //Line 2
    context.beginPath();
    context.moveTo(square * 2, 0);
    context.lineTo(square * 2, 300);
    context.stroke();
    //Line 3
    context.beginPath();
    context.moveTo(0, square);
    context.lineTo(300, square);
    context.stroke();
    //Line 4
    context.beginPath();
    context.moveTo(0, square*2);
    context.lineTo(300, square*2);
    context.stroke();

}

function drawCircle(positionX, positionY) {
    var cellX, cellY;
    var radius = 25;

    if (positionX === 0 && positionY === 0) {
        cellX = 50;
        cellY = 50;
    }
    if(positionX === 1 && positionY === 0) {
        cellX = 150;
        cellY = 50;
    }
    if(positionX === 2 && positionY === 0) {
        cellX = 250;
        cellY = 50;
    }
    if(positionX === 0 && positionY === 1) {
        cellX = 50;
        cellY = 150;
    }
    if(positionX === 1 && positionY === 1) {
        cellX = 150;
        cellY = 150;
    }
    if(positionX === 2 && positionY === 1) {
        cellX = 250;
        cellY = 150;
    }
    if(positionX === 0 && positionY === 2) {
        cellX = 50;
        cellY = 250;
    }
    if(positionX === 1 && positionY === 2) {
        cellX = 150;
        cellY = 250;
    }
    if(positionX === 2 && positionY === 2) {
        cellX = 250;
        cellY = 250;
    }

    context.beginPath();
    context.arc(cellX, cellY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'pink';
    context.fill();
    context.strokeStyle = '#003300';
    context.stroke();
}

function drawCross(positionX, positionY) {
    var cell1X, cell1Y, cell2X, cell2Y, cell3X, cell3Y, cell4X, cell4Y;

    if (positionX === 0 && positionY === 0) {
        cell1X = 25, cell1Y = 25, cell2X = 75, cell2Y = 75, cell3X = 75, cell3Y = 25, cell4X = 25, cell4Y = 75;
    }
    if(positionX === 1 && positionY === 0) {
        cell1X = 125, cell1Y = 25, cell2X = 175, cell2Y = 75, cell3X = 175, cell3Y = 25, cell4X = 125, cell4Y = 75;
    }
    if(positionX === 2 && positionY === 0) {
        cell1X = 225, cell1Y = 25, cell2X = 275, cell2Y = 75, cell3X = 275, cell3Y = 25, cell4X = 225, cell4Y = 75;
    }
    if(positionX === 0 && positionY === 1) {
        cell1X = 25, cell1Y = 125, cell2X = 75, cell2Y = 175, cell3X = 75, cell3Y = 125, cell4X = 25, cell4Y = 175;
    }
    if(positionX === 1 && positionY === 1) {
        cell1X = 125, cell1Y = 125, cell2X = 175, cell2Y = 175, cell3X = 175, cell3Y = 125, cell4X = 125, cell4Y = 175;
    }
    if(positionX === 2 && positionY === 1) {
        cell1X = 225, cell1Y = 125, cell2X = 275, cell2Y = 175, cell3X = 275, cell3Y = 125, cell4X = 225, cell4Y = 175;
    }
    if(positionX === 0 && positionY === 2) {
        cell1X = 25, cell1Y = 225, cell2X = 75, cell2Y = 275, cell3X = 75, cell3Y = 225, cell4X = 25, cell4Y = 275;
    }
    if(positionX === 1 && positionY === 2) {
        cell1X = 125, cell1Y = 225, cell2X = 175, cell2Y = 275, cell3X = 175, cell3Y = 225, cell4X = 125, cell4Y = 275;
    }
    if(positionX === 2 && positionY === 2) {
        cell1X = 225, cell1Y = 225, cell2X = 275, cell2Y = 275, cell3X = 275, cell3Y = 225, cell4X = 225, cell4Y = 275;
    }

    // line 1
    context.beginPath();
    context.moveTo(cell1X, cell1Y);
    context.lineTo(cell2X, cell2Y);
    context.lineWidth = 5;
    context.strokeStyle = '#ff0000';
    context.stroke();
    // line 2
    context.beginPath();
    context.moveTo(cell3X, cell3Y);
    context.lineTo(cell4X, cell4Y);
    context.lineWidth = 5;
    context.strokeStyle = '#ff0000';
    context.stroke();
}

canvas.addEventListener('click', function(event){
    console.log('canvas clicked');
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;

    positionX = Math.floor(x / 100);
    positionY = Math.floor(y / 100);

    if (playerTurn === true && gameBoard[positionX][positionY] === undefined) {
        // Setting player turn as false even before waiting for the server to make sure user don't click twice
        playerTurn = false;

        if (playerNumber === 1) {
            drawCross(positionX, positionY);
        } else {
            drawCircle(positionX, positionY);
        }
        socket.emit('selection', {
            'cell': {
                'x': positionX,
                'y': positionY
            },
            'room': currentRoom
        });
    }
});

$('#roomForm').submit(function (event) {
    event.preventDefault();
    currentRoom = $('input[name=roomid]').val();

    socket.emit("connect-to-room", {'room': currentRoom});
    $('input[name=roomid]').val('');
});

socket.on('connection-message', function (data) {
    drawGameBoard();
    playerNumber = data.player;
    playerTurn = data.playerTurn;
    gameBoard = data.board;
    gameState = data.state;

    if (playerTurn) {
        document.getElementById('turnMsg').innerText = "Your Turn";
    } else {
        document.getElementById('turnMsg').innerText = "Waiting";
    }

    if (playerNumber === 1) {
        document.getElementById('inputSign').innerText = "X";
    } else {
        document.getElementById('inputSign').innerText = "O";
    }
});
