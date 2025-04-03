const app = require('./app');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const { Message } = require('../db/models');

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Пользователь подключился:', socket.id);

  socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
    try {
      const message = await Message.create({ senderId, receiverId, text });
      io.emit('newMessage', message);
    } catch (error) {
      console.error('Ошибка при сохранении сообщения:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});