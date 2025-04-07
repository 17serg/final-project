'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    static associate(models) {
      Exercise.hasMany(models.ExerciseOfTraining, {
        foreignKey: 'exerciseId',
        as: 'exerciseOfTrainings',
      });
    }
  }

  Exercise.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      difficulty: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        allowNull: false,
        defaultValue: 'beginner',
      },
      muscle_groups: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      equipment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      exercise_type: {
        type: DataTypes.ENUM('compound', 'isolation', 'cardio', 'bodyweight'),
        allowNull: false,
        defaultValue: 'compound',
      },
    },
    {
      sequelize,
      modelName: 'Exercise',
    },
  );

  return Exercise;
};
