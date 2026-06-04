const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Game rooms storage
const rooms = new Map();

// Generate random 4-char room code
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Check winner
function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], pattern };
    }
  }
  
  if (board.every(cell => cell !== null)) {
    return { winner: 'tie', pattern: [] };
  }
  
  return null;
}

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Create a new room
  socket.on('create_room', ({ playerName, avatar }) => {
    const roomCode = generateRoomCode();
    
    const room = {
      code: roomCode,
      players: [{
        id: socket.id,
        name: playerName || 'Jugador 1',
        avatar: avatar || '/avatar-x.png',
        symbol: 'X',
        score: 0,
        connected: true
      }],
      board: Array(9).fill(null),
      currentTurn: 'X',
      gameStatus: 'waiting', // waiting, playing, finished
      winner: null,
      winPattern: [],
      messages: [],
      round: 1,
      createdAt: Date.now()
    };
    
    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.playerSymbol = 'X';
    
    socket.emit('room_created', { roomCode, room: getPublicRoom(room) });
  });

  // Join existing room
  socket.on('join_room', ({ roomCode, playerName, avatar }) => {
    const room = rooms.get(roomCode);
    
    if (!room) {
      socket.emit('error', { message: 'Sala no encontrada' });
      return;
    }
    
    if (room.players.length >= 2) {
      socket.emit('error', { message: 'Sala llena' });
      return;
    }
    
    // Check if this player was previously in this room (reconnecting)
    const existingPlayer = room.players.find(p => p.id === socket.id);
    if (existingPlayer) {
      existingPlayer.connected = true;
      socket.join(roomCode);
      socket.roomCode = roomCode;
      socket.playerSymbol = existingPlayer.symbol;
      socket.emit('room_joined', { roomCode, room: getPublicRoom(room), symbol: existingPlayer.symbol });
      io.to(roomCode).emit('player_reconnected', { playerId: socket.id, room: getPublicRoom(room) });
      return;
    }
    
    room.players.push({
      id: socket.id,
      name: playerName || 'Jugador 2',
      avatar: avatar || '/avatar-o.png',
      symbol: 'O',
      score: 0,
      connected: true
    });
    
    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.playerSymbol = 'O';
    
    // Start the game when 2nd player joins
    room.gameStatus = 'playing';
    
    socket.emit('room_joined', { roomCode, room: getPublicRoom(room), symbol: 'O' });
    io.to(roomCode).emit('game_started', { room: getPublicRoom(room) });
  });

  // Make a move
  socket.on('make_move', ({ roomCode, position }) => {
    const room = rooms.get(roomCode);
    
    if (!room || room.gameStatus !== 'playing') return;
    if (room.currentTurn !== socket.playerSymbol) return;
    if (room.board[position] !== null) return;
    
    // Place the mark
    room.board[position] = socket.playerSymbol;
    
    // Check for winner
    const result = checkWinner(room.board);
    
    if (result) {
      room.gameStatus = 'finished';
      if (result.winner === 'tie') {
        room.winner = 'tie';
      } else {
        room.winner = result.winner;
        room.winPattern = result.pattern;
        // Update score
        const winnerPlayer = room.players.find(p => p.symbol === result.winner);
        if (winnerPlayer) winnerPlayer.score += 1;
      }
    } else {
      // Switch turn
      room.currentTurn = room.currentTurn === 'X' ? 'O' : 'X';
    }
    
    io.to(roomCode).emit('move_made', {
      position,
      symbol: socket.playerSymbol,
      room: getPublicRoom(room)
    });
    
    if (result) {
      io.to(roomCode).emit('game_over', { room: getPublicRoom(room) });
    }
  });

  // Send chat message
  socket.on('send_message', ({ roomCode, message, sender }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    const chatMsg = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      sender: sender || 'Anónimo',
      symbol: socket.playerSymbol,
      message,
      timestamp: Date.now()
    };
    
    room.messages.push(chatMsg);
    // Keep only last 50 messages
    if (room.messages.length > 50) room.messages.shift();
    
    io.to(roomCode).emit('new_message', chatMsg);
  });

  // Request rematch
  socket.on('request_rematch', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    // Find requesting player
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.rematchRequested = true;
    }
    
    // Check if both want rematch
    const allWantRematch = room.players.length === 2 && 
      room.players.every(p => p.rematchRequested);
    
    if (allWantRematch) {
      // Reset game
      room.board = Array(9).fill(null);
      room.currentTurn = 'X';
      room.gameStatus = 'playing';
      room.winner = null;
      room.winPattern = [];
      room.round += 1;
      room.players.forEach(p => p.rematchRequested = false);
      
      io.to(roomCode).emit('rematch_started', { room: getPublicRoom(room) });
    } else {
      socket.to(roomCode).emit('rematch_requested', { playerId: socket.id, playerName: player?.name });
    }
  });

  // Cancel rematch request
  socket.on('cancel_rematch', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.rematchRequested = false;
    }
    socket.to(roomCode).emit('rematch_cancelled', { playerId: socket.id });
  });

  // Leave room
  socket.on('leave_room', ({ roomCode }) => {
    handlePlayerLeave(socket, roomCode);
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    
    // Find which room this player was in
    for (const [code, room] of rooms.entries()) {
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        player.connected = false;
        
        // Notify other player about disconnection
        socket.to(code).emit('player_disconnected', { 
          playerId: socket.id, 
          playerName: player.name,
          room: getPublicRoom(room)
        });
        
        // If game was in progress, pause it
        if (room.gameStatus === 'playing') {
          room.gameStatus = 'paused';
          io.to(code).emit('game_paused', { 
            reason: 'player_disconnected',
            room: getPublicRoom(room)
          });
        }
        
        // Clean up room after 5 minutes if player doesn't reconnect
        setTimeout(() => {
          const currentRoom = rooms.get(code);
          if (currentRoom) {
            const disconnectedPlayer = currentRoom.players.find(p => p.id === socket.id);
            if (disconnectedPlayer && !disconnectedPlayer.connected) {
              // Remove player from room
              currentRoom.players = currentRoom.players.filter(p => p.id !== socket.id);
              
              if (currentRoom.players.length === 0) {
                rooms.delete(code);
              } else {
                // Notify remaining player
                io.to(code).emit('player_left', { 
                  playerId: socket.id, 
                  room: getPublicRoom(currentRoom)
                });
                currentRoom.gameStatus = 'waiting';
                currentRoom.board = Array(9).fill(null);
                currentRoom.winner = null;
                currentRoom.winPattern = [];
              }
            }
          }
        }, 300000); // 5 minutes grace period
        
        break;
      }
    }
  });
});

// Helper: get public room data (hide sensitive info)
function getPublicRoom(room) {
  return {
    code: room.code,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      symbol: p.symbol,
      score: p.score,
      connected: p.connected,
      rematchRequested: p.rematchRequested || false
    })),
    board: room.board,
    currentTurn: room.currentTurn,
    gameStatus: room.gameStatus,
    winner: room.winner,
    winPattern: room.winPattern,
    messages: room.messages,
    round: room.round
  };
}

function handlePlayerLeave(socket, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;
  
  socket.leave(roomCode);
  
  room.players = room.players.filter(p => p.id !== socket.id);
  
  if (room.players.length === 0) {
    rooms.delete(roomCode);
  } else {
    io.to(roomCode).emit('player_left', { 
      playerId: socket.id, 
      room: getPublicRoom(room)
    });
    room.gameStatus = 'waiting';
    room.board = Array(9).fill(null);
    room.winner = null;
    room.winPattern = [];
  }
  
  socket.emit('left_room');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', rooms: rooms.size });
});

// Get room info endpoint
app.get('/room/:code', (req, res) => {
  const room = rooms.get(req.params.code.toUpperCase());
  if (room) {
    res.json(getPublicRoom(room));
  } else {
    res.status(404).json({ error: 'Sala no encontrada' });
  }
});

// Serve static files from React build
app.use(express.static('public'));

// SPA fallback - serve index.html for all non-API routes
app.use((req, res) => {
  res.sendFile('public/index.html', { root: '.' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎮 Tres en Linea Server running on port ${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
});
