import { useState } from 'react';
import { ArrowLeft, Copy, User, Wifi } from 'lucide-react';

interface CreateRoomProps {
  onBack: () => void;
  onCreate: (playerName: string) => void;
  isConnecting: boolean;
}

export function CreateRoom({ onBack, onCreate, isConnecting }: CreateRoomProps) {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    onCreate(playerName.trim());
  };

  return (
    <div className="min-h-[100dvh] flex flex-col px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#D93877]/5 blur-[100px]" />
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
            <h1 className="text-2xl font-black text-white font-arcade">CREAR SALA</h1>
            <p className="text-xs text-gray-500 font-pixel">Configura tu partida</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          {/* Player name input */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-400 font-pixel mb-2">
              <User className="w-4 h-4 text-[#D93877]" />
              TU NOMBRE
            </label>
            <div className="relative">
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
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="text-xs text-gray-600 font-pixel">{playerName.length}/15</span>
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="space-y-3 mb-6">
            <div className="glass rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#D93877]/20 flex items-center justify-center shrink-0">
                <Wifi className="w-5 h-5 text-[#D93877]" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Sala Online</p>
                <p className="text-gray-400 text-xs mt-0.5">Se generará un código único de 4 caracteres para compartir</p>
              </div>
            </div>
            
            <div className="glass rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E4A11B]/20 flex items-center justify-center shrink-0">
                <Copy className="w-5 h-5 text-[#E4A11B]" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Comparte el Código</p>
                <p className="text-gray-400 text-xs mt-0.5">Envía el código a tu amigo para que se una a la partida</p>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-auto">
            <button
              type="submit"
              disabled={!playerName.trim() || isConnecting}
              className={`
                w-full py-4 rounded-2xl font-bold text-lg text-white
                transition-all duration-300 btn-press
                ${playerName.trim() && !isConnecting
                  ? 'bg-gradient-to-r from-[#D93877] to-[#B52D63] shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isConnecting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creando...</span>
                </div>
              ) : (
                'CREAR SALA'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
