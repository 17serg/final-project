'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Training extends Model {
    static associate({ Day, User, Exercise, ExerciseOfTraining }) {
      this.belongsTo(Day, { foreignKey: 'dayId' });
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsTo(Exercise, { foreignKey: 'exerciseId' });
      this.hasMany(ExerciseOfTraining, { foreignKey: 'trainingId' });
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
