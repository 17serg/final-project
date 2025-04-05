const express = require('express');
const router = express.Router();
const ExerciseSetController = require('../controllers/exerciseSetController');
const { verifyAccessToken } = require('../middlewares/verifyTokens');

// Получение всех подходов для упражнения в тренировке
router.get(
  '/exercise-of-training/:exerciseOfTrainingId',
  verifyAccessToken,
  ExerciseSetController.getExerciseSets,
);

// Получение одного подхода по ID
router.get('/:id', verifyAccessToken, ExerciseSetController.getExerciseSetById);

// Создание нового подхода
router.post(
  '/exercise-of-training/:exerciseOfTrainingId',
  verifyAccessToken,
  ExerciseSetController.createExerciseSet,
);

// Создание нескольких подходов для упражнения
router.post(
  '/exercise-of-training/:exerciseOfTrainingId/multiple',
  verifyAccessToken,
  ExerciseSetController.createMultipleExerciseSets,
);

// Обновление подхода
router.patch('/:id', verifyAccessToken, ExerciseSetController.updateExerciseSet);

// Удаление подхода
router.delete('/:id', verifyAccessToken, ExerciseSetController.deleteExerciseSet);

module.exports = router;
