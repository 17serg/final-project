const usersRouter = require('express').Router();
const ChatController = require('../controllers/ChatController');

usersRouter.route('/').get(ChatController.getAllUsers);

module.exports = usersRouter;