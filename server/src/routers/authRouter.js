const express = require('express');
const { User} = require('../../db/models');
const bcrypt = require('bcrypt');
const generateTokens = require('../utils/generateTokens');
const cookieConfig = require('../configs/cookie.config');

const authRouter = express.Router();

authRouter.route('/signup').post(async (req, res) => {
  try {
    const { name, email, password, surname ,birthDate, trener
    } = req.body;
    console.log(req.body, '+++++++++++++++++++++++')
    if (!name || !email || !password || !surname || !birthDate) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { name, surname , birthDate, trener, password: await bcrypt.hash(password, 5)},
    });
    console.log(name, '==========================');

    if (!created) {
      return res.status(400).json({ message: 'Email уже используется' });
    }
    const plainUser = user.get();
    delete plainUser.password;
    const { accessToken, refreshToken } = generateTokens({ user: plainUser });

    res
      .cookie('refreshToken', refreshToken, cookieConfig.refresh)
      .json({ user: plainUser, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Не верный логин или пароль' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('isValidPassword', isValidPassword);

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Не верный логин или пароль' });
    }

    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateTokens({ user: plainUser });
    res
      .cookie('refreshToken', refreshToken, cookieConfig.refresh)
      .json({ user: plainUser, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.get('/logout', (req, res) => {
  res.clearCookie('refreshToken').sendStatus(200);
});

module.exports = authRouter;
