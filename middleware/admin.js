module.exports = function(req, res, next) {
  if(req.user.isAdmin){
    return next();
  }
  req.flash("error_msg", "Access denied");
  res.redirect("/");
}