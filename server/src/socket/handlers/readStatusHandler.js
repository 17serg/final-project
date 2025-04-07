const { Message } = require('../../../db/models');

function handleReadStatus(socket, io) {
  socket.on('readMessage', async ({ messageId }) => {
    try {
      const message = await Message.findByPk(messageId);
      if (message) {
        message.isRead = true;
        await message.save();
        io.emit('messageRead', { id: messageId, isRead: true });
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса прочтения:', error);
    }
  });

  socket.on('checkMessages', async ({ userId, chatPartnerId }) => {
    try {
      const messages = await Message.findAll({
        where: {
          receiverId: userId,
          senderId: chatPartnerId,
          isRead: false
        }
      });

      for (const message of messages) {
        message.isRead = true;
        await message.save();
        io.emit('messageRead', { id: message.id, isRead: true });
      }
    } catch (error) {
      console.error('Ошибка при проверке сообщений:', error);
    }
  });
}

module.exports = { handleReadStatus };