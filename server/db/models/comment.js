'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Book}) {
      this.belongsTo(User, { foreignKey: 'authorId' });
      this.belongsTo(Book, { foreignKey: 'bookId' });
    }
  }
  Comment.init({
    text: DataTypes.TEXT,
    authorId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};