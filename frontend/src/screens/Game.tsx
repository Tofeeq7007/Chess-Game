import { useOfflineGame } from "../hook/useOfflineGame";
import { Button } from "../component/Button"
import { ChessBoard } from "../component/chessboard"
import { useSocket } from "../hook/useSocket"
import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { Chess } from "chess.js"
import { PlayerCard } from "../component/PlayerCard"
import { GameControls } from "../component/GameControls"
import { CapturedPieces } from "../component/CapturedPieces"
import { MoveHistory } from "../component/MoveHistory"
import { GameStatus } from "../component/GameStatus"
import { WaitingForOpponent } from "../component/WaitingForOpponent"
import { OfflineChessBoard } from "../component/OfflineChessBoard";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const ERROR = "error";

export const Game = () => {
  const location = useLocation();
  const socket = useSocket();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Game Mode (online or offline)
  const gameMode = location.state?.mode || "online";
  
  // Use offline game hook for offline mode
  const offlineGame = useOfflineGame();
  
  // Game States for ONLINE mode
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [playClicked, setPlayClicked] = useState(0);
  const [moves, setMoves] = useState<Array<{move: string, white: boolean}>>([]);
  const [capturedByWhite, setCapturedByWhite] = useState<string[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>([]);

  // ============ OFFLINE MODE HANDLERS ============
  const handleOfflineMove = (moveData: {from: string, to: string, promotion?: string}) => {
    const success = offlineGame.makeMove(moveData);
    
    if (success && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.warn("Audio blocked:", err));
    }

    return success;
  };

  const handleOfflinePlayClick = () => {
    offlineGame.startGame();
  };

  // ============ ONLINE MODE SOCKET LOGIC (KEEP EXISTING) ============
  useEffect(() => {
    if (!socket || gameMode !== "online") {
      return;
    }

    socket.onmessage = (e) => {
      const message = JSON.parse(e.data);

      switch (message.type) {
        case INIT_GAME:
          setStarted(true);
          setWaitingForOpponent(false);
          setBoard(chess.board());
          setTurn("w");
          console.log("Game Initialize");
          break;

        case MOVE: {
          if (audioRef.current) {
            const audioEl = audioRef.current;
            audioEl.currentTime = 0;
            audioEl.play().catch((err) => {
              console.warn("Audio play blocked:", err);
            });
          }
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          setTurn(chess.turn());
          
          setMoves(prev => [...prev, { 
            move: `${move.from}-${move.to}`, 
            white: chess.turn() === "b" 
          }]);
          break;
        }

        case GAME_OVER: {
          console.log("GameOver");
          const GameDecision = message.payload;
          alert("GameOver\n Winner => " + GameDecision.winner);
          socket.close();
          break;
        }

        case ERROR: {
          const { error: errorMessage } = message.payload;
          console.error(errorMessage);
          alert(errorMessage);
          break;
        }
      }
    };
  }, [socket, gameMode]);

  // ============ ONLINE MODE PLAY BUTTON ============
  const handlePlayClick = () => {
    if (gameMode === "online") {
      const newCount = playClicked + 1;
      setPlayClicked(newCount);

      if (newCount === 1) {
        setWaitingForOpponent(true);
        socket?.send(JSON.stringify({ type: INIT_GAME }));
      }
    //    else if (newCount === 2) {
    //     setWaitingForOpponent(false);
    //     socket?.send(JSON.stringify({ type: INIT_GAME }));
    //   }
    }
  };
    const x = false;
    if(x){ 
      setCapturedByBlack([]);
      setCapturedByWhite([]);
      setChess(new Chess());
    }
  if (gameMode === "online" && !socket) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white font-bold text-xl">
        🔌 Connecting to server...
      </div>
    );
  }

  if (gameMode === "online" && waitingForOpponent) {
    return <WaitingForOpponent />;
  }

  // ============ RENDER OFFLINE MODE ============
  if (gameMode === "offline") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
        <audio ref={audioRef} src={"/chess_move.mp3"}></audio>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Chess vs Player
                </h1>
                <p className="text-gray-400">
                  Offline • Local Play
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chess Board Section */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl">
                
                {/* Black Player Card */}
                <PlayerCard 
                  name={offlineGame.turn === "b" ? "Black (Your Turn)" : "Black"} 
                  rating="Local Player" 
                  time={600}
                  isActive={offlineGame.turn === "b"}
                  color="black"
                />

                {/* Chess Board */}
                <div className="my-8">
                  <div className="bg-gray-950 p-4 rounded-xl shadow-inner">
                    <OfflineChessBoard 
                      chess={offlineGame.chess} 
                      board={offlineGame.board}
                      onMove={handleOfflineMove}
                    />
                  </div>
                </div>

                {/* White Player Card */}
                <PlayerCard 
                  name={offlineGame.turn === "w" ? "White (Your Turn)" : "White"} 
                  rating="Local Player" 
                  time={600}
                  isActive={offlineGame.turn === "w"}
                  color="white"
                />

                {/* Game Controls */}
                {!offlineGame.started && (
                  <div className="mt-6 flex justify-center">
                    <Button onClick={handleOfflinePlayClick} variant="primary">
                      🎮 Start Local Game
                    </Button>
                  </div>
                )}

                {offlineGame.started && (
                  <GameControls 
                    onResign={() => {
                      alert("Game Resigned!");
                      offlineGame.resetGame();
                    }}
                    onDrawClaim={() => alert("Draw Claimed!")}
                    onUndo={() => alert("Move Undone")}
                  />
                )}

                {/* Game Over Message */}
                {offlineGame.gameOver && (
                  <div className="mt-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/50 rounded-xl p-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      🏁 Game Over!
                    </h2>
                    <p className="text-lg text-gray-300 mb-4">
                      Winner: <span className="font-bold text-amber-400">{offlineGame.winner}</span>
                    </p>
                    <Button onClick={offlineGame.resetGame} variant="primary">
                      Play Again
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <CapturedPieces 
                capturedByWhite={offlineGame.capturedByWhite}
                capturedByBlack={offlineGame.capturedByBlack}
              />

              <MoveHistory moves={offlineGame.moves} />

              <GameStatus 
                moveCount={offlineGame.moves.length}
                evaluation={0}
                accuracy={0}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ RENDER ONLINE MODE (EXISTING CODE) ============
    if(!socket) return <div className="w-full h-screen flex items-center justify-center text-white font-bold">Connecting...</div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      <audio ref={audioRef} src={"/chess_move.mp3"}></audio>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {gameMode === "online" ? "Chess Master Online" : "Chess vs Computer"}
              </h1>
              <p className="text-gray-400">
                {gameMode === "online" ? "Rapid • Multiplayer" : "Offline • Single Player"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chess Board Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl">
              
              {/* Black Player Card */}
              <PlayerCard 
                name={gameMode === "online" ? "Opponent" : "Computer"} 
                rating="2800 Rating" 
                time={595}
                isActive={turn === "b"}
                color="black"
              />

              {/* Chess Board */}
              <div className="my-8">
                <div className="bg-gray-950 p-4 rounded-xl shadow-inner">
                  <ChessBoard chess={chess} socket={socket} board={board} />
                </div>
              </div>

              {/* White Player Card */}
              <PlayerCard 
                name="You" 
                rating="2650 Rating" 
                time={600}
                isActive={turn === "w"}
                color="white"
              />

              {/* Game Controls */}
              {!started && (
                <div className="mt-6 flex justify-center">
                  <Button onClick={handlePlayClick} variant="primary">
                    {gameMode === "online" 
                      ? (playClicked === 0 ? "🎮 Wait for Opponent" : "🎮 Start Game")
                      : "🎮 Start Game"}
                  </Button>
                </div>
              )}

              {started && (
                <GameControls 
                  onResign={() => alert("Game Resigned")}
                  onDrawClaim={() => alert("Draw Claimed")}
                  onUndo={() => alert("Move Undone")}
                />
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Captured Pieces */}
            <CapturedPieces 
              capturedByWhite={capturedByWhite}
              capturedByBlack={capturedByBlack}
            />

            {/* Move History */}
            <MoveHistory moves={moves} />

            {/* Game Status */}
            <GameStatus 
              moveCount={moves.length}
              evaluation={2.5}
              accuracy={87}
            />
          </div>
        </div>
      </div>
    </div>
  );
};