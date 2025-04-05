'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExerciseOfTraining extends Model {
    static associate(models) {
      // Определяем связи с другими моделями
      this.belongsTo(models.Training, {
        foreignKey: 'trainingId',
        as: 'training',
      });
      this.belongsTo(models.Exercise, {
        foreignKey: 'exerciseId',
        as: 'Exercise',
      });
      // Добавляем связь с ExerciseSet
      this.hasMany(models.ExerciseSet, {
        foreignKey: 'exerciseOfTrainingId',
        as: 'exerciseSets',
      });
    }
  }

  ExerciseOfTraining.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
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
        comment: 'Длительность упражнения в секундах',
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Вес в кг',
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
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Порядок упражнения в тренировке',
      },
    },
    {
      sequelize,
      modelName: 'ExerciseOfTraining',
      tableName: 'ExerciseOfTrainings',
      timestamps: true,
    },
  );

  return ExerciseOfTraining;
};
