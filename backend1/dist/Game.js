"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: 'white'
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: 'black'
            }
        }));
    }
    makeMove(socket, move) {
        console.log(move.from + " -> " + move.to);
        if (this.board.turn() === 'w' && socket !== this.player1) {
            console.log('Not your turn player(white) 1');
            socket.send(JSON.stringify({
                type: messages_1.ERROR,
                payload: {
                    error: "Not Your Turn"
                }
            }));
            return;
        }
        if (this.board.turn() === 'b' && socket !== this.player2) {
            console.log('Not your turn player(black) 2');
            socket.send(JSON.stringify({
                type: messages_1.ERROR,
                payload: {
                    error: "Not Your Turn"
                }
            }));
            return;
        }
        //  Is it this users move
        // is this a valid move
        try {
            this.board.move(move);
            console.log("HI 1");
        }
        catch (e) {
            console.log("HI 2");
            console.log("Invalid Move");
            socket.send(JSON.stringify({
                type: messages_1.ERROR,
                payload: {
                    error: "Invalid Move"
                }
            }));
            return;
        }
        // console.log(this.board.isGameOver());
        // const opponent = socket === this.player1 ? this.player2 : this.player1;
        this.player1.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.MOVE,
            payload: move
        }));
        if (this.board.isGameOver()) {
            console.log("HI 3");
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white',
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white',
                }
            }));
            return;
        }
        // const opponent = socket == this.player1? this.player2 :this.player1;
        // opponent.send(JSON.stringify({
        //     type:MOVE,
        //     payload:{
        //         san:this.board.san(move),
        //         lan:`${move.from}-${move.to}`
        //     }
        // }))   
        // const opponent = socket === this.player1 ? this.player2 : this.player1;
        // opponent.send(JSON.stringify({
        //     type: MOVE,
        //     payload: move
        // }));
        // OR  
        // if(this.board.history().length %2 === 0){
        //     this.player2.send(JSON.stringify({
        //         type: MOVE,
        //         payload: move
        //     }))
        // }
        // else{
        //     this.player1.send(JSON.stringify({
        //         type: MOVE,
        //         payload: move
        //     }))            
        // }
        // Update the Board
        // Push the move
        // Check the game is over ?
        // Send the updated board to both players
    }
}
exports.Game = Game;
