const { Server } = require('socket.io');
const { handleConnection } = require('./handlers/connectionHandler');
const { handleMessage } = require('./handlers/messageHandler');
const { handleReaction } = require('./handlers/reactionHandler');
const { handleReadStatus } = require('./handlers/readStatusHandler');

const activeUsers = new Map();

function initializeSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    handleConnection(socket, activeUsers);
    handleMessage(socket, io, activeUsers);
    handleReaction(socket, io);
    handleReadStatus(socket, io);
  });

  return io;
}

module.exports = { initializeSocket, activeUsers };