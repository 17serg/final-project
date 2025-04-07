require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    use_env_variable: process.env.DB_URL ? 'DB_URL' : undefined,
    dialect: 'postgres',
    logging: false,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    use_env_variable: process.env.DB_URL ? 'DB_URL' : undefined,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    use_env_variable: process.env.DB_URL ? 'DB_URL' : undefined,
    dialect: 'postgres',
    logging: false,
  },
};
