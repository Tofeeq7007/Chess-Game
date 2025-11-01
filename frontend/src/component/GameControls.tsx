import { Flag, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  onResign: () => void;
  onDrawClaim: () => void;
  onUndo: () => void;
}

export const GameControls = ({ 
  onResign, 
  onDrawClaim, 
  onUndo 
}: GameControlsProps) => {
  return (
    <div className="flex gap-3 mt-6">
      <button 
        onClick={onResign}
        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95"
      >
        🏳️ Resign
      </button>
      <button 
        onClick={onDrawClaim}
        className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
      >
        <Flag className="w-4 h-4" />
        Draw
      </button>
      <button 
        onClick={onUndo}
        className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
      >
        <RotateCcw className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};
