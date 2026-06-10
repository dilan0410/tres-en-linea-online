# Tres en Raya Online Multijugador

¡Hola! Este es el proyecto que considero mi primer proyecto "de verdad". Fue el desafío que me hizo entender (por las buenas y por las malas) qué tan divertido, emocionante y a la vez frustrante puede ser trabajar con conexiones en tiempo real y WebSockets. 

Es un juego de Tres en Raya (Tic-Tac-Toe) multijugador en tiempo real. No es solo para jugar en la misma computadora; implementé la lógica para que puedas conectar a dos jugadores desde cualquier parte del mundo.

**¡Pruébalo aquí en vivo!** -> [Tres en Línea Online](https://tres-en-linea-online-ruby.vercel.app/)  
*(Nota: Está alojado en un servidor gratuito, así que si tardas en entrar, dale unos 30-60 segundos para que el backend "despierte".)*

---

## Lo que aprendí construyendo este juego

Este proyecto fue mi escuela para entender cómo se conecta el mundo real con el código. Mis mayores retos y aprendizajes fueron:

1. **El maravilloso y caótico mundo de WebSockets:** Pasar de hacer peticiones normales a entender cómo `Socket.io` mantiene a dos personas sincronizadas en el mismo milisegundo.
2. **Controlar el estado del juego:** Diseñar la lógica para que si el Jugador A mueve, el Jugador B lo vea al instante, se bloquee su turno, se sume el puntaje correctamente y el chat no explote en el intento.
3. **El dolor de cabeza de las desconexiones:** ¿Qué pasa si a alguien se le cae el internet? Me esforcé por crear un sistema que pause la partida y espere hasta 5 minutos para que el jugador pueda reconectarse sin perder sus puntos.

---

## Las Tecnologías que usé

Para lograr que todo se viera y funcionara de manera profesional, dividí el proyecto en dos partes:

### El Frontend (Lo que ves)
- **React 19 + TypeScript + Vite:** Mi base para armar la interfaz de forma rápida y segura gracias al tipado.
- **Tailwind CSS + shadcn/ui:** Para maquetar rápido sin perder el control del diseño.
- **Framer Motion:** La magia detrás de las animaciones fluidas, los efectos *pop-in* y el comportamiento de los botones.
- **Socket.io-client:** El puente que se comunica con mi servidor.

### El Backend (El cerebro)
- **Node.js + Express 5:** Para levantar el servidor base.
- **Socket.io 4:** El encargado de gestionar las salas de juego, los mensajes del chat y los movimientos del tablero.

### El Diseño
Quería que pareciera una máquina arcade de los 80s pero moderna. Usé una paleta basada en Rosa Neón (`#D93877`), Amarillo (`#E4A11B`) y Cyan (`#00F0FF`), combinada con efectos de *glassmorphism* (ventanas semitransparentes tipo cristal) y fuentes pixeladas.

---

## ¿Cómo se comunican los jugadores?

Para que te hagas una idea de cómo viaja la información, armé este pequeño mapa de eventos. Cuando juegas, el cliente (tú) y el servidor se están "hablando" todo el tiempo con mensajes como estos:

* **Para empezar:** El cliente envía `create_room` o `join_room` y el servidor responde con un código de 4 caracteres (ej: `XF49`) para que invites a un amigo.
* **Durante la partida:** Cada clic en el tablero envía un `make_move`, el servidor lo procesa, verifica si hay ganador y le avisa a ambos con `move_made` o `game_over`.
* **Para hablar:** Los mensajes del panel de chat viajan con `send_message` y se reparten instantáneamente con `new_message`.

---

## Cómo correrlo en tu computadora (Local)

Si quieres descargar el código y probarlo en tu máquina, necesitas tener Node.js instalado. Sigue estos pasos abriendo dos terminales diferentes:

### 1. Prender el Backend (El Servidor) 
bash
cd server
npm install
npm start

Esto encenderá el servidor en http://localhost:3001
### 2. Prender el Frontend (La Interfaz)
cd app
npm install
npm run dev

Esto te dará un enlace local (normalmente http://localhost:5173) para abrir en tu navegador.

## Nota final
Este proyecto me tomó bastantes noches de café, caídas de servidor y buscar errores en Google, pero ver a dos amigos jugar desde computadoras distintas usando mi propio código hizo que todo valiera la pena.

Si tienes algún consejo para mejorar mi código o mi lógica de los WebSockets, no dudes en decirme. Esté proyecto fue hecho con mucho cariño para aprender y seguir creciendo como desarrollador.
