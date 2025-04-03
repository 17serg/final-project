'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    static associate({ Training, ExerciseOfTraining }) {
      this.hasMany(Training, { foreignKey: 'exerciseId' });
      this.hasMany(ExerciseOfTraining, { foreignKey: 'exerciseId' });
    }
  }
  Exercise.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      muscle_group: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      equipment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Exercise',
    },
  );
  return Exercise;
};
