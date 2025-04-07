const express = require('express');
const ChatController = require('../controllers/ChatController');

const messagesRouter = express.Router();

// Получение всех сообщений между пользователем и тренером
messagesRouter.get('/:userId/:trainerId', ChatController.getAllMessage);
messagesRouter.get('/unread/:userId', ChatController)

module.exports = messagesRouter;