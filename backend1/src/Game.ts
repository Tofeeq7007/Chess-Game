import { WebSocket } from "ws";
import { Chess, Move } from 'chess.js';
import { ERROR, GAME_OVER, INIT_GAME, MOVE } from "./messages";
export class Game {

    public player1 : WebSocket;
    public player2 : WebSocket;
    private board : Chess; 
    private startTime : Date;

    constructor(player1:WebSocket , player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:'white'
            }
        }));
        this.player2.send(JSON.stringify({
            type:INIT_GAME,  
            payload:{
                color:'black'
            }
        }));
    }
    makeMove(socket:WebSocket, move: {
        from:string,
        to:string,
        promotion?:string
    }){
        console.log(move.from + " -> "+ move.to)

        if(this.board.turn() === 'w'&& socket !== this.player1 ){
            console.log('Not your turn player(white) 1');
            socket.send(JSON.stringify({
                type:ERROR,
                payload:{
                    error:"Not Your Turn"
                }
            }))
            return ;
        }
        if(this.board.turn() === 'b' && socket !== this.player2 ){
            console.log('Not your turn player(black) 2');
            socket.send(JSON.stringify({
                type:ERROR,
                payload:{
                    error:"Not Your Turn"
                }
            }))
            return ;
        }
        //  Is it this users move
        // is this a valid move
        try{
            this.board.move(move);
            console.log("HI 1")
        }
        catch(e){
            console.log("HI 2");
            console.log("Invalid Move");
            socket.send(JSON.stringify({
                type:ERROR,
                payload:{
                    error:"Invalid Move"
                }    
            }));
            return;
        }

        // console.log(this.board.isGameOver());
        // const opponent = socket === this.player1 ? this.player2 : this.player1;
        this.player1.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
        this.player2.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));     
        
        
        if(this.board.isGameOver()){
            console.log("HI 3")
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner : this.board.turn() === 'w' ? 'black' : 'white',
                }
            }))
            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner : this.board.turn() === 'w' ? 'black' : 'white',
                }
            }))   
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