const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');
const authMiddleware = require('../middleware/authMiddleware');

// Все роуты защищены middleware аутентификации
router.use(authMiddleware);

// Получение дней за месяц
router.get('/', dayController.getDaysByMonth);

// Создание нового дня
router.post('/', dayController.createDay);

// Обновление дня
router.patch('/:id', dayController.updateDay);

// Удаление дня
router.delete('/:id', dayController.deleteDay);

module.exports = router;
