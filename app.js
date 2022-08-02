const express = require("express");
const booksdata = require("./src/model/booksdata");
const usersdata = require("./src/model/usersdata");
const path = require("path");

const cors = require("cors");
var bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
var app = new express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyparser.json());
app.use(express.static(`./dist/frontend`));

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("Unauthorized request");
  }
  let payload = jwt.verify(token, "secretKey");
  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }
  req.userId = payload.subject;
  next();
}

app.post("/api/insert", verifyToken, function (req, res) {
  console.log("insert", req.body);

  var book = {
    title: req.body.book.title,
    author: req.body.book.author,
    image: req.body.book.image,
    about: req.body.book.about,
  };
  var bookdata = new booksdata(book); //creating instance of book
  bookdata.save();
});
app.get("/api/books", function (req, res) {
  booksdata.find().then(function (books) {
    res.send(books);
    // console.log(books);
  });
});
app.get("/api/:id", (req, res) => {
  const id = req.params.id;
  booksdata.findOne({ _id: id }).then((books) => {
    res.send(books);
  });
});

app.post("/api/login", (req, res) => {
  let userData = req.body;
  var flag = false;

  usersdata.find().then(function (user) {
    console.log("user-db", user);
    for (let i = 0; i < user.length; i++) {
      if (userData.uname == user[i].uname && userData.pwd == user[i].pwd) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }
    console.log("flag", flag);
    if (flag == true) {
      let payload = { subject: userData.uname + userData.pwd };
      let token = jwt.sign(payload, "secretKey");
      res.status(200).send({ token });
    } else {
      res.status(401).send("Invalid UserName or Password");
    }
  });
});

app.put(`/api/update`, (req, res) => {
  console.log(req.body);
  (id = req.body._id),
    (title = req.body.title),
    (author = req.body.author),
    (image = req.body.image),
    (about = req.body.about),
    booksdata
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            title: title,
            author: author,
            image: image,
            about: about,
          },
        }
      )
      .then(function () {
        res.send();
      });
});

app.delete("/api/remove/:id", (req, res) => {
  id = req.params.id;
  booksdata.findByIdAndDelete({ _id: id }).then(() => {
    console.log("success");
    res.send();
  });
});

app.post("/api/signup", function (req, res) {
  console.log("signupdata", req.body);

  var userdata = {
    fname: req.body.fname,
    lname: req.body.lname,
    uname: req.body.uname,
    pwd: req.body.pwd,
  };
  var user = new usersdata(userdata);
  user.save();
});
const PORT = process.env.PORT || 3000;
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/frontend/index.html"));
});

app.listen(PORT, function () {
  console.log(`listening to port ${PORT}`);
});
