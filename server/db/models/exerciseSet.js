const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExerciseSet extends Model {
    static associate(models) {
      // Определяем связь с ExerciseOfTraining
      this.belongsTo(models.ExerciseOfTraining, {
        foreignKey: 'exerciseOfTrainingId',
        as: 'exerciseOfTraining',
      });
    }
  }

  ExerciseSet.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exerciseOfTrainingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ExerciseOfTrainings',
          key: 'id',
        },
      },
      setNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Номер подхода',
      },
      actualWeight: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Фактический вес в кг',
      },
      actualReps: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Фактическое количество повторений',
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Статус выполнения подхода',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Заметки к подходу',
      },
      executionDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Дата выполнения подхода',
      },
      executionTime: {
        type: DataTypes.TIME,
        allowNull: true,
        comment: 'Время выполнения подхода',
      },
    },
    {
      sequelize,
      modelName: 'ExerciseSet',
      tableName: 'ExerciseSets',
      timestamps: true,
    },
  );

  return ExerciseSet;
};
