import type { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({board,socket,chess,setBoard}:{
    board:({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];

    socket:WebSocket
    chess:any,
    setBoard:any,

}) => {

    const [from, setFrom] = useState<Square|null>(null);
    // const [to ,setTo] = useState<Square|null>(null);
    return (
        <div className="text-white-200 ">
            {board.map((row,i)=>{
                return <div key={i} className="flex">
                    {row.map((square,j)=>{
                        const squareRepresention = String.fromCharCode(97 + (j%8))+""+(8-i)  as Square;
                        return <div onClick={()=>{
                            if(!from){
                                setFrom(squareRepresention)
                            }else{
                                socket.send(JSON.stringify({
                                    type:MOVE,
                                    payload:{
                                        move:{
                                            
                                            from,
                                            to:squareRepresention
                                        }
                                    }
                                }));
                                try{

                                    chess.move({
                                        from, 
                                        to:squareRepresention
                                    })
                                    setBoard(chess.board());
                                    console.log({
                                        type:"move",
                                        from,
                                        to : squareRepresention
                                    })
                                }catch(e){
                                    console.log(e);
                                    alert("Invalid Move")
                                }
                                finally{

                                    setFrom(null);
                                }
                            }
                        }}
                            className={`w-16 h-16 ${(i+j)%2===0?"bg-green-500":"bg-slate-500"}`}
                            key={j}
                        >
                            <div className="w-full  h-full justify-center items-center flex">
                                <div className="h-full justify-center  flex flex-col">
                                    {    square ?  <img className="w-6 rotate-16 h-auto" src={`/${square?.color === "b" ? `${square?.type}` : `${square?.type.toUpperCase()}white`} copy.png`} alt={square.type} /> : null  }
                                </div>
                            </div>   
                        </div>
                    })}
                </div>
            })
            }   
        </div>
    )
}