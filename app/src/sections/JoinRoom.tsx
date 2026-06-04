import { useState, useRef } from 'react';
import { ArrowLeft, KeyRound, LogIn } from 'lucide-react';

interface JoinRoomProps {
  onBack: () => void;
  onJoin: (roomCode: string, playerName: string) => void;
  isConnecting: boolean;
  error: string | null;
}

export function JoinRoom({ onBack, onJoin, isConnecting, error }: JoinRoomProps) {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    const upperValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (upperValue) {
      const newCode = roomCode.split('');
      newCode[index] = upperValue[0];
      const updatedCode = newCode.join('').slice(0, 4);
      setRoomCode(updatedCode);
      
      // Move to next input
      if (index < 3 && upperValue[0]) {
        codeRefs.current[index + 1]?.focus();
      }
    } else {
      const newCode = roomCode.split('');
      newCode[index] = '';
      setRoomCode(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !roomCode[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || roomCode.length !== 4) return;
    onJoin(roomCode.toUpperCase(), playerName.trim());
  };

  // Auto-focus first input
  const handleCodeInputFocus = (index: number) => {
    if (codeRefs.current[index]) {
      codeRefs.current[index]?.select();
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#E4A11B]/5 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[400px] mx-auto py-6 flex flex-col min-h-[100dvh]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all btn-press"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white font-arcade">UNIRSE</h1>
            <p className="text-xs text-gray-500 font-pixel">Ingresa el código de la sala</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          {/* Room code */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-400 font-pixel mb-3">
              <KeyRound className="w-4 h-4 text-[#E4A11B]" />
              CÓDIGO DE SALA
            </label>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => { codeRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={roomCode[index] || ''}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => handleCodeInputFocus(index)}
                  className={`
                    w-16 h-20 rounded-2xl text-center text-3xl font-black text-white
                    bg-[#1A1C23] border-2 outline-none transition-all
                    placeholder-gray-700
                    ${roomCode[index] 
                      ? 'border-[#E4A11B] bg-[#E4A11B]/10 neon-box-yellow' 
                      : 'border-transparent focus:border-[#E4A11B]/50'
                    }
                  `}
                  placeholder="-"
                />
              ))}
            </div>
          </div>

          {/* Player name */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-400 font-pixel mb-2">
              <LogIn className="w-4 h-4 text-[#D93877]" />
              TU NOMBRE
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ej: JugadorPro99"
              maxLength={15}
              className="
                w-full bg-[#1A1C23] rounded-2xl px-4 py-4 text-lg text-white font-bold
                placeholder-gray-600 outline-none border-2 border-transparent
                focus:border-[#D93877]/50 transition-all
              "
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center animate-pop-in">
              {error}
            </div>
          )}

          {/* Submit button */}
          <div className="mt-auto">
            <button
              type="submit"
              disabled={!playerName.trim() || roomCode.length !== 4 || isConnecting}
              className={`
                w-full py-4 rounded-2xl font-bold text-lg text-white
                transition-all duration-300 btn-press
                ${playerName.trim() && roomCode.length === 4 && !isConnecting
                  ? 'bg-gradient-to-r from-[#E4A11B] to-[#C48A17] shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isConnecting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Conectando...</span>
                </div>
              ) : (
                'UNIRSE A LA SALA'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
