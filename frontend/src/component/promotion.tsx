import { motion } from 'framer-motion';

type PromotionState = {
  promotion: string;
  popUp: boolean;
};

type PromotionProps = {
  promotionChoice: PromotionState;
  setPromotionChoice: React.Dispatch<React.SetStateAction<PromotionState>>;
  onPromotionSelect: (piece: string) => void;
};

export const Promotion = ({ 
  promotionChoice, 
  setPromotionChoice, 
  onPromotionSelect 
}: PromotionProps) => {
  if (!promotionChoice.popUp) return null;

  const handleChoice = (piece: string) => {
    console.log(piece);
    setPromotionChoice({
      promotion: piece,
      popUp: false,
    });

    if (onPromotionSelect) {
      onPromotionSelect(piece);
    }
  };

  const pieces = [
    { key: 'q', label: 'Queen', symbol: '♕', color: 'from-yellow-500 to-yellow-600' },
    { key: 'r', label: 'Rook', symbol: '♖', color: 'from-gray-600 to-gray-700' },
    { key: 'b', label: 'Bishop', symbol: '♗', color: 'from-green-600 to-green-700' },
    { key: 'n', label: 'Knight', symbol: '♘', color: 'from-blue-600 to-blue-700' },
  ];

  return (
    <motion.div 
      onClick={() => handleChoice('q')} 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 backdrop-blur-md bg-black/50 flex justify-center items-center z-50"
    >
      <motion.div 
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.5, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 w-80 text-center border border-gray-700"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Choose Promotion</h2>
        <div className="grid grid-cols-2 gap-4">
          {pieces.map((piece) => (
            <motion.button
              key={piece.key}
              onClick={() => handleChoice(piece.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-r ${piece.color} text-white rounded-lg p-4 hover:shadow-lg transition-all font-bold`}
            >
              <div className="text-3xl mb-2">{piece.symbol}</div>
              {piece.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
