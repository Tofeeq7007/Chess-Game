
import { useNavigate } from "react-router-dom"
import chessboard from "../assets/chess.jpeg"
import { Button } from "../component/Button";
import { motion } from "framer-motion";

export const Landing = () => {
  const navigate = useNavigate();

  const handlePlayOnline = () => {
    navigate("/game", { state: { mode: "online" } });
  };

  const handlePlayOffline = () => {
    navigate("/game", { state: { mode: "offline" } });
  };

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="pt-12 max-w-screen-lg px-6 w-full">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 items-center">
          
          {/* Chessboard image */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img 
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="max-w-xs md:max-w-md rounded-xl shadow-2xl"
              src={chessboard} 
              alt="chessboard"
            />
          </motion.div>
          
          {/* Text and buttons section */}
          <motion.div 
            className="text-center md:text-left"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
              Play Chess Online
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Challenge friends or players worldwide on the professional chess platform.
            </p>

            {/* TWO BUTTONS */}
            <div className="mt-8 flex flex-col gap-4 justify-center md:justify-start">
              {/* Play Online Button */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handlePlayOnline}
                  variant="primary"
                >
                  🌐 Play Online (Multiplayer)
                </Button>
              </motion.div>

              {/* Play Offline Button */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handlePlayOffline}
                  variant="secondary"
                >
                  🤖 Play Offline
                </Button>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
