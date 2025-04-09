const { User } = require('../../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
  static async signup(req, res) {
    try {
      const { name, surname, email, password, birthDate, trener } = req.body;

      // Проверяем, существует ли пользователь с таким email
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email уже используется' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        surname,
        email,
        password: hashedPassword,
        birthDate,
        trener,
      });

      const accessToken = jwt.sign(
        { user: { id: user.id, email: user.email } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' },
      );

      const refreshToken = jwt.sign(
        { user: { id: user.id, email: user.email } },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' },
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      });

      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
      });
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  // ... existing code ...
}
