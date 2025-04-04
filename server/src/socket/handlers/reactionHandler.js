const { Message } = require('../../../db/models');

function handleReaction(socket, io) {
  socket.on('addReaction', async ({ messageId, userId, reaction }) => {
    try {
      const message = await Message.findByPk(messageId);
      if (message) {
        const reactions = message.reactions || {};
        
        if (reactions[userId] === reaction) {
          delete reactions[userId];
        } else {
          reactions[userId] = reaction;
        }
        
        message.reactions = reactions;
        await message.save();

        io.emit('reactionUpdated', { messageId, reactions });
      }
    } catch (error) {
      console.error('Ошибка при добавлении реакции:', error);
    }
  });
}

module.exports = { handleReaction };