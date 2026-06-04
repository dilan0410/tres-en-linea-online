import { useState, useCallback, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Home } from '@/sections/Home';
import { CreateRoom } from '@/sections/CreateRoom';
import { JoinRoom } from '@/sections/JoinRoom';
import { Lobby } from '@/sections/Lobby';
import { GameRoom } from '@/sections/GameRoom';
import { Result } from '@/sections/Result';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import './App.css';

export default function App() {
  const {
    connected,
    room,
    mySymbol,
    phase,
    error,
    messages,
    playerDisconnected,
    playerReconnected,
    rematchRequested,
    gamePaused,
    createRoom,
    joinRoom,
    makeMove,
    sendMessage,
    requestRematch,
    cancelRematch,
    leaveRoom,
    setGamePhase,
    clearError,
  } = useSocket();

  const [playerName, setPlayerName] = useState('');
  const [copied, setCopied] = useState(false);

  // Show connection errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Show connection status
  useEffect(() => {
    if (!connected) {
      toast.error('Desconectado del servidor', {
        description: 'Intentando reconectar...',
        duration: 5000,
      });
    }
  }, [connected]);

  // Show player disconnected toast
  useEffect(() => {
    if (playerDisconnected) {
      toast.warning(`${playerDisconnected.name} se desconectó`, {
        description: 'Esperando reconexión...',
        duration: 5000,
      });
    }
  }, [playerDisconnected]);

  // Show player reconnected toast
  useEffect(() => {
    if (playerReconnected) {
      toast.success(playerReconnected, {
        duration: 3000,
      });
    }
  }, [playerReconnected]);

  const handleCreateRoom = useCallback((name: string) => {
    setPlayerName(name);
    createRoom(name);
  }, [createRoom]);

  const handleJoinRoom = useCallback((roomCode: string, name: string) => {
    setPlayerName(name);
    joinRoom(roomCode, name);
  }, [joinRoom]);

  const handleCopyCode = useCallback(() => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code);
      setCopied(true);
      toast.success('Código copiado!', { duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    }
  }, [room?.code]);

  const handleLeave = useCallback(() => {
    if (room?.code) {
      leaveRoom(room.code);
    }
  }, [room?.code, leaveRoom]);

  const handleRematch = useCallback(() => {
    if (room?.code) {
      requestRematch(room.code);
    }
  }, [room?.code, requestRematch]);

  const handleCancelRematch = useCallback(() => {
    if (room?.code) {
      cancelRematch(room.code);
    }
  }, [room?.code, cancelRematch]);

  const handleGoHome = useCallback(() => {
    if (room?.code) {
      leaveRoom(room.code);
    }
    setGamePhase('home');
  }, [room?.code, leaveRoom, setGamePhase]);

  // Render current phase
  const renderPhase = () => {
    switch (phase) {
      case 'home':
        return (
          <Home
            onCreateRoom={() => setGamePhase('create')}
            onJoinRoom={() => setGamePhase('join')}
          />
        );

      case 'create':
        return (
          <CreateRoom
            onBack={() => setGamePhase('home')}
            onCreate={handleCreateRoom}
            isConnecting={!connected}
          />
        );

      case 'join':
        return (
          <JoinRoom
            onBack={() => setGamePhase('home')}
            onJoin={handleJoinRoom}
            isConnecting={!connected}
            error={error}
          />
        );

      case 'lobby':
        if (!room) return null;
        return (
          <Lobby
            room={room}
            onLeave={handleLeave}
            onCopyCode={handleCopyCode}
            copied={copied}
          />
        );

      case 'game':
        if (!room) return null;
        return (
          <GameRoom
            room={room}
            mySymbol={mySymbol}
            playerName={playerName}
            messages={messages}
            playerDisconnected={playerDisconnected}
            playerReconnected={playerReconnected}
            gamePaused={gamePaused}
            onMakeMove={makeMove}
            onSendMessage={sendMessage}
            onLeave={handleLeave}
          />
        );

      case 'result':
        if (!room) return null;
        return (
          <Result
            room={room}
            mySymbol={mySymbol}
            rematchRequested={rematchRequested}
            onRematch={handleRematch}
            onCancelRematch={handleCancelRematch}
            onHome={handleGoHome}
          />
        );

      default:
        return <Home onCreateRoom={() => setGamePhase('create')} onJoinRoom={() => setGamePhase('join')} />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0B0C10] text-white">
      {renderPhase()}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1A1C23',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
