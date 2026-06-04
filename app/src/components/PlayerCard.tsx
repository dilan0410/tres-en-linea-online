import type { Player } from '@/types/game';
import { Wifi, WifiOff } from 'lucide-react';

interface PlayerCardProps {
  player: Player | undefined;
  isCurrentTurn: boolean;
  isMe: boolean;
  showTurn?: boolean;
}

export function PlayerCard({ player, isCurrentTurn, isMe, showTurn = true }: PlayerCardProps) {
  if (!player) {
    return (
      <div className="glass rounded-2xl p-3 flex items-center gap-3 min-w-[140px] opacity-50">
        <div className="w-12 h-12 rounded-full bg-[#252830] animate-pulse" />
        <div className="flex-1">
          <div className="h-4 w-20 bg-[#252830] rounded animate-pulse" />
          <div className="h-3 w-12 bg-[#252830] rounded mt-1 animate-pulse" />
        </div>
      </div>
    );
  }

  const symbolColor = player.symbol === 'X' ? '#D93877' : '#E4A11B';

  return (
    <div 
      className={`
        glass rounded-2xl p-3 flex items-center gap-3 min-w-[140px] relative
        transition-all duration-300
        ${isCurrentTurn && showTurn ? 'neon-box-pink scale-105' : ''}
        ${!player.connected ? 'opacity-60' : ''}
      `}
    >
      {/* Turn indicator */}
      {isCurrentTurn && showTurn && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#D93877] text-white text-[10px] font-pixel animate-bounce">
          TURN
        </div>
      )}

      {/* Avatar with symbol */}
      <div className="relative">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
          style={{ 
            backgroundColor: symbolColor + '20', 
            border: `2px solid ${symbolColor}40`,
            boxShadow: isCurrentTurn ? `0 0 10px ${symbolColor}40` : 'none'
          }}
        >
          <img 
            src={player.symbol === 'X' ? '/avatar-x.png' : '/avatar-o.png'}
            alt={`Avatar ${player.symbol}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Connection status */}
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1A1C23] flex items-center justify-center">
          {player.connected ? (
            <Wifi className="w-2.5 h-2.5 text-green-400" />
          ) : (
            <WifiOff className="w-2.5 h-2.5 text-red-400" />
          )}
        </div>
        
        {/* Symbol badge */}
        <div 
          className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
          style={{ backgroundColor: symbolColor }}
        >
          {player.symbol}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-bold truncate">
          {player.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-pixel">
            {isMe ? '(TU)' : ''}
          </span>
          <span 
            className="text-lg font-black"
            style={{ color: symbolColor }}
          >
            {player.score}
          </span>
        </div>
      </div>
    </div>
  );
}
