const { Exercise } = require('../../db/models');
const { Op } = require('sequelize');

const exerciseController = {
  async getAllExercises(req, res) {
    try {
      const exercises = await Exercise.findAll();
      res.json(exercises);
    } catch (error) {
      console.error('Ошибка при получении упражнений:', error);
      res.status(500).json({ message: 'Ошибка при получении упражнений' });
    }
  },

  async getMuscleGroups(req, res) {
    try {
      const exercises = await Exercise.findAll({
        attributes: ['muscle_groups'],
        raw: true,
      });

      const muscleGroups = [
        ...new Set(exercises.flatMap((exercise) => exercise.muscle_groups)),
      ].sort();

      res.json(muscleGroups);
    } catch (error) {
      console.error('Ошибка при получении групп мышц:', error);
      res.status(500).json({ message: 'Ошибка при получении групп мышц' });
    }
  },

  async getExercisesByMuscleGroup(req, res) {
    try {
      const { muscleGroup } = req.params;
      const exercises = await Exercise.findAll({
        where: {
          muscle_groups: {
            [Op.contains]: [muscleGroup],
          },
        },
      });
      res.json(exercises);
    } catch (error) {
      console.error('Ошибка при получении упражнений по группе мышц:', error);
      res.status(500).json({ message: 'Ошибка при получении упражнений' });
    }
  },

  async getExercisesByType(req, res) {
    try {
      const { type } = req.params;
      const exercises = await Exercise.findAll({
        where: {
          exercise_type: type,
        },
      });
      res.json(exercises);
    } catch (error) {
      console.error('Ошибка при получении упражнений по типу:', error);
      res.status(500).json({ message: 'Ошибка при получении упражнений' });
    }
  },

  async createExercise(req, res) {
    try {
      const exercise = await Exercise.create(req.body);
      res.status(201).json(exercise);
    } catch (error) {
      console.error('Ошибка при создании упражнения:', error);
      res.status(500).json({ message: 'Ошибка при создании упражнения' });
    }
  },

  async updateExercise(req, res) {
    try {
      const { id } = req.params;
      const [updated] = await Exercise.update(req.body, {
        where: { id },
      });

      if (updated) {
        const updatedExercise = await Exercise.findByPk(id);
        res.json(updatedExercise);
      } else {
        res.status(404).json({ message: 'Упражнение не найдено' });
      }
    } catch (error) {
      console.error('Ошибка при обновлении упражнения:', error);
      res.status(500).json({ message: 'Ошибка при обновлении упражнения' });
    }
  },

  async deleteExercise(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Exercise.destroy({
        where: { id },
      });

      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Упражнение не найдено' });
      }
    } catch (error) {
      console.error('Ошибка при удалении упражнения:', error);
      res.status(500).json({ message: 'Ошибка при удалении упражнения' });
    }
  },
};

module.exports = exerciseController;
