module.exports = function(req, res, next) {
  if(!req.user.isAdmin){
    return next();
  }
  req.flash("error_msg", "You Can't Do This");
  res.redirect("/quizzes/me");
}