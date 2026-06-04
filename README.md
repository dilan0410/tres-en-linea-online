# Tres en Raya Online Multijugador

Un juego de Tres en Raya (Tic-Tac-Toe) multijugador en tiempo real con estetica arcade neon. Conecta dos jugadores desde cualquier parte del mundo usando WebSockets.

## Arquitectura

```
Frontend (React + TypeScript + Tailwind CSS)
    |
    |  WebSockets (Socket.io)
    v
Backend (Node.js + Express + Socket.io)
```

## Caracteristicas

- **Salas con codigo**: Crea una sala y obtien un codigo de 4 caracteres (ej: XF49) para compartir
- **Juego en tiempo real**: Sincronizacion instantanea del tablero entre ambos jugadores
- **Chat en vivo**: Comunicate con tu oponente durante la partida
- **Sistema de puntuacion**: Acumula puntos por cada ronda ganada
- **Revancha**: Sistema de revancha con ambos jugadores confirmando
- **Manejo de desconexiones**: Si un jugador se desconecta, el juego se pausa y espera 5 minutos por reconexion
- **Estetica Arcade**: Diseno neon con colores vibrantes, glassmorphism y animaciones fluidas

## Estructura del Proyecto

```
/mnt/agents/output/
  app/                    # Frontend (React + Vite)
    src/
      components/         # Componentes reutilizables
        XSymbol.tsx       # Simbolo X con efecto neon
        OSymbol.tsx       # Simbolo O con efecto neon
        PlayerCard.tsx    # Tarjeta de jugador con avatar
        Chat.tsx          # Panel de chat en vivo
        GameBoard.tsx     # Tablero 3x3 interactivo
      sections/           # Pantallas principales
        Home.tsx          # Menu principal
        CreateRoom.tsx    # Crear sala
        JoinRoom.tsx      # Unirse a sala
        Lobby.tsx         # Sala de espera
        GameRoom.tsx      # Pantalla de juego
        Result.tsx        # Pantalla de resultados
      hooks/
        useSocket.ts      # Hook de conexion WebSocket
      types/
        game.ts           # Tipos TypeScript
    public/
      avatar-x.png        # Avatar jugador X
      avatar-o.png        # Avatar jugador O

  server/                 # Backend (Express + Socket.io)
    index.js              # Servidor principal
    package.json

  design/
    design.md             # Documento de diseno (PRD)
```

## Tecnologias

**Frontend:**
- React 19 + TypeScript + Vite
- Tailwind CSS 3.4 + shadcn/ui
- Socket.io-client
- Framer Motion (animaciones)
- Lucide React (iconos)

**Backend:**
- Node.js + Express 5
- Socket.io 4
- CORS

**Diseno:**
- Paleta arcade neon (rosa #D93877, amarillo #E4A11B, cyan #00F0FF)
- Glassmorphism profundo
- Tipografia Oswald + Pixelify Sans
- Animaciones CSS3 (pop-in, float, stomp, pulse-glow)

## Eventos WebSocket

| Evento | Direccion | Descripcion |
|--------|-----------|-------------|
| `create_room` | Cliente -> Servidor | Crear nueva sala |
| `join_room` | Cliente -> Servidor | Unirse a sala existente |
| `make_move` | Cliente -> Servidor | Colocar ficha en posicion |
| `send_message` | Cliente -> Servidor | Enviar mensaje de chat |
| `request_rematch` | Cliente -> Servidor | Solicitar revancha |
| `room_created` | Servidor -> Cliente | Sala creada exitosamente |
| `game_started` | Servidor -> Cliente | Segundo jugador conectado |
| `move_made` | Servidor -> Cliente | Movimiento sincronizado |
| `game_over` | Servidor -> Cliente | Partida terminada |
| `new_message` | Servidor -> Cliente | Nuevo mensaje de chat |
| `player_disconnected` | Servidor -> Cliente | Jugador desconectado |
| `player_reconnected` | Servidor -> Cliente | Jugador reconectado |

## Como ejecutar

### Frontend
```bash
cd /mnt/agents/output/app
npm install
npm run dev
```

### Backend
```bash
cd /mnt/agents/output/server
npm install
npm start
```

El frontend se ejecuta en `http://localhost:5173` y el backend en `http://localhost:3001`.

### Produccion
```bash
# Construir frontend
cd /mnt/agents/output/app
npm run build

# Copiar build al servidor
cp -r dist/* /mnt/agents/output/server/public/

# Iniciar servidor (sirve frontend + backend en mismo puerto)
cd /mnt/agents/output/server
npm start
```

Accede a `http://localhost:3001` para jugar.

## Deploy

El frontend esta deployado en: **https://x2pqise34rwiw.kimi.page**

Para un deploy completo con backend:
1. Aloja el backend en Railway, Render, Heroku o similar
2. Configura la variable de entorno `VITE_SERVER_URL` con la URL del backend
3. Reconstruye y redeploya el frontend

## Estado del Juego (State Machine)

```
home -> create -> lobby -> game -> result
home -> join -> game -> result
```

## Autor

Proyecto educativo demostrando WebSockets, sincronizacion de estado en tiempo real, y manejo de desconexiones.
