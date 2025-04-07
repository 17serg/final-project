const { Anthropometry } = require('../../db/models');
const { verifyAccessToken } = require('../middlewares/verifyTokens');

class AnthropometryController {
  // Получение всех замеров пользователя
  static async getMeasurements(req, res) {
    try {
      const { id: userId } = res.locals.user;
      const measurements = await Anthropometry.findAll({
        where: { userId },
        order: [['date', 'DESC']],
      });

      // Преобразуем timestamp обратно в строку даты
      const formattedMeasurements = measurements.map((measurement) => {
        const measurementData = measurement.toJSON();
        // Преобразуем timestamp в формат YYYY-MM-DD
        const date = new Date(parseInt(measurementData.date));
        measurementData.date = date.toISOString().split('T')[0];
        return measurementData;
      });

      console.log('Отправляем измерения:', formattedMeasurements);
      res.json(formattedMeasurements);
    } catch (error) {
      console.error('Ошибка при получении замеров:', error);
      res.status(500).json({ message: 'Ошибка при получении замеров' });
    }
  }

  // Добавление нового замера
  static async addMeasurement(req, res) {
    try {
      const { id: userId } = res.locals.user;
      const { date, weight, height, chest, waist, hips } = req.body;

      // Преобразуем строку даты в timestamp (миллисекунды)
      const dateTimestamp = new Date(date).getTime();

      // Преобразуем все числовые значения в целые числа
      const measurementData = {
        date: dateTimestamp,
        weight: Math.round(parseFloat(weight)),
        height: Math.round(parseFloat(height)),
        breast: Math.round(parseFloat(chest)), // В модели поле называется breast, а в API chest
        waist: Math.round(parseFloat(waist)),
        hips: Math.round(parseFloat(hips)),
        userId: parseInt(userId),
      };

      console.log('Данные для создания замера:', measurementData);

      const measurement = await Anthropometry.create(measurementData);

      res.status(201).json(measurement);
    } catch (error) {
      console.error('Ошибка при добавлении замера:', error);
      res
        .status(500)
        .json({ message: 'Ошибка при добавлении замера', error: error.message });
    }
  }

  // Обновление замера
  static async updateMeasurement(req, res) {
    try {
      const { id } = req.params;
      const { id: userId } = res.locals.user;
      const { date, weight, height, chest, waist, hips } = req.body;

      // Преобразуем строку даты в timestamp (миллисекунды)
      const dateTimestamp = new Date(date).getTime();

      // Преобразуем все числовые значения в целые числа
      const measurementData = {
        date: dateTimestamp,
        weight: Math.round(parseFloat(weight)),
        height: Math.round(parseFloat(height)),
        breast: Math.round(parseFloat(chest)), // В модели поле называется breast, а в API chest
        waist: Math.round(parseFloat(waist)),
        hips: Math.round(parseFloat(hips)),
      };

      const measurement = await Anthropometry.findOne({
        where: { id, userId },
      });

      if (!measurement) {
        return res.status(404).json({ message: 'Замер не найден' });
      }

      await measurement.update(measurementData);

      res.json(measurement);
    } catch (error) {
      console.error('Ошибка при обновлении замера:', error);
      res
        .status(500)
        .json({ message: 'Ошибка при обновлении замера', error: error.message });
    }
  }

  // Удаление замера
  static async deleteMeasurement(req, res) {
    try {
      const { id } = req.params;
      const { id: userId } = res.locals.user;

      const measurement = await Anthropometry.findOne({
        where: { id, userId },
      });

      if (!measurement) {
        return res.status(404).json({ message: 'Замер не найден' });
      }

      await measurement.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Ошибка при удалении замера:', error);
      res
        .status(500)
        .json({ message: 'Ошибка при удалении замера', error: error.message });
    }
  }
}

module.exports = AnthropometryController;
