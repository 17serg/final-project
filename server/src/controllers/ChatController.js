const { User, Message } = require('../../db/models');

class ChatController {
  // Получение всех тренеров
  static async getAllTrainers(req, res) {
    try {
      const trainers = await User.findAll({ where: { trener: true } });
      res.json(trainers);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Ошибка при получении тренеров' });
    }
  }

  
  // Получение всех пользователей
  static async getAllUsers(req, res) {
    console.log('=======================================')
    try {
      const users = await User.findAll(); // Получаем всех пользователей
      res.json(users);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
  }

  // Получение всех сообщений между пользователем и тренером
  static async getAllMessage(req, res) {
    try {
      const { userId, trainerId } = req.params;
      console.log(userId, trainerId, '--------------------------------');
      const messages = await Message.findAll({
        where: {
          senderId: [userId, trainerId],
          receiverId: [userId, trainerId],
        },
        order: [['createdAt', 'ASC']],
      });
      res.json(messages);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Ошибка при получении сообщений' });
    }
  }

  static async getUsersWithChats(req, res) {
    try {
      const { trainerId } = req.params;

      const messages = await Message.findAll({
        where: {
          receiverId: trainerId,
        },
        attributes: ['senderId'],
        group: ['senderId'],
      });

      const userIds = messages.map((msg) => msg.senderId);

      const users = await User.findAll({
        where: { id: userIds },
      });

      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ошибка при получении списка чатов' });
    }
  }
}

module.exports = ChatController;