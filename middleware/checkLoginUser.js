module.exports = (req, res, next) => {
  if (!req.session.name) return res.redirect("/user/login");
  next();
};
