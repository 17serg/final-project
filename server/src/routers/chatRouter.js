const express = require('express');
const ChatController = require('../controllers/ChatController');

const chatRouter = express.Router();

chatRouter.get('/', ChatController.getAllTrainers); 
chatRouter.get('/:userId/:trainerId', ChatController.getAllMessage);

module.exports = chatRouter;