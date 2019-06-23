const mongoose = require("mongoose");

const GradsSchema = new mongoose.Schema({
  quizTitle: {
    type: String,
    required: true
  },
  quizId: {
    type: String,
    required: true
  },
  result: {
    type: Number,
    required: true
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min:5,
    max: 50
  },
  email: {
    type: String,
    required: true,
    min: 5,
    max: 255
  },
  password: {
    type: String,
    required: true,
    min: 5,
    max: 1024
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  grads: [ GradsSchema ]
});

const User = mongoose.model("User", userSchema);


module.exports = {  
  User
};
