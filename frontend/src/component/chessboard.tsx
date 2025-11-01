import type { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";
import { Promotion } from "./promotion";

interface Move_type {
  from: string;
  to: string;
  promotion?: string;
}

export const ChessBoard = ({
  board,
  socket,
  chess,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  chess: Chess;
}) => {
  const [promotionChoice, setPromotionChoice] = useState({
    promotion: "q",
    popUp: false,
  });

  const [pendingMove, setPendingMove] = useState<Move_type | null>(null);
  const [from, setFrom] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  function sendMove(move: Move_type) {
    try {
      socket.send(
        JSON.stringify({
          type: MOVE,
          payload: { move },
        })
      );
      setLastMove({ from: move.from as Square, to: move.to as Square });
    } catch (e) {
      console.log(e);
      alert("Invalid Move");
    } finally {
      setFrom(null);
    }
  }

  const handlePromotionSelect = (promotionPiece: string) => {
    if (pendingMove) {
      const completeMove = {
        ...pendingMove,
        promotion: promotionPiece,
      };
      sendMove(completeMove);
      setPendingMove(null);
    }
    setPromotionChoice({
      promotion: promotionPiece,
      popUp: false,
    });
  };

  return (
    <div className="flex flex-col items-center">
      {promotionChoice.popUp && (
        <Promotion
          promotionChoice={promotionChoice}
          setPromotionChoice={setPromotionChoice}
          onPromotionSelect={handlePromotionSelect}
        />
      )}
      
      {/* Chessboard Container */}
      <div className="border-8 border-gray-700 rounded-xl shadow-2xl overflow-hidden bg-gray-900">
        {board.map((row, i) => {
          return (
            <div key={i} className="flex">
              {row.map((square, j) => {
                const squareRepresention = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                const isLight = (i + j) % 2 === 0;
                const isSelected = from === squareRepresention;
                const isLastMoveFrom = lastMove?.from === squareRepresention;
                const isLastMoveTo = lastMove?.to === squareRepresention;

                return (
                  <div
                    key={j}
                    onClick={() => {
                      const Goti = chess.get(squareRepresention);
                      if (!from) {
                        if (!Goti) return;
                        if (Goti.color !== chess.turn()) return;
                        setFrom(squareRepresention);
                      } else {
                        const move: Move_type = {
                          from,
                          to: squareRepresention,
                        };
                        const piece = chess.get(from);
                        if (piece?.type === "p") {
                          if (
                            (piece.color === "w" && move.to.endsWith("8")) ||
                            (piece.color === "b" && move.to.endsWith("1"))
                          ) {
                            setPendingMove(move);
                            setPromotionChoice({ promotion: "q", popUp: true });
                            return;
                          }
                        }
                        sendMove(move);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      const Goti = chess.get(squareRepresention);
                      if (!from) {
                        if (!Goti) return;
                        if (Goti.color !== chess.turn()) return;
                        setFrom(squareRepresention);
                      } else {
                        const move: Move_type = {
                          from,
                          to: squareRepresention,
                        };
                        const piece = chess.get(from);
                        if (piece?.type === "p") {
                          if (
                            (piece.color === "w" && move.to.endsWith("8")) ||
                            (piece.color === "b" && move.to.endsWith("1"))
                          ) {
                            setPendingMove(move);
                            setPromotionChoice({ promotion: "q", popUp: true });
                            return;
                          }
                        }
                        sendMove(move);
                      }
                    }}
                    className={`w-20 h-20 flex items-center justify-center transition-all cursor-move relative
                      ${isLight ? "bg-amber-100" : "bg-amber-700"}
                      ${isSelected ? "ring-4 ring-green-400 ring-inset" : ""}
                      ${isLastMoveFrom || isLastMoveTo ? "bg-opacity-50" : ""}
                      ${isLastMoveFrom ? "bg-yellow-300" : ""}
                      ${isLastMoveTo ? "bg-yellow-400" : ""}
                      hover:brightness-110 transition-all
                    `}
                  >
                    {/* Piece Image */}
                    <div className="w-full h-full  flex justify-center items-center">
                      {square ? (
                        <img
                          draggable
                          onDragStart={() => setFrom(squareRepresention)}
                          className="w-12 h-12 shadow-lg rotate-13  cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                          src={`/${
                            square?.color === "b"
                              ? `${square?.type}`
                              : `${square?.type.toUpperCase()}white`
                          } copy.png`}
                          alt={square.type}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Board Coordinates */}
      <div className="flex mt-3 text-xs text-gray-400 font-bold tracking-widest">
        <div className="w-20 flex justify-center"><span>a</span></div>
        <div className="w-20 flex justify-center"><span>b</span></div>
        <div className="w-20 flex justify-center"><span>c</span></div>
        <div className="w-20 flex justify-center"><span>d</span></div>
        <div className="w-20 flex justify-center"><span>e</span></div>
        <div className="w-20 flex justify-center"><span>f</span></div>
        <div className="w-20 flex justify-center"><span>g</span></div>
        <div className="w-20 flex justify-center"><span>h</span></div>
      </div>

      {/* Vertical Coordinates */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex flex-col justify-between text-xs text-gray-400 font-bold h-80">
        <span>8</span>
        <span>7</span>
        <span>6</span>
        <span>5</span>
        <span>4</span>
        <span>3</span>
        <span>2</span>
        <span>1</span>
      </div>
    </div>
  );
}