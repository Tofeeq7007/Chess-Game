import type { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { Promotion } from "./promotion";

interface Move_type {
  from: string;
  to: string;
  promotion?: string;
}

export const OfflineChessBoard = ({
  board,
  chess,
  onMove,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  chess: Chess;
  onMove: (move: Move_type) => boolean;
}) => {
  const [promotionChoice, setPromotionChoice] = useState({
    promotion: "q",
    popUp: false,
  });

  const [pendingMove, setPendingMove] = useState<Move_type | null>(null);
  const [from, setFrom] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(
    null
  );

  const handlePromotionSelect = (promotionPiece: string) => {
    if (pendingMove) {
      const completeMove = {
        ...pendingMove,
        promotion: promotionPiece,
      };
      const success = onMove(completeMove);
      if (success) {
        setLastMove({
          from: pendingMove.from as Square,
          to: pendingMove.to as Square,
        });
      }
      setPendingMove(null);
    }
    setPromotionChoice({
      promotion: promotionPiece,
      popUp: false,
    });
  };

  const handleSquareClick = (squareRepresention: Square) => {
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

      const success = onMove(move);
      if (success) {
        setLastMove({ from, to: squareRepresention });
      }
      setFrom(null);
    }
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* Promotion Popup */}
      {promotionChoice.popUp && (
        <Promotion
          promotionChoice={promotionChoice}
          setPromotionChoice={setPromotionChoice}
          onPromotionSelect={handlePromotionSelect}
        />
      )}

      <div className="flex mb-2 text-xs text-gray-400 font-bold tracking-widest">
        <div className="w-20 flex justify-center"><span>a</span></div>
        <div className="w-20 flex justify-center"><span>b</span></div>
        <div className="w-20 flex justify-center"><span>c</span></div>
        <div className="w-20 flex justify-center"><span>d</span></div>
        <div className="w-20 flex justify-center"><span>e</span></div>
        <div className="w-20 flex justify-center"><span>f</span></div>
        <div className="w-20 flex justify-center"><span>g</span></div>
        <div className="w-20 flex justify-center"><span>h</span></div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col text-xs text-gray-400 font-bold">
          <span className="w-6 h-20 flex items-center justify-center">8</span>
          <span className="w-6 h-20 flex items-center justify-center">7</span>
          <span className="w-6 h-20 flex items-center justify-center">6</span>
          <span className="w-6 h-20 flex items-center justify-center">5</span>
          <span className="w-6 h-20 flex items-center justify-center">4</span>
          <span className="w-6 h-20 flex items-center justify-center">3</span>
          <span className="w-6 h-20 flex items-center justify-center">2</span>
          <span className="w-6 h-20 flex items-center justify-center">1</span>
        </div>

        <div className="border-8 border-gray-700 rounded-xl shadow-2xl overflow-hidden bg-gray-900">
          {board.map((row, i) => (
            <div key={i} className="flex">
              {row.map((square, j) => {
                const squareRepresention =
                  (String.fromCharCode(97 + (j % 8)) + "" + (8 - i)) as Square;
                const isLight = (i + j) % 2 === 0;
                const isSelected = from === squareRepresention;
                const isLastMoveFrom = lastMove?.from === squareRepresention;
                const isLastMoveTo = lastMove?.to === squareRepresention;

                return (
                  <div
                    key={j}
                    onClick={() => handleSquareClick(squareRepresention)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleSquareClick(squareRepresention)}
                    className={`w-20 h-20 flex items-center justify-center transition-all cursor-move relative
                      ${isLight ? "bg-amber-100" : "bg-amber-700"}
                      ${isSelected ? "ring-4 ring-green-400 ring-inset" : ""}
                      ${isLastMoveFrom || isLastMoveTo ? "bg-opacity-50" : ""}
                      ${isLastMoveFrom ? "bg-yellow-300" : ""}
                      ${isLastMoveTo ? "bg-yellow-400" : ""}
                      hover:brightness-110 transition-all
                    `}
                  >
                    {square ? (
                      <img
                        draggable
                        onDragStart={() => setFrom(squareRepresention)}
                        className="w-12 h-12  shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform rotate-[13deg]"
                        src={`/${
                          square?.color === "b"
                            ? `${square?.type}`
                            : `${square?.type.toUpperCase()}white`
                        } copy.png`}
                        alt={square.type}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex mt-2 text-xs text-gray-400 font-bold tracking-widest">
        <div className="w-6"></div>
        <div className="w-20 flex justify-center"><span>a</span></div>
        <div className="w-20 flex justify-center"><span>b</span></div>
        <div className="w-20 flex justify-center"><span>c</span></div>
        <div className="w-20 flex justify-center"><span>d</span></div>
        <div className="w-20 flex justify-center"><span>e</span></div>
        <div className="w-20 flex justify-center"><span>f</span></div>
        <div className="w-20 flex justify-center"><span>g</span></div>
        <div className="w-20 flex justify-center"><span>h</span></div>
      </div>
    </div>
  );
};
