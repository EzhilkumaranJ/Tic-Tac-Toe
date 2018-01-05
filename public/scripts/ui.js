var generateRoomBtn = document.getElementById('generate-room-id');
var gameRoomConnectBtn = document.getElementById('connect-button');
var roomLink = document.getElementById('room-link');
var gameStateMsg = document.getElementById('gameState');
var turnMsg = document.getElementById('turnMsg');
var canvas = document.getElementById("canvas");
var newGame = document.getElementById("newGame");
var newGameBtn = document.getElementById("new-game-btn");

var randomString = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 12; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

generateRoomBtn.addEventListener('click', function () {
    var randomRoomId = randomString();
    console.log(randomRoomId);
    $('input[name=roomid]').val(randomRoomId);
});