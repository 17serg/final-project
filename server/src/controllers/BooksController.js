const BooksService = require('../services/BooksServices');
const fs = require('fs').promises;
const path = require('path');

class BooksController {
  static async getAll(req, res) {
    try {
      const books = await BooksService.getAllBooks();
      res.json(books);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getOne(req, res) {
    const { id:bookId } = res.locals;
    console.log(bookId)
    try {
      const book = await BooksService.getOneBook(bookId);
      res.json(book);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getMy(req, res) {
    const { id: userId } = res.locals.user;
    try {
      const books = await BooksService.getMyBooks(userId);
      res.json(books);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getFavourite(req, res) {
    const { id: userId } = res.locals.user;
    try {
      const books = await BooksService.getFavouriteBooks(userId);
      res.json(books);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getReaded(req, res) {
    const { id: userId } = res.locals.user;
    try {
      const books = await BooksService.getReadedBooks(userId);
      res.json(books);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
  

  static async createBook(req, res) {
    const { id: userId } = res.locals.user;
    const { title, description, link: url} = req.body;
    console.log(req.file)
    let name=null
    try {
      if (req.file) {
        const { originalname, buffer } = req.file;
         name = `${Date.now()}${path.extname(originalname)}`;
        await fs.writeFile(`./public/${name}`, buffer);
      }
      const newBook = await BooksService.addBook(title, description, url, userId, name);
      const book = newBook.get();
      return res.status(201).json(book);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async editBook(req, res) {
    const { id: bookId } = res.locals;
    const { id: userId } = res.locals.user;
    const { title, description, url, file } = req.body;
    try {
      const book = await BooksService.editBook(bookId, title, description, url, userId, file);
      return res.status(200).json(book);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async deleteOne(req, res) {
    const { id: bookId } = res.locals;
    const { id: userId } = res.locals.user;
    try {
      await BooksService.deleteBook(bookId, userId);
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async likeBook(req, res) {
    const { id: bookId } = res.locals;
    const { id: userId } = res.locals.user;
    try {
      const like = await BooksService.likeBook(bookId, userId);
      // const books = await BooksService.getAllBooks();
      return res.status(201).json(like)
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async readBook(req, res) {
    const { id: bookId } = res.locals;
    const { id: userId } = res.locals.user;
    try {
      const read = await BooksService.readBook(bookId, userId);
      // const books = await BooksService.getAllBooks();
      return res.status(201).json(read)
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
  

  static async commentBook(req, res) {
    const { id: bookId } = res.locals;
    const { id: userId } = res.locals.user;
    const {text} = req.body;
    try {
      await BooksService.addCommentBook(bookId, userId, text);
      const book = await BooksService.getOneBook(bookId)
      return res.status(201).json(book);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async downloadBook(req, res) {
    const { id: bookId } = res.locals;
    try {
      const {filePath, fileName} = await BooksService.downloadBook(bookId);
      console.log(filePath)
      res.download(filePath)
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

}

module.exports = BooksController;
