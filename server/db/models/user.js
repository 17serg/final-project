'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ UserProfile, Day, Training,Message, Anthropometry }) {
      this.hasOne(UserProfile, { foreignKey: 'userId' });
      this.hasMany(Day, { foreignKey: 'userId' });
      this.hasMany(Training, { foreignKey: 'userId' });
      this.hasMany(Message, { foreignKey: 'senderId' });
      this.hasMany(Message, { foreignKey: 'receiverId' });
      this.hasMany(Anthropometry, { foreignKey: 'userId' });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      surname: DataTypes.STRING,
      birthDate: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      trener: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
