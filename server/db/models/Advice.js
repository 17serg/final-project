const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Advice extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  Advice.init(
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Advice',
      tableName: 'Advices',
    },
  );

  return Advice;
};
