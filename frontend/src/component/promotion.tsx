type PromotionState = {
  promotion: string;
  popUp: boolean;
};

type PromotionProps = {
  promotionChoice: PromotionState;
  setPromotionChoice: React.Dispatch<React.SetStateAction<PromotionState>>;
  onPromotionSelect: (piece:string) => void;
};

export const Promotion = ({ promotionChoice, setPromotionChoice,onPromotionSelect }: PromotionProps) => {
  if (!promotionChoice.popUp) return null; // ✅ don't render until needed

  const handleChoice = (piece: string) => {
    console.log(piece);
    setPromotionChoice({
      promotion: piece,
      popUp: false, // close popup after selection
    });

    // Ye callback parent component ko dena hoga
    if(onPromotionSelect){
        onPromotionSelect(piece);
    }
  };

  return (
    <div onClick={()=>handleChoice("q")} className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-64 text-center">
        <h2 className="text-lg font-bold mb-4">Choose Promotion</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleChoice("q")}
            className="bg-yellow-500 text-white rounded p-2 hover:bg-yellow-600"
          >
            ♕ Queen
          </button>
          <button
            onClick={() => handleChoice("r")}
            className="bg-gray-700 text-white rounded p-2 hover:bg-gray-800"
          >
            ♖ Rook
          </button>
          <button
            onClick={() => handleChoice("b")}
            className="bg-green-600 text-white rounded p-2 hover:bg-green-700"
          >
            ♗ Bishop
          </button>
          <button
            onClick={() => handleChoice("n")}
            className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
          >
            ♘ Knight
          </button>
        </div>
      </div>
    </div>
  );
};
