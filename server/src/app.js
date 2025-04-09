const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routers/authRouter');
const corsConfig = require('./configs/cors.config');
const tokensRouter = require('./routers/tokensRouter');
const usersRouter = require('./routers/usersRouter');
const userRouter = require('./routers/userRouter');
const dayRouter = require('./routers/dayRoutes');
const trainingRouter = require('./routers/trainingRoutes');
const trainersRouter = require('./routers/trainersRouter');
const messagesRouter = require('./routers/messagesRouter');
const anthropometryRouter = require('./routers/anthropometryRouter');
const exerciseOfTrainingRouter = require('./routers/exerciseOfTrainingRoutes');
const exerciseRouter = require('./routers/exerciseRoutes');
const exerciseSetRouter = require('./routers/exerciseSetRoutes');
const adviceRouter = require('./routers/adviceRouter');
const userAdviceRoutes = require('./routers/userAdviceRoutes');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors(corsConfig));

app.use('/api/auth/', authRouter);
app.use('/api/tokens/', tokensRouter);
app.use('/api/users/', usersRouter);
app.use('/api/user/', userRouter);
app.use('/api/days/', dayRouter);
app.use('/api/exercise-of-trainings/', exerciseOfTrainingRouter);
app.use('/api/trainings/', trainingRouter);
app.use('/api/trainers', trainersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/anthropometry', anthropometryRouter);
app.use('/api/exercises/', exerciseRouter);
app.use('/api/exercise-sets/', exerciseSetRouter);
app.use('/api/advice/', adviceRouter);
app.use('/api/user-advices', userAdviceRoutes);

module.exports = app;
