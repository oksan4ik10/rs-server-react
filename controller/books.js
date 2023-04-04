const Books = require("../models/books");
const errorHandler = require("../utils/errorHandler");
module.exports.getAll = async function (req, res) {
  try {
    const books = await Books.find({});
    res.status(200).json(books);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getAllPage = async function (req, res) {
  try {
    const page = req.query.page || 0;
    const booksOnPage = 6;

    const books = await Books.find({})
      .skip(page * booksOnPage)
      .limit(booksOnPage);
    res.status(200).json(books);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.sortBook = async function (req, res) {
  try {
    const p = req.query.sort;
    const page = req.query.page || 0;
    const booksOnPage = 6;

    let books = await Books.find({})
      .skip(page * booksOnPage)
      .limit(booksOnPage);
    if (p === "author") {
      books = await Books.find({})
        .skip(page * booksOnPage)
        .limit(booksOnPage)
        .sort({ author: 1 });
    } else if (p === "title") {
      books = await Books.find({})
        .skip(page * booksOnPage)
        .limit(booksOnPage)
        .sort({ title: 1 });
    }
    res.status(200).json(books);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.searchBook = async function (req, res) {
  try {
    const search = req.query.query;
    const booksOnPage = 6;
    const reg = new RegExp(search, "gi");
    const books = await Books.find({
      $or: [{ author: reg }, { genre: reg }, { desc: reg }, { title: reg }],
    }).limit(booksOnPage);
    res.status(200).json(books);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getById = async function (req, res) {
  try {
    const book = await Books.findById(req.params.id);
    res.status(200).json(book);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getBestBook = async (req, res) => {
  try {
    const books = await Books.find({}).sort({ raiting: -1 }).limit(7);
    res.status(200).json(books);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getRandomBook = async (req, res) => {
  function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }
  try {
    let books;
    if (req.body.genre) {
      books = await Books.find({ genre: req.body.genre });
    } else {
      books = await Books.find({});
    }

    if (books.length > 0)
      res.status(200).json(books[randomInteger(0, books.length - 1)]);
    else
      res.status(404).json({
        message: "Книги по заданному жанру не существует",
      });
  } catch (e) {
    errorHandler(res, e);
  }
};
