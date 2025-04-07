const express = require('express');
const router = express.Router();
const ExerciseController = require('../controllers/exerciseController');
const { verifyAccessToken } = require('../middlewares/verifyTokens');
const { Exercise } = require('../../db/models');
const { Sequelize, Op } = require('sequelize');

// Получение всех упражнений
router.get('/', verifyAccessToken, ExerciseController.getAllExercises);

// Получение всех групп мышц
router.get('/muscle-groups', verifyAccessToken, ExerciseController.getMuscleGroups);

// Получение упражнений по группе мышц
router.get(
  '/muscle-group/:muscleGroup',
  verifyAccessToken,
  ExerciseController.getExercisesByMuscleGroup,
);

// Получение всех категорий
router.get('/categories', verifyAccessToken, async (req, res) => {
  try {
    const exercises = await Exercise.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']],
      where: {
        category: {
          [Op.ne]: null,
        },
      },
    });

    const categories = exercises
      .map((exercise) => exercise.getDataValue('category'))
      .filter(Boolean);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Получение упражнений по категории
router.get('/by-category/:category', verifyAccessToken, async (req, res) => {
  try {
    const exercises = await Exercise.findAll({
      where: {
        category: req.params.category,
      },
    });
    res.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
