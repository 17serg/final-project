'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
      this.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });
    }
  }

  Message.init(
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      reactions: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: false,
        get() {
          const rawValue = this.getDataValue('reactions');
          return rawValue ? JSON.parse(JSON.stringify(rawValue)) : {};
        },
        set(value) {
          this.setDataValue('reactions', value);
        }
      }
    },
    {
      sequelize,
      modelName: 'Message',
    }
  );

  return Message;
};