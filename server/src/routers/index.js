const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const exerciseRoutes = require('./exerciseRoutes');
const trainingRoutes = require('./trainingRoutes');
const exerciseOfTrainingRoutes = require('./exerciseOfTrainingRoutes');
const exerciseSetRoutes = require('./exerciseSetRoutes');
const dayRoutes = require('./dayRoutes');

// Регистрируем маршруты
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/trainings', trainingRoutes);
router.use('/exercise-of-trainings', exerciseOfTrainingRoutes);
router.use('/exercise-sets', exerciseSetRoutes);
router.use('/days', dayRoutes);

module.exports = router;
