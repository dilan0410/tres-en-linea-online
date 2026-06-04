import { useState } from 'react';
import { Copy, Check, Wifi, Users, ArrowLeft, Clock } from 'lucide-react';
import type { Room } from '@/types/game';

interface LobbyProps {
  room: Room;
  onLeave: () => void;
  onCopyCode: () => void;
  copied: boolean;
}

export function Lobby({ room, onLeave, onCopyCode, copied }: LobbyProps) {
  const [showTip, setShowTip] = useState(true);
  
  const waitingTime = room.createdAt 
    ? Math.floor((Date.now() - room.createdAt) / 1000)
    : 0;

  return (
    <div className="min-h-[100dvh] flex flex-col px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#D93877]/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#00F0FF]/5 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-[400px] mx-auto py-6 flex flex-col min-h-[100dvh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onLeave}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all btn-press"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-pixel">CONECTADO</span>
          </div>
        </div>

        {/* Room code display */}
        <div className="text-center mb-8 animate-pop-in">
          <p className="text-gray-400 text-sm font-pixel mb-3">CÓDIGO DE SALA</p>
          <div className="flex items-center justify-center gap-3">
            {room.code.split('').map((char, i) => (
              <div 
                key={i}
                className="
                  w-16 h-20 rounded-2xl bg-gradient-to-b from-[#D93877] to-[#B52D63]
                  flex items-center justify-center
                  shadow-lg shadow-pink-500/30
                  animate-bounce-in
                "
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-4xl font-black text-white">{char}</span>
              </div>
            ))}
          </div>
          
          {/* Copy button */}
          <button
            onClick={onCopyCode}
            className="
              mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl
              glass text-sm text-gray-300 hover:bg-white/10 transition-all btn-press
            "
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar código</span>
              </>
            )}
          </button>
        </div>

        {/* Players status */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[#00F0FF]" />
            <span className="text-white text-sm font-bold font-pixel">JUGADORES</span>
          </div>
          
          <div className="space-y-2">
            {/* Player 1 (creator) */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#252830]">
              <div className="w-10 h-10 rounded-full bg-[#D93877]/20 flex items-center justify-center">
                <span className="text-[#D93877] font-black text-lg">X</span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-bold">{room.players[0]?.name || 'Jugador 1'}</p>
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">Conectado</span>
                </div>
              </div>
              <div className="px-2 py-1 rounded-full bg-[#D93877]/20">
                <span className="text-[10px] text-[#D93877] font-bold font-pixel">ANFITRIÓN</span>
              </div>
            </div>
            
            {/* Player 2 (waiting) */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1A1C23] border border-dashed border-gray-700">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center animate-pulse">
                <span className="text-gray-600 font-black text-lg">?</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Esperando jugador...</p>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-600" />
                  <span className="text-xs text-gray-600">{waitingTime}s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tip */}
        {showTip && (
          <div className="glass rounded-2xl p-4 animate-slide-in-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/20 flex items-center justify-center shrink-0">
                <span className="text-[#00F0FF] text-lg">💡</span>
              </div>
              <div>
                <p className="text-white text-sm font-bold mb-1">Comparte el código</p>
                <p className="text-gray-400 text-xs">
                  Envía el código <span className="text-[#D93877] font-bold">{room.code}</span> a tu amigo 
                  para que se una a la partida. Puedes copiarlo con el botón de arriba.
                </p>
              </div>
              <button 
                onClick={() => setShowTip(false)}
                className="text-gray-500 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Waiting animation */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#D93877]"
                style={{
                  animation: `pulseGlow 1.5s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Leave button */}
        <div className="mt-auto pt-6">
          <button
            onClick={onLeave}
            className="
              w-full py-3 rounded-2xl font-bold text-sm
              glass text-gray-400 hover:text-white hover:bg-white/10
              transition-all btn-press
            "
          >
            CANCELAR Y SALIR
          </button>
        </div>
      </div>
    </div>
  );
}
