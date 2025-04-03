const express = require('express');
const router = express.Router();
const TrainingController = require('../controllers/trainingController');
const { verifyAccessToken } = require('../middlewares/verifyTokens');

// router.use(verifyTokens);

// Получение всех тренировок пользователя
router.get('/', verifyAccessToken, TrainingController.getUserTrainings);

// Создание новой тренировки
router.post('/', verifyAccessToken, TrainingController.createTraining);

// Обновление статуса тренировки
router.patch('/:id/status',  TrainingController.updateTrainingStatus);

// Удаление тренировки
router.delete('/:id', verifyAccessToken,TrainingController.deleteTraining);

module.exports = router;
