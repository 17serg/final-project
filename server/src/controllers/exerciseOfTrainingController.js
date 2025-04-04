const { ExerciseOfTraining } = require('../../db/models');

const ExerciseOfTrainingController = {
  async createExerciseOfTraining(req, res) {
    console.log(req.body);
    try {
      const { trainingId, exerciseId, duration, weight, sets, reps } = req.body;
      const exerciseOfTraining = await ExerciseOfTraining.create({
        trainingId,
        exerciseId,
        duration,
        weight,
        sets,
        reps,
      });
      res.status(201).json(exerciseOfTraining);
    } catch (error) {
      console.error('Ошибка при создании упражнения тренировки:', error);
      res.status(500).json({ message: 'Ошибка при создании упражнения тренировки' });
    }
  },

  async updateExerciseOfTraining(req, res) {
    try {
      const { id } = req.params;
      const { duration, weight, sets, reps } = req.body;
      const exerciseOfTraining = await ExerciseOfTraining.findByPk(id);

      if (!exerciseOfTraining) {
        return res.status(404).json({ message: 'Упражнение тренировки не найдено' });
      }

      await exerciseOfTraining.update({
        duration,
        weight,
        sets,
        reps,
      });
      res.json(exerciseOfTraining);
    } catch (error) {
      console.error('Ошибка при обновлении упражнения тренировки:', error);
      res.status(500).json({ message: 'Ошибка при обновлении упражнения тренировки' });
    }
  },

  async deleteExerciseOfTraining(req, res) {
    try {
      const { id } = req.params;
      const exerciseOfTraining = await ExerciseOfTraining.findByPk(id);

      if (!exerciseOfTraining) {
        return res.status(404).json({ message: 'Упражнение тренировки не найдено' });
      }

      await exerciseOfTraining.destroy();
      res.json({ message: 'Упражнение тренировки успешно удалено' });
    } catch (error) {
      console.error('Ошибка при удалении упражнения тренировки:', error);
      res.status(500).json({ message: 'Ошибка при удалении упражнения тренировки' });
    }
  },

  async getExercisesByTrainingId(req, res) {
    try {
      const { trainingId } = req.params;
      const exercises = await ExerciseOfTraining.findAll({
        where: { trainingId },
        include: ['Exercise'],
      });
      res.json(exercises);
    } catch (error) {
      console.error('Ошибка при получении упражнений тренировки:', error);
      res.status(500).json({ message: 'Ошибка при получении упражнений тренировки' });
    }
  },
};

module.exports = ExerciseOfTrainingController;
