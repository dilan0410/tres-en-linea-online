import { useState } from 'react';
import { Trophy, Frown, Minus, Home, RotateCcw, Check, Clock } from 'lucide-react';
import { XSymbol } from '@/components/XSymbol';
import { OSymbol } from '@/components/OSymbol';
import type { Room } from '@/types/game';

interface ResultProps {
  room: Room;
  mySymbol: 'X' | 'O' | null;
  rematchRequested: boolean;
  onRematch: () => void;
  onCancelRematch: () => void;
  onHome: () => void;
}

export function Result({ room, mySymbol, rematchRequested, onRematch, onCancelRematch, onHome }: ResultProps) {
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  
  const playerX = room.players.find(p => p.symbol === 'X');
  const playerO = room.players.find(p => p.symbol === 'O');
  let result: 'win' | 'lose' | 'tie' = 'tie';
  if (room.winner === 'tie') {
    result = 'tie';
  } else if (room.winner === mySymbol) {
    result = 'win';
  } else {
    result = 'lose';
  }

  const bothWantRematch = room.players.length === 2 && room.players.every(p => p.rematchRequested);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {result === 'win' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#D93877]/10 blur-[100px]" />
        )}
        {result === 'lose' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#4A5AEF]/10 blur-[100px]" />
        )}
        {result === 'tie' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#E4A11B]/10 blur-[100px]" />
        )}
      </div>

      <div className="relative z-10 w-full max-w-[360px] animate-pop-in">
        {/* Result icon */}
        <div className="text-center mb-6">
          {result === 'win' && (
            <div className="animate-bounce-in">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-b from-[#D93877] to-[#B52D63] flex items-center justify-center shadow-xl shadow-pink-500/30">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h1 className="mt-4 text-5xl font-black text-white font-arcade skew-text neon-text-pink">
                GANASTE!
              </h1>
            </div>
          )}
          
          {result === 'lose' && (
            <div className="animate-bounce-in">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-b from-[#4A5AEF] to-[#3A4ADF] flex items-center justify-center shadow-xl shadow-blue-500/30">
                <Frown className="w-12 h-12 text-white" />
              </div>
              <h1 className="mt-4 text-5xl font-black text-white font-arcade skew-text">
                PERDISTE
              </h1>
            </div>
          )}
          
          {result === 'tie' && (
            <div className="animate-bounce-in">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-b from-[#E4A11B] to-[#C48A17] flex items-center justify-center shadow-xl shadow-yellow-500/30">
                <Minus className="w-12 h-12 text-white" />
              </div>
              <h1 className="mt-4 text-5xl font-black text-white font-arcade skew-text neon-text-yellow">
                EMPATE!
              </h1>
            </div>
          )}
        </div>

        {/* Score board */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            {/* Player X */}
            <div className="text-center flex-1">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#D93877]/20 flex items-center justify-center mb-2">
                <XSymbol size={32} animated={false} />
              </div>
              <p className="text-white text-sm font-bold truncate">{playerX?.name}</p>
              <p className="text-[#D93877] text-2xl font-black">{playerX?.score}</p>
            </div>

            {/* VS */}
            <div className="px-4">
              <span className="text-gray-600 font-black text-xl font-arcade">VS</span>
            </div>

            {/* Player O */}
            <div className="text-center flex-1">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#E4A11B]/20 flex items-center justify-center mb-2">
                <OSymbol size={32} animated={false} />
              </div>
              <p className="text-white text-sm font-bold truncate">{playerO?.name}</p>
              <p className="text-[#E4A11B] text-2xl font-black">{playerO?.score}</p>
            </div>
          </div>

          {/* Round info */}
          <div className="mt-3 pt-3 border-t border-white/10 text-center">
            <span className="text-xs text-gray-500 font-pixel">
              RONDA {room.round} COMPLETADA
            </span>
          </div>
        </div>

        {/* Winner announcement */}
        {room.winner !== 'tie' && (
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-bold">
                {room.winner === 'X' ? playerX?.name : playerO?.name}
              </span>
              {' '}ganó esta ronda
            </p>
          </div>
        )}

        {/* Rematch section */}
        <div className="space-y-3">
          {bothWantRematch ? (
            <div className="glass rounded-2xl p-4 text-center animate-pulse">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold">Ambos quieren revancha!</span>
              </div>
              <p className="text-gray-400 text-xs font-pixel">Iniciando nueva ronda...</p>
            </div>
          ) : rematchRequested ? (
            <div className="glass rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-[#E4A11B] animate-pulse" />
                <span className="text-[#E4A11B] font-bold">Esperando al oponente...</span>
              </div>
              <button
                onClick={onCancelRematch}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancelar solicitud
              </button>
            </div>
          ) : (
            <button
              onClick={onRematch}
              className="
                w-full py-4 rounded-2xl font-bold text-lg text-white
                bg-gradient-to-r from-[#D93877] to-[#B52D63]
                shadow-lg shadow-pink-500/20
                hover:shadow-xl hover:shadow-pink-500/30
                transition-all btn-press
                flex items-center justify-center gap-2
              "
            >
              <RotateCcw className="w-5 h-5" />
              REVANCHA
            </button>
          )}

          <button
            onClick={() => setShowConfirmLeave(true)}
            className="
              w-full py-3 rounded-2xl font-bold text-sm
              glass text-gray-400 hover:text-white
              transition-all btn-press
              flex items-center justify-center gap-2
            "
          >
            <Home className="w-4 h-4" />
            SALIR AL MENÚ
          </button>
        </div>
      </div>

      {/* Confirm leave modal */}
      {showConfirmLeave && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-pop-in">
          <div className="glass rounded-3xl p-6 w-[300px] text-center">
            <h3 className="text-xl font-bold text-white mb-2">Salir?</h3>
            <p className="text-sm text-gray-400 mb-6">
              Si sales, perderás el progreso de esta sala.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowConfirmLeave(false);
                  onHome();
                }}
                className="w-full py-3 rounded-2xl bg-red-500/20 text-red-400 font-bold hover:bg-red-500/30 transition-all btn-press"
              >
                SALIR
              </button>
              <button
                onClick={() => setShowConfirmLeave(false)}
                className="w-full py-3 rounded-2xl glass text-gray-400 font-bold hover:text-white transition-all btn-press"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
