import { XSymbol } from './XSymbol';
import { OSymbol } from './OSymbol';

interface GameBoardProps {
  board: (string | null)[];
  winPattern: number[];
  onCellClick: (position: number) => void;
  isMyTurn: boolean;
  gameStatus: string;
  mySymbol: 'X' | 'O' | null;
}

export function GameBoard({ board, winPattern, onCellClick, isMyTurn, gameStatus, mySymbol }: GameBoardProps) {
  const isGameActive = gameStatus === 'playing';

  return (
    <div className="w-full max-w-[360px] mx-auto">
      {/* Board container */}
      <div 
        className={`
          relative bg-[#1A1C23] rounded-3xl p-3
          ${isGameActive && isMyTurn ? 'neon-box-cyan' : ''}
        `}
        style={{
          boxShadow: isGameActive && isMyTurn 
            ? '0 0 15px rgba(0, 240, 255, 0.2), inset 0 0 15px rgba(0, 240, 255, 0.05)' 
            : 'none'
        }}
      >
        {/* Grid */}
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, index) => {
            const isWinningCell = winPattern.includes(index);
            const isClickable = isGameActive && isMyTurn && cell === null;
            
            return (
              <button
                key={index}
                onClick={() => isClickable && onCellClick(index)}
                disabled={!isClickable}
                className={`
                  board-cell relative aspect-square rounded-xl
                  flex items-center justify-center
                  transition-all duration-200
                  ${isClickable 
                    ? 'bg-[#252830] cursor-pointer hover:bg-[#2D3039] hover:shadow-lg' 
                    : 'bg-[#1E2028]'
                  }
                  ${isWinningCell ? 'winning-cell bg-[#D93877]/20' : ''}
                  ${cell !== null ? 'disabled' : ''}
                `}
                style={isWinningCell ? {
                  boxShadow: '0 0 20px rgba(217, 56, 119, 0.5), inset 0 0 20px rgba(217, 56, 119, 0.1)',
                  border: '2px solid rgba(217, 56, 119, 0.5)'
                } : {}}
              >
                {cell === 'X' && (
                  <div className={isWinningCell ? 'animate-pulse' : ''}>
                    <XSymbol size={56} />
                  </div>
                )}
                {cell === 'O' && (
                  <div className={isWinningCell ? 'animate-pulse' : ''}>
                    <OSymbol size={56} />
                  </div>
                )}
                
                {/* Hover hint for clickable cells */}
                {isClickable && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-30 transition-opacity">
                    {mySymbol === 'X' ? (
                      <XSymbol size={40} className="opacity-20" />
                    ) : (
                      <OSymbol size={40} className="opacity-20" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Turn indicator bar */}
        {isGameActive && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <div 
              className={`
                h-1 rounded-full transition-all duration-500
                ${isMyTurn ? 'w-16 bg-[#00F0FF]' : 'w-8 bg-gray-700'}
              `}
            />
            <span className={`text-xs font-pixel ${isMyTurn ? 'text-[#00F0FF]' : 'text-gray-600'}`}>
              {isMyTurn ? 'TU TURNO' : 'ESPERANDO...'}
            </span>
            <div 
              className={`
                h-1 rounded-full transition-all duration-500
                ${isMyTurn ? 'w-8 bg-gray-700' : 'w-16 bg-[#00F0FF]'}
              `}
            />
          </div>
        )}
      </div>
    </div>
  );
}
