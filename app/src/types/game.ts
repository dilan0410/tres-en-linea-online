export interface Player {
  id: string;
  name: string;
  avatar: string;
  symbol: 'X' | 'O';
  score: number;
  connected: boolean;
  rematchRequested?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  symbol: 'X' | 'O';
  message: string;
  timestamp: number;
}

export interface Room {
  code: string;
  players: Player[];
  board: (string | null)[];
  currentTurn: 'X' | 'O';
  gameStatus: 'waiting' | 'playing' | 'paused' | 'finished';
  winner: 'X' | 'O' | 'tie' | null;
  winPattern: number[];
  messages: ChatMessage[];
  round: number;
  createdAt?: number;
}

export type GamePhase = 'home' | 'create' | 'join' | 'lobby' | 'game' | 'result';

export interface GameState {
  phase: GamePhase;
  room: Room | null;
  mySymbol: 'X' | 'O' | null;
  playerName: string;
  error: string | null;
  isConnecting: boolean;
}

export interface SocketEvents {
  // Client -> Server
  'create_room': { playerName: string; avatar?: string };
  'join_room': { roomCode: string; playerName: string; avatar?: string };
  'make_move': { roomCode: string; position: number };
  'send_message': { roomCode: string; message: string; sender: string };
  'request_rematch': { roomCode: string };
  'cancel_rematch': { roomCode: string };
  'leave_room': { roomCode: string };
  
  // Server -> Client
  'room_created': { roomCode: string; room: Room };
  'room_joined': { roomCode: string; room: Room; symbol: 'X' | 'O' };
  'game_started': { room: Room };
  'move_made': { position: number; symbol: 'X' | 'O'; room: Room };
  'game_over': { room: Room };
  'new_message': ChatMessage;
  'player_disconnected': { playerId: string; playerName: string; room: Room };
  'player_reconnected': { playerId: string; room: Room };
  'player_left': { playerId: string; room: Room };
  'rematch_requested': { playerId: string; playerName: string };
  'rematch_cancelled': { playerId: string };
  'rematch_started': { room: Room };
  'game_paused': { reason: string; room: Room };
  'error': { message: string };
  'left_room': void;
}
