const express = require('express');
const router = express.Router();
const ExerciseController = require('../controllers/exerciseController');
const { verifyAccessToken } = require('../middlewares/verifyTokens');

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

module.exports = router;
