const express = require('express');
const router = express.Router();
const AnthropometryController = require('../controllers/anthropometryController');
const { verifyAccessToken } = require('../middlewares/verifyTokens');

// Все роуты защищены middleware аутентификации
router.use(verifyAccessToken);

// Получение всех замеров пользователя
router.get('/', AnthropometryController.getMeasurements);

// Добавление нового замера
router.post('/', AnthropometryController.addMeasurement);

// Обновление замера
router.put('/:id', AnthropometryController.updateMeasurement);

// Удаление замера
router.delete('/:id', AnthropometryController.deleteMeasurement);

module.exports = router;
