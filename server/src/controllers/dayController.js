const { Day } = require('../../db/models');
const { Op } = require('sequelize');

const DayController = {
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
      });

      res.json(days);
    } catch (error) {
      console.error('Ошибка при получении дней:', error);
      res.status(500).json({ message: 'Ошибка при получении дней' });
    }
  },

  async getDayById(req, res) {
    try {
      const { id } = req.params;
      const day = await Day.findByPk(id);

      if (!day) {
        return res.status(404).json({ message: 'День не найден' });
      }

      res.json(day);
    } catch (error) {
      console.error('Ошибка при получении дня:', error);
      res.status(500).json({ message: 'Ошибка при получении дня' });
    }
  },

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
      console.error('Ошибка при создании дня:', error);
      res.status(500).json({ message: 'Ошибка при создании дня' });
    }
  },

  async updateDay(req, res) {
    try {
      const { id } = req.params;
      const { isTraining } = req.body;
      const day = await Day.findByPk(id);

      if (!day) {
        return res.status(404).json({ message: 'День не найден' });
      }

      await day.update({ isTraining });
      res.json(day);
    } catch (error) {
      console.error('Ошибка при обновлении дня:', error);
      res.status(500).json({ message: 'Ошибка при обновлении дня' });
    }
  },

  async deleteDay(req, res) {
    try {
      const { id } = req.params;
      const day = await Day.findByPk(id);

      if (!day) {
        return res.status(404).json({ message: 'День не найден' });
      }

      await day.destroy();
      res.json({ message: 'День успешно удален' });
    } catch (error) {
      console.error('Ошибка при удалении дня:', error);
      res.status(500).json({ message: 'Ошибка при удалении дня' });
    }
  },
};

module.exports = DayController;
