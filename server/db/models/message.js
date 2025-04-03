'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
      this.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });
    }
  }
  Message.init({
    text: DataTypes.STRING,
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};