import { useState, useCallback } from "react";
import { Chess } from "chess.js";

interface Move {
  from: string;
  to: string;
  promotion?: string;
}

export const useOfflineGame = () => {
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [moves, setMoves] = useState<Array<{move: string, white: boolean}>>([]);
  const [capturedByWhite, setCapturedByWhite] = useState<string[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const makeMove = useCallback((move: Move) => {
    try {
      const result = chess.move(move);
      
      if (!result) {
        console.log("Invalid move");
        return false;
      }

      // Update board
      setBoard([...chess.board()]);
      
      // Update turn
      setTurn(chess.turn());
      
      // Track move
      setMoves(prev => [...prev, { 
        move: `${move.from}-${move.to}`, 
        white: chess.turn() === "b" 
      }]);

      // Check game status
      if (chess.isCheckmate()) {
        setGameOver(true);
        setWinner(chess.turn() === "w" ? "Black" : "White");
      } else if (chess.isDraw()) {
        setGameOver(true);
        setWinner("Draw");
      }

      return true;
    } catch (e) {
      console.error("Move error:", e);
      return false;
    }
  }, [chess]);

  const startGame = useCallback(() => {
    const newChess = new Chess();
    setChess(newChess);
    setBoard(newChess.board());
    setStarted(true);
    setTurn("w");
    setMoves([]);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setGameOver(false);
    setWinner(null);
  }, []);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  return {
    chess,
    board,
    started,
    turn,
    moves,
    capturedByWhite,
    capturedByBlack,
    gameOver,
    winner,
    makeMove,
    startGame,
    resetGame,
  };
};