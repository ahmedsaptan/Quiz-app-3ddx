const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
const session = require('express-session')
const flash =  require("connect-flash");
const passport = require("passport");

//load routes
const quizzes = require("./routes/quizzes");
const users = require("./routes/users");
const questions = require("./routes/questions");

//load models
const { Quiz } = require("./models/quiz");
require('dotenv').config()
 
const app = express();

require("./middleware/passport")(passport);

mongoose.connect(process.env.DB_LINK, { useNewUrlParser: true ,
   useFindAndModify: true})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("there is an error", err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: "main"
}));
app.set('view engine', 'handlebars');
 

// bodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//method overrride middleware help me to get put and delete request
app.use(methodOverride('_method'))

//session middelware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));


//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//flash middleware
app.use(flash());



//gloabl vars
app.use(function(req, res, next){
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});


//using routes
app.use("/quizzes", quizzes);
app.use("/users", users);
app.use("/questions/", questions);

app.get("/", (req, res) => {
  const title = "Welcome to Quiz App";
  res.render("index", {
    title
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});


app.get("/quizzes/add", (req, res) => {
  res.render("quiz/add");
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is Starting at port ${PORT}`)
});