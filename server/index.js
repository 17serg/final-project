// const express = require('express');
// const cors = require('cors');
// const { sequelize } = require('./db/models');
// // const userRoutes = require('./routes/userRoutes');
// const dayRoutes = require('./routes/dayRoutes');
// const trainingRoutes = require('./routes/trainingRoutes');
// const exerciseRoutes = require('./routes/exerciseRoutes');

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Роуты
// // app.use('/api/users', userRoutes);
// app.use('/api/days', dayRoutes);
// app.use('/api/trainings', trainingRoutes);
// app.use('/api/exercises', exerciseRoutes);

// // Обработка ошибок
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Что-то пошло не так!' });
// });

// // Запуск сервера
// const startServer = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Соединение с базой данных установлено успешно.');

//     await sequelize.sync();
//     console.log('База данных синхронизирована.');

//     app.listen(PORT, () => {
//       console.log(`Сервер запущен на порту ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Ошибка при запуске сервера:', error);
//     process.exit(1);
//   }
// };

// startServer();
