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
const trainersRouter = require('./routers/trainersRouter')
const messagesRouter = require('./routers/messagesRouter')


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

app.use('/api/trainings/', trainingRouter);
app.use('/api/trainers', trainersRouter);
app.use('/api/messages', messagesRouter);


module.exports = app;
