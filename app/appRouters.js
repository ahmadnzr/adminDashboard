const { getDashboard, getUsers, getUserDetails } = require("./appController");

const router = require("express").Router();

const hai = (req, res, next) => {
  console.log("hai");
  next();
};
router.get("/", (req, res) => res.redirect("/dashboard"));
router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.get("/users/:id", getUserDetails);

module.exports = router;
