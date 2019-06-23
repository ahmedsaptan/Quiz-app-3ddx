const router = require("express").Router();
const mongoose = require("mongoose");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const localStorage = require("localStorage");


router.get("/login", (req, res) => {
  res.render("users/login")
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/quizzes",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", auth, (req, res) => {
  localStorage.clear();
  req.logout();
  req.flash("success_msg", "you logout");
  res.redirect("/");
})


router.get("/register", (req, res) => {
  res.render("users/register")
});


//route for registeration
router.post("/", async (req, res) => {
  console.log
  let errors = []
  if(req.body.password !== req.body.password2){
    errors.push({
      text: "Password Mush Match"
    });
  }

  if(req.body.password.length < 5){
    errors.push({
      text: "Password Mush be 5 digit or more"
    });
  }

  if(errors.length > 0){
    res.render("users/register", {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    let fatchUser = await User.findOne({email: req.body.email});
    if(fatchUser){
      req.flash("error_msg", "User Already Registered You Can Login..");
      res.redirect("/users/login");
    } else {
      let user = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        isAdmin: req.body.isAdmin
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      req.flash("success_msg", "Now You Can Login...");
      res.redirect("/users/login");
    }
  }
});


router.get("/grads", auth, (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      console.log("user from grads", user);
      res.render("users/grads", { grads: user.grads})
    })
});

module.exports = router;
