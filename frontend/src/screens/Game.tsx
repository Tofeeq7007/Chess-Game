import { Button } from "../component/Button"
import { ChessBoard } from "../component/chessboard"
import { useSocket } from "../hook/useSocket"
import { useEffect, useState } from "react"
import {Chess} from "chess.js"
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const ERROR = "error";
export const Game = ()=>{
    const socket = useSocket(); 
    const [chess , setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    useEffect(()=>{
        if(!socket){
            return ;
        }
 
        socket.onmessage =(e)=>{
            const message = JSON.parse(e.data);
            
            switch (message.type){
            case INIT_GAME:
                setStarted(true);
                setBoard(chess.board());
                console.log("Game Initialize");

                break;
            case MOVE:
                const move = message.payload;
                console.log(move);
                chess.move(move);
                setBoard(chess.board());
                console.log("Move");
                break;
            case GAME_OVER:
                console.log("GameOver");
                break;
            case ERROR:
                const {error : errorMessage} = message.payload;
                console.error(errorMessage);
                alert(errorMessage);
                break;
            }    

        }  
    },[socket])
    if(!socket) return <div className="w-full h-screen flex items-center justify-center text-white font-bold">Connecting...</div>;
    return <div className="flex justify-center">
        <div className="pt-8 max-w-screen-lg w-full">
            <div className="grid grid-cols-6 gap-4 w-full">
                <div className="col-span-4 w-full flex justify-center">
                    <ChessBoard  chess={chess} setBoard={setBoard} socket={socket}  board={board} />
                </div>
                <div className="col-span-2 bg-slate-800 w-full flex justify-center">
                    <div className="pt-8">
                        {!started && <Button onClick={()=>{socket.send(JSON.stringify({type:INIT_GAME}))}}>Play</Button>}
                    </div>
                    
                </div>
            </div>
        </div>
        
        
    </div>
}