const { UserProfile, User } = require('../../db/models');
const fs = require('fs').promises;
const path = require('path');

/**
 * Контроллер для управления профилем пользователя
 */
class UserProfileController {
  /**
   * Получение профиля пользователя
   * @param {Object} req - Объект запроса
   * @param {Object} res - Объект ответа
   * @returns {Promise<Object>} Профиль пользователя
   */
  static async getProfile(req, res) {
    try {
      // Получаем ID пользователя из токена
      const { id: userId } = res.locals.user;

      // Ищем профиль пользователя в базе данных
      const profile = await UserProfile.findOne({ where: { userId } });

      if (!profile) {
        return res.status(404).json({ message: 'Профиль не найден' });
      }

      return res.json(profile);
    } catch (error) {
      console.error('Error getting profile:', error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  /**
   * Обновление профиля пользователя
   * @param {Object} req - Объект запроса
   * @param {Object} res - Объект ответа
   * @returns {Promise<Object>} Обновленный профиль пользователя
   */
  static async updateProfile(req, res) {
    try {
      // Получаем ID пользователя из токена
      const { id: userId } = res.locals.user;

      // Получаем данные из тела запроса
      const { gender, trainingExperience, about } = req.body;

      // Получаем загруженный файл аватара
      const avatarFile = req.file;

      console.log('Updating profile for user:', userId);

      // Проверяем существование пользователя
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      // Формируем путь к аватару, если файл был загружен
      let avatarPath = null;
      if (avatarFile) {
        avatarPath = `/avatars/${avatarFile.filename}`;
      }

      // Создаем или обновляем профиль пользователя
      const [profile, created] = await UserProfile.findOrCreate({
        where: { userId },
        defaults: {
          userId,
          avatar: avatarPath,
          gender,
          trainingExperience,
          about,
          personalRecords: 0,
          trainingCount: 0,
        },
      });

      // Если профиль уже существует, обновляем его
      if (!created) {
        // Если загружен новый аватар, удаляем старый
        if (avatarPath) {
          if (profile.avatar) {
            const oldAvatarPath = path.join(process.cwd(), 'public', profile.avatar);
            try {
              await fs.unlink(oldAvatarPath);
            } catch (error) {
              console.error('Error deleting old avatar:', error);
            }
          }
          profile.avatar = avatarPath;
        }

        // Обновляем остальные поля профиля
        profile.gender = gender;
        profile.trainingExperience = trainingExperience;
        profile.about = about;
        await profile.save();
      }

      return res.json(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getTrainers(req, res) {
    try {
      const trainers = await User.findAll({
        where: {
          trener: true,
        },
        include: [
          {
            model: UserProfile,
            attributes: [
              'avatar',
              'gender',
              'trainingExperience',
              'personalRecords',
              'trainingCount',
              'userId',
              'about',
            ],
          },
        ],
        attributes: ['id', 'name', 'email'],
      });

      return res.json(trainers);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getClients(req, res) {
    try {
      const clients = await User.findAll({
        where: {
          trener: false,
        },
        include: [
          {
            model: UserProfile,
            attributes: [
              'avatar',
              'gender',
              'trainingExperience',
              'personalRecords',
              'trainingCount',
              'userId',
              'about',
            ],
          },
        ],
        attributes: ['id', 'name', 'email'],
      });

      return res.json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserProfileController;
