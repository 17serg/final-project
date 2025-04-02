'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Comment,Like,Read}) {
      this.belongsTo(User, { foreignKey: 'userId' });
      this.hasMany(Comment, { foreignKey: 'bookId' });
      this.hasMany(Like, { foreignKey: 'bookId' });
      this.hasMany(Read, { foreignKey: 'bookId' });
    }
  }
  Book.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    link: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    fileName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};