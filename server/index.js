const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

let rooms = {};

io.on('connection', (socket) => {
  console.log('🔌 Игрок подключился:', socket.id);

  socket.on('joinRoom', (roomId) => {
    console.log(`📥 Игрок ${socket.id} вошёл в комнату ${roomId}`);
    socket.join(roomId);

    // создаём комнату, если её нет
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        currentTurn: null
      };
    }

    // добавляем игрока, если ещё не в комнате
    if (!rooms[roomId].players.includes(socket.id)) {
      rooms[roomId].players.push(socket.id);
    }

    // если это первый игрок — он начинает
    if (rooms[roomId].players.length === 1) {
      rooms[roomId].currentTurn = socket.id;
    }

    console.log('👥 Текущие игроки:', rooms[roomId].players);

    // отправляем обновление комнаты
    io.to(roomId).emit('roomUpdate', {
      players: rooms[roomId].players,
      currentTurn: rooms[roomId].currentTurn
    });
  });

  socket.on('rollDice', (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    // проверяем: сейчас ли очередь этого игрока
    //if (room.currentTurn !== socket.id) return;

    const result = Math.floor(Math.random() * 6) + 1;
    console.log(`🎲 ${socket.id} бросил кубик: ${result}`);

    io.to(roomId).emit('diceRolled', { player: socket.id, result });

    // передаём ход следующему игроку
    const idx = room.players.indexOf(socket.id);
    const nextIdx = (idx + 1) % room.players.length;
    room.currentTurn = room.players[nextIdx];

    // уведомляем всех
    io.to(roomId).emit('roomUpdate', {
      players: room.players,
      currentTurn: room.currentTurn
    });
  });

  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      room.players = room.players.filter(id => id !== socket.id);

      // если игрок ушёл, передаём ход другому
      if (room.currentTurn === socket.id) {
        room.currentTurn = room.players[0] || null;
      }

      // если игроков не осталось — удаляем комнату
      if (room.players.length === 0) {
        delete rooms[roomId];
        console.log(`🗑 Комната ${roomId} удалена`);
      } else {
        io.to(roomId).emit('roomUpdate', {
          players: room.players,
          currentTurn: room.currentTurn
        });
      }
    }

    console.log('❌ Игрок отключился:', socket.id);
  });
});

server.listen(3000, () => console.log('✅ Сервер запущен на http://localhost:3000'));
