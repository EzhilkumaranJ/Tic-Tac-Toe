# Tic-Tac-Toe

Multiplayer game with multiple game room support. Using NodeJS, Socket.io, HTML5 Canvas

This is a simple tic tac toe game with multiple game room support, where we play against an opponent. The goal is to complete one row or one column or one diagonal with same sign either ("X" or "O").

The game is played by two player connected to the same Room.

## Steps

* First player generate random game room ID and clicks on connect button to connect to the room. 

* Send same room id to second player via any medium

* Second Player connects to the same game room by pasting the same room id

* Then both player connects to the same game room

* Play the game of tic tac toe


## Technology Used

* The server is developed in Node JS.

* Websocket is used to communicate between server and client. 

* HTML5 Canvas is used to draw game borad, circle and cross.

* Other libraries used - Underscore.js, jquery

## Implementation

* Server code is divided in two files - app.js and game_app.js

* In app.js, all the network related logics are described, also server running code is described here.

* In game_app.js, all the game related logics are described.

Click [here](IMPLEMENTATION.md) for more details on the implementation

## How to start

Clone this repo or download the source code.

Install the libraries by running `npm install`

Run the server by running `node app.js`


