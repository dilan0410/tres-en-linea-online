import { useState, useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Room, ChatMessage, GamePhase } from '@/types/game';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || window.location.origin;

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [mySymbol, setMySymbol] = useState<'X' | 'O' | null>(null);
  const [phase, setPhase] = useState<GamePhase>('home');
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [playerDisconnected, setPlayerDisconnected] = useState<{ id: string; name: string } | null>(null);
  const [playerReconnected, setPlayerReconnected] = useState<string | null>(null);
  const [rematchRequested, setRematchRequested] = useState(false);
  const [winner, setWinner] = useState<'X' | 'O' | 'tie' | null>(null);
  const [gamePaused, setGamePaused] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('No se pudo conectar al servidor. Intenta de nuevo.');
      setConnected(false);
    });

    // Room events
    socket.on('room_created', ({ roomCode: _roomCode, room: roomData }) => {
      setRoom(roomData);
      setMySymbol('X');
      setPhase('lobby');
      setError(null);
    });

    socket.on('room_joined', ({ room: roomData, symbol }) => {
      setRoom(roomData);
      setMySymbol(symbol);
      setPhase('game');
      setError(null);
    });

    socket.on('game_started', ({ room: roomData }) => {
      setRoom(roomData);
      setPhase('game');
      setMessages(roomData.messages || []);
    });

    // Game events
    socket.on('move_made', ({ room: roomData }) => {
      setRoom(roomData);
    });

    socket.on('game_over', ({ room: roomData }) => {
      setRoom(roomData);
      setWinner(roomData.winner);
      setPhase('result');
    });

    // Chat events
    socket.on('new_message', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    // Player events
    socket.on('player_disconnected', ({ playerId, playerName, room: roomData }) => {
      setRoom(roomData);
      setPlayerDisconnected({ id: playerId, name: playerName });
      setGamePaused(true);
      
      // Auto-clear after 5 seconds
      setTimeout(() => {
        setPlayerDisconnected(null);
      }, 5000);
    });

    socket.on('player_reconnected', ({ room: roomData }) => {
      setRoom(roomData);
      setPlayerReconnected('Jugador reconectado');
      setGamePaused(false);
      
      setTimeout(() => {
        setPlayerReconnected(null);
      }, 3000);
    });

    socket.on('player_left', ({ room: roomData }) => {
      setRoom(roomData);
      setPhase('lobby');
      setGamePaused(false);
      setWinner(null);
    });

    socket.on('game_paused', ({ room: roomData }) => {
      setRoom(roomData);
      setGamePaused(true);
    });

    // Rematch events
    socket.on('rematch_requested', ({ playerName }) => {
      setRematchRequested(true);
      // Show toast notification
      setPlayerReconnected(`${playerName} quiere la revancha!`);
      setTimeout(() => setPlayerReconnected(null), 3000);
    });

    socket.on('rematch_cancelled', () => {
      setRematchRequested(false);
    });

    socket.on('rematch_started', ({ room: roomData }) => {
      setRoom(roomData);
      setWinner(null);
      setRematchRequested(false);
      setPhase('game');
      setMessages([]);
    });

    // Error events
    socket.on('error', ({ message }) => {
      setError(message);
      setTimeout(() => setError(null), 5000);
    });

    socket.on('left_room', () => {
      setRoom(null);
      setMySymbol(null);
      setPhase('home');
      setWinner(null);
      setMessages([]);
      setGamePaused(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Actions
  const createRoom = useCallback((playerName: string) => {
    socketRef.current?.emit('create_room', { playerName });
  }, []);

  const joinRoom = useCallback((roomCode: string, playerName: string) => {
    socketRef.current?.emit('join_room', { roomCode: roomCode.toUpperCase(), playerName });
  }, []);

  const makeMove = useCallback((roomCode: string, position: number) => {
    socketRef.current?.emit('make_move', { roomCode, position });
  }, []);

  const sendMessage = useCallback((roomCode: string, message: string, sender: string) => {
    if (!message.trim()) return;
    socketRef.current?.emit('send_message', { roomCode, message: message.trim(), sender });
  }, []);

  const requestRematch = useCallback((roomCode: string) => {
    socketRef.current?.emit('request_rematch', { roomCode });
  }, []);

  const cancelRematch = useCallback((roomCode: string) => {
    socketRef.current?.emit('cancel_rematch', { roomCode });
  }, []);

  const leaveRoom = useCallback((roomCode: string) => {
    socketRef.current?.emit('leave_room', { roomCode });
  }, []);

  const setGamePhase = useCallback((newPhase: GamePhase) => {
    setPhase(newPhase);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    connected,
    room,
    mySymbol,
    phase,
    error,
    messages,
    playerDisconnected,
    playerReconnected,
    rematchRequested,
    winner,
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
  };
}
