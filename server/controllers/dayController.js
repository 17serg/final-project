const { Day } = require('../db/models');

const dayController = {
  // Получение дней за определенный месяц
  async getDaysByMonth(req, res) {
    try {
      const { month, year, userId } = req.query;
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const days = await Day.findAll({
        where: {
          userId,
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['date', 'ASC']],
      });

      res.json(days);
    } catch (error) {
      console.error('Error getting days:', error);
      res.status(500).json({ error: 'Ошибка при получении дней' });
    }
  },

  // Создание нового дня
  async createDay(req, res) {
    try {
      const { date, isTraining, userId } = req.body;
      const day = await Day.create({
        date,
        isTraining,
        userId,
      });
      res.status(201).json(day);
    } catch (error) {
      console.error('Error creating day:', error);
      res.status(500).json({ error: 'Ошибка при создании дня' });
    }
  },

  // Обновление дня
  async updateDay(req, res) {
    try {
      const { id } = req.params;
      const { isTraining } = req.body;
      const day = await Day.findByPk(id);

      if (!day) {
        return res.status(404).json({ error: 'День не найден' });
      }

      await day.update({ isTraining });
      res.json(day);
    } catch (error) {
      console.error('Error updating day:', error);
      res.status(500).json({ error: 'Ошибка при обновлении дня' });
    }
  },

  // Удаление дня
  async deleteDay(req, res) {
    try {
      const { id } = req.params;
      const day = await Day.findByPk(id);

      if (!day) {
        return res.status(404).json({ error: 'День не найден' });
      }

      await day.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting day:', error);
      res.status(500).json({ error: 'Ошибка при удалении дня' });
    }
  },
};

module.exports = dayController;
