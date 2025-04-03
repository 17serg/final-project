'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExerciseOfTraining extends Model {
    static associate({ Training, Exercise }) {
      this.belongsTo(Training, { foreignKey: 'trainingId' });
      this.belongsTo(Exercise, { foreignKey: 'exerciseId' });
    }
  }
  ExerciseOfTraining.init(
    {
      trainingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Trainings',
          key: 'id',
        },
      },
      exerciseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Exercises',
          key: 'id',
        },
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Продолжительность в минутах',
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Вес в килограммах',
      },
      sets: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Количество подходов',
      },
      reps: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Количество повторений',
      },
    },
    {
      sequelize,
      modelName: 'ExerciseOfTraining',
    },
  );
  return ExerciseOfTraining;
};
