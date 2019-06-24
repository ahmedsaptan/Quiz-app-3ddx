const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Quiz } = require("../models/quiz");
const localStoarge = require("localStorage");


router.get("/:id",[ auth, admin ], (req, res) => {
  const id = req.params.id;
  res.render("questions/question", {
    id
  });
});


router.post("/", [ auth, admin ], async (req, res) => {
  const id = req.query.id

  const queryQuestion = {
    question: req.body.question,
    answers: [req.body.ans1, req.body.ans2, req.body.ans3, req.body.ans4],
    correct: req.body.correct,
    explanation: req.body.explanation
  };
  // console.log(queryQuestion);
  let questions = JSON.parse(localStoarge.getItem("ques"));
  if(!questions) questions = [];
  questions.push(queryQuestion);

  if(req.body.btn1 === "addmore"){    
    localStoarge.setItem("ques", JSON.stringify(questions));
    return res.render("questions/question", {
      id
    });
  }
  localStoarge.clear();
  try
  {
    // console.log(questions);
    const quiz = await Quiz.findByIdAndUpdate(id, {
    questions: questions
    });
    // console.log(quiz);
    req.flash("success_msg", `you add ${questions.length} Questions`);
    res.redirect("/quizzes/me");
  }
  catch(err){
    req.flash("error_msg", err);
    res.redirect("/");
  }
});

module.exports = router;