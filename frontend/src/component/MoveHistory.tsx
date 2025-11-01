interface MoveHistoryProps {
  moves: Array<{move: string, white: boolean}>;
}

export const MoveHistory = ({ moves }: MoveHistoryProps) => {
  // Show last 5 moves
  const recentMoves = moves.slice(-5);

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Move History</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {recentMoves.length > 0 ? (
          recentMoves.map((move, i) => (
            <div key={i} className={`p-3 rounded-lg transition-all ${
              move.white 
                ? 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20' 
                : 'bg-gray-700/50 border border-gray-600'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {i}. {move.move}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-gray-900/50 text-gray-400">
                  {move.white ? 'W' : 'B'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No moves yet</p>
        )}
      </div>
    </div>
  );
};