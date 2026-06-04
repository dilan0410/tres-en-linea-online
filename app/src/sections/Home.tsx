import { useState } from 'react';
import { Globe, Users, Gamepad2, Sparkles, Zap } from 'lucide-react';
import { XSymbol } from '@/components/XSymbol';
import { OSymbol } from '@/components/OSymbol';

interface HomeProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export function Home({ onCreateRoom, onJoinRoom }: HomeProps) {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating X symbols */}
        <div className="absolute top-[10%] left-[5%] animate-float opacity-10">
          <XSymbol size={40} animated={false} />
        </div>
        <div className="absolute top-[25%] right-[8%] animate-float opacity-10" style={{ animationDelay: '1s' }}>
          <OSymbol size={32} animated={false} />
        </div>
        <div className="absolute bottom-[20%] left-[10%] animate-float opacity-10" style={{ animationDelay: '2s' }}>
          <XSymbol size={28} animated={false} />
        </div>
        <div className="absolute bottom-[30%] right-[5%] animate-float opacity-10" style={{ animationDelay: '0.5s' }}>
          <OSymbol size={36} animated={false} />
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#D93877]/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#4A5AEF]/5 blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[#E4A11B]/5 blur-[80px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[400px] animate-pop-in">
        {/* Logo area */}
        <div className="text-center mb-10">
          {/* Game icons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="animate-float">
              <XSymbol size={48} />
            </div>
            <div className="text-gray-600">
              <Zap className="w-6 h-6" />
            </div>
            <div className="animate-float" style={{ animationDelay: '1.5s' }}>
              <OSymbol size={48} />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-arcade text-5xl font-black tracking-tighter mb-1">
            <span className="text-white">TRES EN</span>
          </h1>
          <h2 className="font-arcade text-6xl font-black tracking-tighter title-3d text-[#E4A11B]">
            RAYA
          </h2>
          
          {/* Subtitle */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <Sparkles className="w-4 h-4 text-[#D93877]" />
            <span className="font-pixel text-sm text-gray-400 tracking-widest">
              ONLINE MULTIJUGADOR
            </span>
            <Sparkles className="w-4 h-4 text-[#D93877]" />
          </div>
        </div>

        {/* Game mode buttons */}
        <div className="space-y-3">
          {/* Online mode - Primary */}
          <button
            onClick={onCreateRoom}
            onMouseEnter={() => setHoveredMode('online')}
            onMouseLeave={() => setHoveredMode(null)}
            className={`
              w-full py-4 px-6 rounded-2xl flex items-center gap-4
              bg-gradient-to-r from-[#D93877] to-[#B52D63]
              text-white font-bold text-lg
              transition-all duration-300 btn-press
              ${hoveredMode === 'online' ? 'scale-[1.02] shadow-xl shadow-pink-500/30' : 'shadow-lg shadow-pink-500/20'}
            `}
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-base leading-tight">Partida Online</div>
              <div className="text-xs text-white/70 font-pixel mt-0.5">Juega contra alguien del mundo</div>
            </div>
          </button>

          {/* Local mode - Secondary */}
          <button
            onClick={onJoinRoom}
            onMouseEnter={() => setHoveredMode('local')}
            onMouseLeave={() => setHoveredMode(null)}
            className={`
              w-full py-4 px-6 rounded-2xl flex items-center gap-4
              glass text-white font-bold text-lg
              transition-all duration-300 btn-press
              ${hoveredMode === 'local' ? 'scale-[1.02] bg-[#252830]' : ''}
            `}
          >
            <div className="w-12 h-12 rounded-xl bg-[#E4A11B]/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#E4A11B]" />
            </div>
            <div className="text-left">
              <div className="text-base leading-tight">Unirse a una Sala</div>
              <div className="text-xs text-gray-400 font-pixel mt-0.5">Ingresa el código de una sala</div>
            </div>
          </button>
        </div>

        {/* How to play */}
        <div className="mt-8 glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gamepad2 className="w-4 h-4 text-[#00F0FF]" />
            <span className="text-white text-sm font-bold font-pixel">COMO JUGAR</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#D93877] text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
              <p className="text-gray-400 text-xs">Crea una sala y comparte el código con un amigo</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E4A11B] text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
              <p className="text-gray-400 text-xs">Tu amigo ingresa el código y la partida empieza</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#00F0FF] text-black text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
              <p className="text-gray-400 text-xs">Usa el chat para comunicarte durante la partida</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <span className="text-[10px] text-gray-600 font-pixel">v14 — Tres en Raya Online</span>
        </div>
      </div>
    </div>
  );
}
