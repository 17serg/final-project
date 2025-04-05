'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Day extends Model {
    static associate({ User, Training }) {
      this.belongsTo(User, { foreignKey: 'userId' });
      this.hasOne(Training, { foreignKey: 'dayId' });
    }
  }
  Day.init(
    {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isTraining: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Day',
    },
  );
  return Day;
};
