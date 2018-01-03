var socket = io();

var playerNumber;

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

function drawCircle(cellX, cellY) {
    var radius = 25;

    context.beginPath();
    context.arc(cellX, cellY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'pink';
    context.fill();
    context.strokeStyle = '#003300';
    context.stroke();
}

function drawCross(cell1X, cell1Y, cell2X, cell2Y, cell3X, cell3Y, cell4X, cell4Y) {
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
    var positionX = Math.floor(x / 100);
    var positionY = Math.floor(y / 100);
    console.log(x);
    console.log(y);
    console.log(positionX);
    console.log(positionY);

    if(positionX == 0 && positionY == 0) {
//                drawCircle(50, 50);
        drawCross(25, 25, 75, 75, 75, 25, 25, 75);
    }
    if(positionX == 1 && positionY == 0) {
//                drawCircle(150, 50);
        drawCross(125, 25, 175, 75, 175, 25, 125, 75);
    }
    if(positionX == 2 && positionY == 0) {
//                drawCircle(250, 50);
        drawCross(225, 25, 275, 75, 275, 25, 225, 75);
    }
    if(positionX == 0 && positionY == 1) {
//                drawCircle(50, 150);
        drawCross(25, 125, 75, 175, 75, 125, 25, 175);
    }
    if(positionX == 1 && positionY == 1) {
//                drawCircle(150, 150);
        drawCross(125, 125, 175, 175, 175, 125, 125, 175);
    }
    if(positionX == 2 && positionY == 1) {
//                drawCircle(250, 150);
        drawCross(225, 125, 275, 175, 275, 125, 225, 175);
    }
    if(positionX == 0 && positionY == 2) {
//                drawCircle(50, 250);
        drawCross(25, 225, 75, 275, 75, 225, 25, 275);
    }
    if(positionX == 1 && positionY == 2) {
//                drawCircle(150, 250);
        drawCross(125, 225, 175, 275, 175, 225, 125, 275);
    }
    if(positionX == 2 && positionY == 2) {
//                drawCircle(250, 250);
        drawCross(225, 225, 275, 275, 275, 225, 225, 275);
    }
});

$('#roomForm').submit(function (event) {
    event.preventDefault();
    currentRoom = $('input[name=roomid]').val();

    socket.emit("connect-to-room", {'room': currentRoom});
    $('input[name=roomid]').val('');
});

socket.on('connection-message', function (data) {
    var message = data.msg;
    if (message == "Display board") {
        drawGameBoard();
    }
    playerNumber = data.player;
});
