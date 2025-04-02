const { Read, Book, Like,Comment,User } = require('../../db/models');
const path = require('path');

class BooksService {
  static getOneBook(id) {
    return Book.findByPk(id, {
      include: [{
        model: Like,
      },
      {
        model: Read,
      },
      {
        model: Comment,
        include: {
        model: User,
      },
      }]
    })
  }

  static getAllBooks() {
    return Book.findAll({
      include: [{
        model: Like,
      },
      {
        model: Read,
      }]
    });
  }

  static getMyBooks(userId) {
    return Book.findAll({
      where: { userId },
      include: [Like, Read],
    });
  }

  static getFavouriteBooks(userId) {
    return Book.findAll({
      // where: { userId },
      include: [{
        model: Like,
        where: { userId }
      },
      {
        model: Read,
      }]
    });
  }

  static getReadedBooks(userId) {
    return Book.findAll({
      // where: { userId },
      include: [{
        model: Read,
        where: { userId }
      },
      {
        model: Like,
      }]
    });
  }

  static async addBook(title, description, link, userId, fileName) {
    try {
      if (!title || !description || !link) throw new Error('Не все поля переданы');
      const newBook = await Book.create({
        title,
        description,
        link,
        userId,
        fileName,
      });
      return newBook;
    } catch (error) {
      console.log(error);
    }
  }

  static async editBook(bookId, title, description, link, userId, file) {
    if (!title && !description && !link) throw new Error('Не все поля переданы');
    const updatedBook = await this.getOneBook(bookId);
    if (!updatedBook) throw new Error('Книга не найдена');
    if (updatedBook.userId !== userId) throw new Error('Нет прав на изменение');
    updatedBook.title = title || updatedBook.title;
    updatedBook.description = description || updatedBook.description;
    updatedBook.link = link || updatedBook.link;
    updatedBook.file = file || updatedBook.file;
    updatedBook.save();
    return updatedBook;
  }

  static async deleteBook(bookId, userId) {
    const book = await BooksService.getOneBook(bookId);
    if (!book) throw new Error('Книга не найдена');
    if (book.userId !== userId) throw new Error('Нет прав на удаление');
    return book.destroy();
  }

  static async likeBook(bookId, userId) {
    const like = await Like.findOne({
      where: {
        bookId,
        userId,
      },
    });
    if (like) {
      await Like.destroy({
        where: {
          id: like.id,
        },
      });
    } else {
      await Like.create({
        bookId,
        userId,
      });
    }
    const book = await Book.findOne({
      where: {
        id: bookId,
      },
      include: [Like, Read],
    });
    return book;
  }

  static async readBook(bookId, userId) {
    const read = await Read.findOne({
      where: {
        bookId,
        userId,
      },
    });
    if (read) {
      await Read.destroy({
        where: {
          id: read.id,
        },
      });
    } else {
      await Read.create({
        bookId,
        userId,
      });
    }
    const book = await Book.findOne({
      where: {
        id: bookId,
      },
      include: [Like, Read],
    });
    return book;
  }

  static async addCommentBook(bookId, authorId, text) {
      const comment = await Comment.create({
        bookId, authorId, text});
    return comment;
  }

  static async downloadBook(bookId) {
    const book = await BooksService.getOneBook(bookId);
    if (!book) throw new Error('Книга не найдена');
    let currentDir = __dirname;
    currentDir = path.dirname(currentDir); 
    currentDir = path.dirname(currentDir); 
    const filePath = path.join(currentDir, 'public', book.fileName);
    return {filePath, fileName: book.fileName };
  }
}

module.exports = BooksService;
