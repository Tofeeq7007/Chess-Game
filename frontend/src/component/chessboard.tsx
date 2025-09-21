import type { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";
import { Promotion } from "./promotion";

interface Move_type{
    from:string,
    to:string,
    promotion?:string
}
export const ChessBoard = ({board,socket,chess}:{
    board:({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];

    socket:WebSocket
    chess:Chess,

}) => {
    const [promotionChoice, setPromotionChoice] = useState({
        promotion:"q",
        popUp : false
    });

    const [pendingMove, setPendingMove] = useState<Move_type | null>(null);
    const [from, setFrom] = useState<Square|null>(null);


    function sendMove(move:Move_type) {
        try{   
            socket.send(JSON.stringify({
                type:MOVE,
                payload:{
                    move
                }
            }));
        }catch(e){
            console.log(e);
            alert("Invalid Move")
        }
        finally{
            
            setFrom(null);
        }        
        
    }    

    // handle promotion selection
    const handlePromotionSelect = (promotionPiece : string)=>{
        if(pendingMove){
            const completeMove = {
                ...pendingMove,
                promotion:promotionPiece
            };
            sendMove(completeMove);
            setPendingMove(null);
        }
        setPromotionChoice({
            promotion:promotionPiece,
            popUp:false
        });
    }
    // const [to ,setTo] = useState<Square|null>(null);
    return (
        <div>
         {promotionChoice.popUp && <Promotion promotionChoice={promotionChoice} setPromotionChoice={setPromotionChoice} onPromotionSelect={handlePromotionSelect}/>   }
        <div className="text-white-200">
            {board.map((row,i)=>{
                return <div key={i} className="flex">
                    {row.map((square,j)=>{
                        const squareRepresention = String.fromCharCode(97 + (j%8))+""+(8-i)  as Square;
                        return <div onClick={()=>{
                            if(!from){
                                setFrom(squareRepresention)
                            }else{
                                
                                const move : Move_type =  {
                                    from,
                                    to:squareRepresention
                                }
                                const piece = chess.get(from);
                                if(piece?.type === "p"){
                                    if((piece.color === "w" && move.to.endsWith("8")) ||
                                        (piece.color==="b" && move.to.endsWith("1"))){
                                        setPendingMove(move);
                                        setPromotionChoice({promotion:"q", popUp:true});
                                        return;// Don't need move immedieatle
                                    }
                                }
                                sendMove(move);

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
        </div>
    )
}

















































// import type { Color, PieceSymbol, Square } from "chess.js";
// import { useState } from "react";
// import { MOVE } from "../screens/Game";

// export const ChessBoard = ({board,socket,chess,setBoard}:{
//     board:({
//         square: Square;
//         type: PieceSymbol;
//         color: Color;
//     } | null)[][];

//     socket:WebSocket
//     chess:any,
//     setBoard:any,

// }) => {

//     const [from, setFrom] = useState<Square|null>(null);
//     // const [to ,setTo] = useState<Square|null>(null);
//     return (
//         <div className="text-white-200 ">
//             {board.map((row,i)=>{
//                 return <div key={i} className="flex">
//                     {row.map((square,j)=>{
//                         const squareRepresention = String.fromCharCode(97 + (j%8))+""+(8-i)  as Square;
//                         return <div onClick={()=>{
//                             if(!from){
//                                 setFrom(squareRepresention)
//                             }else{
//                                 try{
                                    
//                                     chess.move({
//                                         from, 
//                                         to:squareRepresention
//                                     })
//                                     console.log({
//                                         type:"move",
//                                         from,
//                                         to : squareRepresention
//                                     })
//                                     socket.send(JSON.stringify({
//                                         type:MOVE,
//                                         payload:{
//                                             move:{
                                                
//                                                 from,
//                                                 to:squareRepresention
//                                             }
//                                         }
//                                     }));
//                                     setBoard(chess.board());
//                                 }catch(e){
//                                     console.log(e);
//                                     alert("Invalid Move")
//                                 }
//                                 finally{

//                                     setFrom(null);
//                                 }
//                             }
//                         }}
//                             className={`w-16 h-16 ${(i+j)%2===0?"bg-green-500":"bg-slate-500"}`}
//                             key={j}
//                         >
//                             <div className="w-full  h-full justify-center items-center flex">
//                                 <div className="h-full justify-center  flex flex-col">
//                                     {    square ?  <img className="w-6 rotate-16 h-auto" src={`/${square?.color === "b" ? `${square?.type}` : `${square?.type.toUpperCase()}white`} copy.png`} alt={square.type} /> : null  }
//                                 </div>
//                             </div>   
//                         </div>
//                     })}
//                 </div>
//             })
//             }   
//         </div>
//     )
// }