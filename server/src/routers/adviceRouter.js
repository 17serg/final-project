const Router = require('express');
const AdviceController = require('../controllers/adviceController');

const router = new Router();

router.get('/random', AdviceController.getRandomAdvice);

module.exports = router;
