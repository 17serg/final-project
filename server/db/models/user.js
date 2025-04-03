'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Book, Comment, Like,Read, Message}) {
      this.hasMany(Book, { foreignKey: 'userId' });
      this.hasMany(Comment, { foreignKey: 'authorId' });
      this.hasMany(Like, { foreignKey: 'userId' });
      this.hasMany(Read, { foreignKey: 'userId' });
      this.hasMany(Message, { foreignKey: 'senderId' });
      this.hasMany(Message, { foreignKey: 'receiverId' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    birthDate: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    trener: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};