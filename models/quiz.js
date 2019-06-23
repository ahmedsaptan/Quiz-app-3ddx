const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answers: {
    type: [ String ],
    required: true
  },
  correct: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  questions: [ questionSchema ],
  byId: {
    type: String,
    required: true
  },
  byName:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  publish: {
    type: Boolean,
    default: false
  }
});


const Quiz = mongoose.model("Quizes", quizSchema);
module.exports = {
  Quiz
}



