const router = require("express").Router();
const { Quiz } = require("../models/quiz");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


// update quiz info by teacher
router.get("/edit/:id", [auth, admin ], (req, res) => {
  Quiz.findById(req.params.id)
    .then(quiz => {
      res.render("quiz/edit", {
        quiz
      });
    })

});

router.get("/add", [ auth, admin ], (req, res) => {
  res.render("quiz/add");
});

router.get("/me", [ auth, admin ],  (req, res) => {
  Quiz.find({byId: req.user.id}).sort({date: "desc"})
    .then(quizzes => {
      res.render("quiz/privatehome", {quizzes});
    })
  
});

router.get("/", auth, (req, res) => {
  Quiz.find({publish : true}).sort({date: "desc"})
    .then((quizzes) => {
      res.render("quiz/index", {
        quizzes
      });
    })
    .catch(err => console.log(err));
});

router.get("/edit/:id", [ auth, admin ], (req, res) => {
  Quiz.findById(req.params.id)
    .then(quiz => {
      res.render("quiz/edit", {
        quiz
      });
    })
}); 

router.get("/:id", auth, (req, res) => {
  Quiz.findById(req.params.id)
    .then(quiz => {
      res.render("quiz/onequiz", {quiz});
    });  
});

router.post("/", [ auth, admin ], (req, res) => {
  let errors = [];
  if(!req.body.title) {
    errors.push({text: "Please add A title"});
  }

  if(!req.body.details) {
    errors.push({text: "Please add A details"});
  }

  if(errors.length > 0){
    res.render("quiz/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }
  else {
    
    const quiz = new Quiz ({
      title: req.body.title,
      details: req.body.details,
      byId: req.user.id,
      byName: req.user.name
    });

    quiz.save()
      .then(quiz => {
        req.flash("success_msg", "A new Quiz is created");
        res.redirect("/quizzes/me");
      })
      .catch((err) => console.log(err));
  }

});


//when a student submit sol of an quiz
router.post("/submit", auth, async (req, res) => {
  const studentAnswers = req.body.ans;
  const quizId = req.query.id;
  const quiz = await Quiz.findById(quizId);
  let result = 0;
  for(let i = 0; i < quiz.questions.length; i++){
    let correctAns = quiz.questions[i].correct;
    if(correctAns === studentAnswers[i]){
      result++;
    }
  }
  result = result / quiz.questions.length;
  const grads = req.user.grads || [];
  grads.push({
    quizTitle: quiz.title,
    quizId,
    result
  });
  
  await User.findByIdAndUpdate(req.user.id, { grads });
  res.redirect(`/users/grads`); 
});

//teacher update quiz info
router.put("/:id", [ auth, admin ], (req, res) => {
  Quiz.findById(req.params.id)
    .then(quiz => {
      quiz.title = req.body.title;
      quiz.details = req.body.details;

      quiz.save()
        .then(user => {
          req.flash("success_msg", "Quiz Updated");
          res.redirect("/quizzes/me");
        })
    })
});


//to make it publish
router.put("/publish/:id", [ auth, admin ], (req, res) => {
  
  Quiz.findById(req.params.id)
    .then(quiz => {
      if(quiz.publish){
        req.flash("error_msg", "this Quiz is Already Published");
        res.redirect("/quizzes/me");
      } else {
        quiz.publish = true;
        quiz.save()
          .then(quiz => {
            req.flash("success_msg", "Quiz Published")
            res.redirect("/quizzes");
          })
      }
    })  
});


router.put("/unpublish/:id", [ auth, admin ], (req, res) => {
  
  Quiz.findById(req.params.id)
    .then(quiz => {
      if(!quiz.publish){
        req.flash("error_msg", "this Quiz is Already unPublished");
        res.redirect("/quizzes/me");
      } else {
        quiz.publish = false;
        quiz.save()
          .then(quiz => {
            req.flash("success_msg", "Quiz unPublished")
            res.redirect("/quizzes/me");
          })
      }
    })  
});


router.delete("/:id", [ auth, admin ],(req, res) => {
  Quiz.findByIdAndDelete(req.params.id)
    .then(quiz => {
      req.flash("success_msg", "Quiz Removed");
      res.redirect("/quizzes/me");
    })
});

module.exports = router;