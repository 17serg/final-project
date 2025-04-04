const { Training } = require('../../db/models');

const TrainingController = {
  async getUserTrainings(req, res) {
    try {
      const { userId } = req.query;
      const trainings = await Training.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });
      res.json(trainings);
    } catch (error) {
      console.error('Ошибка при получении тренировок:', error);
      res.status(500).json({ message: 'Ошибка при получении тренировок' });
    }
  },

  async createTraining(req, res) {
    try {
      const { dayId, userId, complete } = req.body;
      console.log('Полученные данные:', { dayId, userId, complete }); // Отладочный лог

      const training = await Training.create({
        dayId,
        userId,
        complete,
      });
      res.status(201).json(training);
    } catch (error) {
      console.error('Ошибка при создании тренировки:', error);
      res.status(500).json({ message: 'Ошибка при создании тренировки' });
    }
  },

  async updateTrainingStatus(req, res) {
    try {
      const { id } = req.params;
      const { complete } = req.body;
      const training = await Training.findByPk(id);

      if (!training) {
        return res.status(404).json({ message: 'Тренировка не найдена' });
      }

      await training.update({ complete });
      res.json(training);
    } catch (error) {
      console.error('Ошибка при обновлении статуса тренировки:', error);
      res.status(500).json({ message: 'Ошибка при обновлении статуса тренировки' });
    }
  },

  async deleteTraining(req, res) {
    try {
      const { id } = req.params;
      const training = await Training.findByPk(id);

      if (!training) {
        return res.status(404).json({ message: 'Тренировка не найдена' });
      }

      await training.destroy();
      res.json({ message: 'Тренировка успешно удалена' });
    } catch (error) {
      console.error('Ошибка при удалении тренировки:', error);
      res.status(500).json({ message: 'Ошибка при удалении тренировки' });
    }
  },

    async getTrainingByDayId(req, res) {
      try {
        const { dayId } = req.params;
        const training = await Training.findOne({
          where: { dayId },
        });

        if (!training) {
          return res.status(404).json({ message: 'Тренировка не найдена' });
        }

        res.json(training);
      } catch (error) {
        console.error('Ошибка при получении тренировки:', error);
        res.status(500).json({ message: 'Ошибка при получении тренировки' });
      }
    },

    async getTrainingById(req, res) {
      try {
        const { id } = req.params;
        const training = await Training.findByPk(id);
    
        if (!training) {
          return res.status(404).json({ message: 'Тренировка не найдена' });
        }

        res.json(training);
    } catch (error) {
      console.error('Ошибка при получении тренировки:', error);
      res.status(500).json({ message: 'Ошибка при получении тренировки' });
    }
  },
};

module.exports = TrainingController;
