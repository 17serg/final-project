function handleConnection(socket, activeUsers) {
    // console.log('Пользователь подключился:', socket.id);
  
    socket.on('joinChat', ({ userId, chatPartnerId }) => {
      activeUsers.set(userId, chatPartnerId);
      // console.log(`Пользователь ${userId} вошел в чат с ${chatPartnerId}`);
    });
  
    socket.on('leaveChat', ({ userId }) => {
      activeUsers.delete(userId);
      // console.log(`Пользователь ${userId} вышел из чата`);
    });
  
    socket.on('disconnect', () => {
      // console.log('Пользователь отключился:', socket.id);
    });
  }
  
  module.exports = { handleConnection };