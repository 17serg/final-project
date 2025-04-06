const { Message } = require('../../../db/models');

function handleMessage(socket, io, activeUsers) {


  // Добавим новый обработчик для получения количества непрочитанных сообщений
  socket.on('getUnreadCount', async ({ userId }) => {
    try {
      const unreadCount = await Message.count({
        where: {
          receiverId: userId,
          isRead: false
        }
      });
      socket.emit('unreadCount', { count: unreadCount });
    } catch (error) {
      console.error('Ошибка при получении количества непрочитанных сообщений:', error);
    }
  });

  // Обновим обработчик отправки сообщения
  socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
    try {
      let message = await Message.create({ 
        senderId, 
        receiverId, 
        text, 
        isSent: true, 
        isRead: false,
        reactions: {}
      });

      io.emit('messageSent', { id: message.id, isSent: true });
      io.emit('newMessage', message);

      // Получаем и отправляем обновленное количество непрочитанных сообщений
      const unreadCount = await Message.count({
        where: {
          receiverId,
          isRead: false
        }
      });
      io.emit('unreadCount', { userId: receiverId, count: unreadCount });

      const receiverActiveChat = activeUsers.get(receiverId);
      if (receiverActiveChat === senderId) {
        message.isRead = true;
        await message.save();
        io.emit('messageRead', { id: message.id, isRead: true });
        
        // Обновляем счетчик после прочтения
        const updatedUnreadCount = await Message.count({
          where: {
            receiverId,
            isRead: false
          }
        });
        io.emit('unreadCount', { userId: receiverId, count: updatedUnreadCount });
      }
    } catch (error) {
      console.error('Ошибка при сохранении сообщения:', error);
    }
  });
}

module.exports = { handleMessage };