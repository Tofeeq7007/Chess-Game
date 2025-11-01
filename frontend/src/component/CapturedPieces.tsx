interface CapturedPiecesProps {
  capturedByWhite: string[];
  capturedByBlack: string[];
}

const pieceSymbols: {[key: string]: string} = {
  'p': '♟',
  'n': '♞',
  'b': '♝',
  'r': '♜',
  'q': '♛',
};

export const CapturedPieces = ({ 
  capturedByWhite, 
  capturedByBlack 
}: CapturedPiecesProps) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Captured Pieces</h3>
      
      {/* Black's Captured Pieces */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Black Captured</p>
        <div className="flex flex-wrap gap-2">
          {capturedByWhite.length > 0 ? (
            capturedByWhite.map((piece, i) => (
              <div key={i} className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center text-2xl shadow-lg">
                {pieceSymbols[piece] || piece}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No pieces captured</p>
          )}
        </div>
      </div>

      {/* White's Captured Pieces */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">White Captured</p>
        <div className="flex flex-wrap gap-2">
          {capturedByBlack.length > 0 ? (
            capturedByBlack.map((piece, i) => (
              <div key={i} className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center text-2xl shadow-lg">
                {pieceSymbols[piece] || piece}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No pieces captured</p>
          )}
        </div>
      </div>
    </div>
  );
};
