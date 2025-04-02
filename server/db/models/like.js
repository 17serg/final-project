'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Book}) {
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsTo(Book, { foreignKey: 'bookId' });
    }
  }
  Like.init({
    userId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
    isReaded: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};