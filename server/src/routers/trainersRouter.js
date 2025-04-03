const express = require('express');
const ChatController = require('../controllers/ChatController');

const trainersRouter = express.Router();

// Получение всех пользователей, с которыми тренер переписывался
trainersRouter.get('/:trainerId/chats', ChatController.getUsersWithChats);
trainersRouter.get('/', ChatController.getAllTrainers)
module.exports = trainersRouter;