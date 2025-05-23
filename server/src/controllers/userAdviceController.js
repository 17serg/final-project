const { UserAdvice, Advice } = require('../../db/models');

class UserAdviceController {
  // Получить все сохраненные советы пользователя
  static async getUserAdvices(req, res) {
    try {
      console.log('Getting user advices, user:', res.locals.user);

      if (!res.locals.user || !res.locals.user.id) {
        console.error('User not found in res.locals');
        return res.status(401).json({ message: 'Пользователь не авторизован' });
      }

      const { id: userId } = res.locals.user;

      console.log('User ID:', userId);

      const userAdvices = await UserAdvice.findAll({
        where: { userId },
        include: [
          {
            model: Advice,
            as: 'advice',
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      return res.json({
        success: true,
        data: userAdvices,
      });
    } catch (error) {
      console.error('Error getting user advices:', error);
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера',
        error: error.message,
      });
    }
  }

  // Сохранить совет в коллекцию пользователя
  static async saveAdvice(req, res) {
    try {
      console.log('Saving advice, user:', res.locals.user);

      if (!res.locals.user || !res.locals.user.id) {
        console.error('User not found in res.locals');
        return res.status(401).json({ message: 'Пользователь не авторизован' });
      }

      const { id: userId } = res.locals.user;
      const { adviceId } = req.body;

      console.log('User ID:', userId, 'Advice ID:', adviceId);

      if (!adviceId) {
        return res.status(400).json({
          success: false,
          message: 'ID совета не указан',
        });
      }

      // Проверяем, существует ли совет
      const advice = await Advice.findByPk(adviceId);
      if (!advice) {
        return res.status(404).json({
          success: false,
          message: 'Совет не найден',
        });
      }

      // Проверяем, не сохранен ли уже этот совет
      const existingUserAdvice = await UserAdvice.findOne({
        where: { userId, adviceId },
      });

      if (existingUserAdvice) {
        return res.status(400).json({
          success: false,
          message: 'Этот совет уже сохранен',
        });
      }

      // Создаем запись о сохранении совета
      const userAdvice = await UserAdvice.create({
        userId,
        adviceId,
      });

      return res.status(201).json({
        success: true,
        data: userAdvice,
      });
    } catch (error) {
      console.error('Error saving advice:', error);
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера',
        error: error.message,
      });
    }
  }

  // Удалить совет из коллекции пользователя
  static async removeAdvice(req, res) {
    try {
      console.log('Removing advice, user:', res.locals.user);

      if (!res.locals.user || !res.locals.user.id) {
        console.error('User not found in res.locals');
        return res.status(401).json({ message: 'Пользователь не авторизован' });
      }

      const { id: userId } = res.locals.user;
      const { adviceId } = req.params;

      console.log('User ID:', userId, 'Advice ID:', adviceId);

      if (!adviceId) {
        return res.status(400).json({
          success: false,
          message: 'ID совета не указан',
        });
      }

      const userAdvice = await UserAdvice.findOne({
        where: { userId, adviceId },
      });

      if (!userAdvice) {
        return res.status(404).json({
          success: false,
          message: 'Сохраненный совет не найден',
        });
      }

      await userAdvice.destroy();

      return res.json({
        success: true,
        message: 'Совет успешно удален из коллекции',
      });
    } catch (error) {
      console.error('Error removing advice:', error);
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера',
        error: error.message,
      });
    }
  }

  // Проверить, сохранен ли совет пользователем
  static async isAdviceSaved(req, res) {
    try {
      console.log('Checking if advice is saved, user:', res.locals.user);

      if (!res.locals.user || !res.locals.user.id) {
        console.error('User not found in res.locals');
        return res.status(401).json({ message: 'Пользователь не авторизован' });
      }

      const { id: userId } = res.locals.user;
      const { adviceId } = req.params;

      console.log('User ID:', userId, 'Advice ID:', adviceId);

      if (!adviceId) {
        return res.status(400).json({
          success: false,
          message: 'ID совета не указан',
        });
      }

      const userAdvice = await UserAdvice.findOne({
        where: { userId, adviceId },
      });

      return res.json({
        success: true,
        data: !!userAdvice,
      });
    } catch (error) {
      console.error('Error checking if advice is saved:', error);
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера',
        error: error.message,
      });
    }
  }
}

module.exports = UserAdviceController;
