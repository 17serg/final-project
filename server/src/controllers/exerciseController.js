const { Exercise } = require('../../db/models');

const ExerciseController = {
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
        attributes: ['muscle_group'],
        group: ['muscle_group'],
      });
      const muscleGroups = exercises.map((exercise) => exercise.muscle_group);
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
        where: { muscle_group: muscleGroup },
      });
      res.json(exercises);
    } catch (error) {
      console.error('Ошибка при получении упражнений по группе мышц:', error);
      res.status(500).json({ message: 'Ошибка при получении упражнений по группе мышц' });
    }
  },
};

module.exports = ExerciseController;
