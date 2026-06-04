import { useState, useCallback } from 'react';
import { Pause, WifiOff, RotateCcw } from 'lucide-react';
import { GameBoard } from '@/components/GameBoard';
import { PlayerCard } from '@/components/PlayerCard';
import { Chat } from '@/components/Chat';
import type { Room, ChatMessage } from '@/types/game';

interface GameRoomProps {
  room: Room;
  mySymbol: 'X' | 'O' | null;
  playerName: string;
  messages: ChatMessage[];
  playerDisconnected: { id: string; name: string } | null;
  playerReconnected: string | null;
  gamePaused: boolean;
  onMakeMove: (roomCode: string, position: number) => void;
  onSendMessage: (roomCode: string, message: string, sender: string) => void;
  onLeave: () => void;
}

export function GameRoom({
  room,
  mySymbol,
  playerName,
  messages,
  playerDisconnected,
  playerReconnected,
  gamePaused,
  onMakeMove,
  onSendMessage,
  onLeave,
}: GameRoomProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [showPauseOverlay, setShowPauseOverlay] = useState(false);

  const isMyTurn = mySymbol === room.currentTurn && room.gameStatus === 'playing';
  const playerX = room.players.find(p => p.symbol === 'X');
  const playerO = room.players.find(p => p.symbol === 'O');

  const handleCellClick = useCallback((position: number) => {
    if (!isMyTurn || room.gameStatus !== 'playing') return;
    onMakeMove(room.code, position);
  }, [isMyTurn, room.gameStatus, room.code, onMakeMove]);

  const handleSendMessage = useCallback((message: string) => {
    onSendMessage(room.code, message, playerName);
  }, [room.code, playerName, onSendMessage]);

  const handlePause = () => {
    setShowPauseOverlay(!showPauseOverlay);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#0B0C10]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-[100dvh] max-w-[430px] mx-auto w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handlePause}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all btn-press"
          >
            <Pause className="w-5 h-5" />
          </button>
          
          {/* Round indicator */}
          <div className="px-3 py-1 rounded-full glass">
            <span className="text-xs font-pixel text-gray-400">
              RONDA <span className="text-white font-bold">{room.round}</span>
            </span>
          </div>

          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 transition-all btn-press relative"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D93877] text-white text-[9px] flex items-center justify-center font-bold">
                {messages.length}
              </span>
            )}
          </button>
        </div>

        {/* Players */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between gap-3">
            <PlayerCard 
              player={playerX}
              isCurrentTurn={room.currentTurn === 'X'}
              isMe={mySymbol === 'X'}
              showTurn={room.gameStatus === 'playing'}
            />
            
            {/* VS */}
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-gray-600 font-arcade">VS</span>
              {room.gameStatus === 'playing' && (
                <div className="flex items-center gap-0.5 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${room.currentTurn === 'X' ? 'bg-[#D93877]' : 'bg-gray-700'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full ${room.currentTurn === 'O' ? 'bg-[#E4A11B]' : 'bg-gray-700'}`} />
                </div>
              )}
            </div>

            <PlayerCard 
              player={playerO}
              isCurrentTurn={room.currentTurn === 'O'}
              isMe={mySymbol === 'O'}
              showTurn={room.gameStatus === 'playing'}
            />
          </div>
        </div>

        {/* Game board */}
        <div className="flex-1 flex items-center justify-center px-4 py-4">
          <GameBoard
            board={room.board}
            winPattern={room.winPattern}
            onCellClick={handleCellClick}
            isMyTurn={isMyTurn}
            gameStatus={room.gameStatus}
            mySymbol={mySymbol}
          />
        </div>

        {/* Game status bar */}
        <div className="px-4 pb-4">
          <div className="glass rounded-2xl p-3 text-center">
            {room.gameStatus === 'playing' && (
              <p className={`text-sm font-pixel ${isMyTurn ? 'text-[#00F0FF]' : 'text-gray-400'}`}>
                {isMyTurn ? 'TU TURNO — Coloca tu ficha' : `Turno de ${room.currentTurn === 'X' ? playerX?.name : playerO?.name}`}
              </p>
            )}
            {room.gameStatus === 'finished' && (
              <p className="text-sm font-pixel text-gray-400">
                Partida terminada
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      {showPauseOverlay && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-pop-in">
          <div className="glass rounded-3xl p-6 w-[300px] text-center">
            <h2 className="text-2xl font-black text-white font-arcade mb-2">PAUSA</h2>
            <p className="text-sm text-gray-400 font-pixel mb-6">La partida está en pausa</p>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowPauseOverlay(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D93877] to-[#B52D63] text-white font-bold btn-press"
              >
                CONTINUAR
              </button>
              <button
                onClick={onLeave}
                className="w-full py-3 rounded-2xl glass text-gray-400 hover:text-white font-bold btn-press"
              >
                ABANDONAR PARTIDA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disconnection toast */}
      {playerDisconnected && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-slide-in-down">
          <div className="max-w-[400px] mx-auto glass rounded-2xl p-4 border border-red-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <WifiOff className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">{playerDisconnected.name} se desconectó</p>
                <p className="text-gray-400 text-xs">Esperando reconexión...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reconnection toast */}
      {playerReconnected && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-slide-in-down">
          <div className="max-w-[400px] mx-auto glass rounded-2xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">{playerReconnected}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game paused overlay */}
      {gamePaused && room.gameStatus === 'paused' && !showPauseOverlay && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="glass rounded-3xl p-6 text-center animate-pulse">
            <WifiOff className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="text-xl font-black text-white font-arcade">JUEGO PAUSADO</h2>
            <p className="text-sm text-gray-400 font-pixel mt-1">Esperando al otro jugador...</p>
          </div>
        </div>
      )}

      {/* Chat */}
      <Chat
        messages={messages}
        onSendMessage={handleSendMessage}
        playerName={playerName}
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
      />
    </div>
  );
}
