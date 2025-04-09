const express = require('express');
const router = express.Router();
const UserAdviceController = require('../controllers/userAdviceController');
const { verifyAccessToken } = require('../middlewares/verifyTokens');



// Получить все сохраненные советы пользователя
router.get('/', verifyAccessToken, UserAdviceController.getUserAdvices);

// Сохранить совет в коллекцию пользователя
router.post('/', verifyAccessToken, UserAdviceController.saveAdvice);

// Удалить совет из коллекции пользователя
router.delete('/:adviceId', verifyAccessToken, UserAdviceController.removeAdvice);

// Проверить, сохранен ли совет пользователем
router.get('/:adviceId/check', verifyAccessToken, UserAdviceController.isAdviceSaved);

module.exports = router;
