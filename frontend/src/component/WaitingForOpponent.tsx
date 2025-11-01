import { motion } from 'framer-motion';

export const WaitingForOpponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6">
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
            <span className="text-6xl">♟</span>
          </div>
        </motion.div>

        <h1 className="text-4xl font-bold text-white mb-4">Waiting for Opponent</h1>
        <p className="text-gray-400 text-lg mb-8">Finding a worthy opponent for you...</p>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mb-12">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-3 h-3 bg-amber-400 rounded-full"
            />
          ))}
        </div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-500 text-sm"
        >
          Game ID: #12847 • Room: Public
        </motion.div>
      </div>
    </div>
  );
};
