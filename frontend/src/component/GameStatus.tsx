interface GameStatusProps {
  moveCount: number;
  evaluation: number;
  accuracy: number;
}

export const GameStatus = ({ 
  moveCount, 
  evaluation, 
  accuracy 
}: GameStatusProps) => {
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-3">Game Status</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Total Moves:</span>
          <span className="font-semibold text-white">{moveCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Evaluation:</span>
          <span className={`font-semibold ${evaluation > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {evaluation > 0 ? '+' : ''}{evaluation.toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Accuracy:</span>
          <span className="font-semibold text-green-400">{accuracy}%</span>
        </div>
      </div>
    </div>
  );
};