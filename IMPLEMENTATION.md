# IMPLEMENTATION

Being a multiplayer room-based game over the internet, this game has two major sections: Frontend and Backend. 

## Backend
Backend has two important sections. The network layer and the Game Logic Layer.

The network layer is responsible for the connection between the browser and the client.
Two types of network connections are used:
* HTTP
    * HTTP is used to serve index.html and static files (images, javascript, css etc.)
* Websocket
    *  Websocket is used to maintain the duplex connnection between the server and the client. 
    All the messages (during the gameplay) from the browser are sent over the websocket.
    All the messages from the server to update the browser are also sent over the websocket.

### Structure
The backend is divided mainly in two files:
#### app.js
This file is responsible for the network layer.

This file serves the index.html file and servers the static files using expressjs.

Static files are served using ExpressJS's static middleware.

Webscoket server waits for the connection from the browser and setups the callbacks for different type of message events.

##### Events:
* "connect-to-room"
    * When a "connect-to-room" message comes from the browser we do these things in order:
      * Create a room with the room id provided if the room is not created.
      * Adds the current socket connection as a player to the room.
      * If the player is added successfully, start the game.
* "playerSelection"
    * When "playerSelection" message comes from the browser we do these things in order:
    * Forward the selection to game_app to further process the input and update the game state.
    * Calculate the result of the game (meaning whether the game has resulted into a win/draw).
    * Triggers the broadcast of the game state to all the connected players.
* "new-game"
    * Forwards the new-game message to the game layer which clears the previous game data and initializes the game state.
* "disconnect"
    * Triggers these changes:
        * Remove the player from all the rooms the socket belongs to.
#### game_app.js
gameServer - This is the main global variable which encompasses everything.
gameServer.gameRoom - contains all the rooms based on the roomid as the key
* gameServer.createRoom
    * This function creates the room based on roomId, if the room doesn't exist.
* gameServer.addPlayers
    * Takes two arguments: roomId, player(socket)
    * Connects the player as "player1" or "player2" in that order.
    * Emits a "room-full" message if the room already have both players to the new player who is trying to add.
* gameServer.startGame
    * If both players are not connected send the "wait" message to the player who is connecting.
    * If both players are connected:
        * Update the game state
        * Reset the game board
        * Send the start event with the board
* gameServer.processInput
    * Takes two arguments: roomId, selection
    * Fetches the room based on roomId
    * Sets the selection to the board with the constant of the user who made the selection
        * 1 for player1
        * 2 for player2
    * Changes the player turn by toggling the flag firstPlayerTurn
* gameServer.calculateResult
    * Fetches the room
    * Resets the game state and result
    * Calculates the game result and state
        * Checks for all the possible combinations for each players and sets the state and player_won accordingly.
        * If no player won then checks the if the match is draw and sets the game state accordingly.
* check_draw
    * Helper function which return true|false based on whether the all the cells of the board are filled or not
* gameServer.broadcastResult:
    * Sends/broadcasts the state of the game to both players
        * Format of the broadcast:
             {
                "playerTurn": <true|false>, // Whether it is the player's turn
                "board": [[], [], []], // 2D array containing the entire board
                "state": <ready|waiting|won|in_progress|draw>, // Represent the state of the game
                "playerWon": <true|false>, // If the game state is 'won', this value represents who won the game
             }
* gameServer.newGame
    * Resets the baord
    * Emits the 'new_game' message to both players
    * Resets the state
    * Starts the game
* gameServer.removeClient
    * Takes a player/socket as an argument
    * Removes the player from the room
    * If other player is still connected, sends the 'end-game' message to the other player.

## Frontend
