'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Anthropometry extends Model {

    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'userId' });
    }
  }
  Anthropometry.init({
    date: DataTypes.STRING,
    weight: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    breast: DataTypes.INTEGER,
    waist: DataTypes.INTEGER,
    hips: DataTypes.INTEGER,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Anthropometry',
  });
  return Anthropometry;
};