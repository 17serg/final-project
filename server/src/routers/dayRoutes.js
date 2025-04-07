const express = require('express');
const router = express.Router();
const DayController = require('../controllers/dayController');
const { verifyAccessToken } = require('../middlewares/verifyTokens');

// Все роуты защищены middleware аутентификации
// router.use(verifyTokens);

// Получение дней за месяц
router.get('/', verifyAccessToken, DayController.getDaysByMonth);

// Получение дня по ID
router.get('/:id', verifyAccessToken, DayController.getDayById);

// Создание нового дня
router.post('/', verifyAccessToken, DayController.createDay);

// Обновление дня
router.patch('/:id', verifyAccessToken, DayController.updateDay);

// Удаление дня
router.delete('/:id', verifyAccessToken, DayController.deleteDay);

module.exports = router;
