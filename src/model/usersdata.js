const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://sai:preethi123@cluster0.mge0ayi.mongodb.net/books"
);
const Schema = mongoose.Schema;

var NewUserSchema = new Schema({
  fname: String,
  lname: String,
  uname: String,
  pwd: String,
});

var usersdata = mongoose.model("user", NewUserSchema); //UserData is the model and NewBookData is the schema

module.exports = usersdata;
