const { Advice } = require('../../db/models');
const { Sequelize } = require('sequelize');

class AdviceController {
  static async getRandomAdvice(req, res) {
    try {
      const advice = await Advice.findOne({
        order: [Sequelize.literal('RANDOM()')],
      });

      if (!advice) {
        return res.status(404).json({
          success: false,
          message: 'Советы не найдены',
        });
      }

      return res.json({
        success: true,
        data: advice,
      });
    } catch (error) {
      console.error('Error getting random advice:', error);
      return res.status(500).json({
        success: false,
        message: 'Ошибка сервера',
        error: error.message,
      });
    }
  }
}

module.exports = AdviceController;
