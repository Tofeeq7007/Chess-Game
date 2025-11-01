
import { Clock } from 'lucide-react';

interface PlayerCardProps {
  name: string;
  rating: string;
  time: number;
  isActive: boolean;
  color: "white" | "black";
}

export const PlayerCard = ({ 
  name, 
  rating, 
  time, 
  isActive, 
  color 
}: PlayerCardProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`rounded-xl p-4 transition-all ${
      isActive 
        ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 border-2 border-amber-400' 
        : 'bg-gray-800/50 border border-gray-700'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${color === 'white' ? 'bg-white' : 'bg-gray-900'} border-2 ${color === 'white' ? 'border-gray-300' : 'border-gray-500'} flex items-center justify-center`}>
            <span className="text-xl font-bold">
              {color === 'white' ? '♔' : '♚'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-white">{name}</p>
            <p className="text-sm text-gray-400">{rating}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-2 rounded-lg">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className={`font-mono text-lg font-bold ${isActive ? 'text-amber-400' : 'text-gray-400'}`}>
            {formatTime(time)}
          </span>
        </div>
      </div>
    </div>
  );
};
