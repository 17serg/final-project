const express = require('express');
const router = express.Router();
const ExerciseOfTrainingController = require('../controllers/exerciseOfTrainingController');
const { verifyAccessToken } = require('../middlewares/verifyTokens');

// Создание упражнения тренировки
router.post(
  '/',
  verifyAccessToken,
  ExerciseOfTrainingController.createExerciseOfTraining,
);

// Обновление упражнения тренировки
router.put(
  '/:id',
  verifyAccessToken,
  ExerciseOfTrainingController.updateExerciseOfTraining,
);

// Удаление упражнения тренировки
router.delete(
  '/:id',
  verifyAccessToken,
  ExerciseOfTrainingController.deleteExerciseOfTraining,
);

// Получение упражнений по ID тренировки
router.get(
  '/training/:trainingId',
  verifyAccessToken,
  ExerciseOfTrainingController.getExercisesByTrainingId,
);

// Обновление порядка упражнений
router.patch(
  '/training/:trainingId/order',
  verifyAccessToken,
  ExerciseOfTrainingController.updateExercisesOrder,
);

module.exports = router;
