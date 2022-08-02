const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://sai:preethi123@cluster0.mge0ayi.mongodb.net/books"
);
const Schema = mongoose.Schema;

var NewbooksSchema = new Schema({
  title: String,
  author: String,
  image: String,
  about: String,
});

var booksdata = mongoose.model("book", NewbooksSchema); //UserData is the model and NewBookData is the schema

module.exports = booksdata;
