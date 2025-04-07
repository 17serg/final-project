'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Training extends Model {
    static associate({ Day, User, ExerciseOfTraining }) {
      this.belongsTo(Day, { foreignKey: 'dayId' });
      this.belongsTo(User, { foreignKey: 'userId' });
      this.hasMany(ExerciseOfTraining, {
        foreignKey: 'trainingId',
        onDelete: 'CASCADE',
      });
    }
  }
  Training.init(
    {
      dayId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Days',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      complete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Training',
    },
  );
  return Training;
};
