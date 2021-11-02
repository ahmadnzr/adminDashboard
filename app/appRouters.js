const { addNewUser, updateUser, loginAdmin } = require("./apiController");
const {
  getDashboardPage,
  getUsersPage,
  getUserDetailsPage,
  addNewUserPage,
  updateUserPage,
  loginPage,
} = require("./pageControllers");

const router = require("express").Router();

// pages
router.get("/sign-in", loginPage);
router.get("/", (req, res) => res.redirect("/dashboard"));
router.get("/dashboard", getDashboardPage);
router.get("/user-lists", getUsersPage);
router.get("/user-lists/:id", getUserDetailsPage);
router.get("/user-add", addNewUserPage);
router.get("/user-update/:id", updateUserPage);

// api
router.post("/login", loginAdmin);
router.post("/users/", addNewUser);
router.put("/users/", updateUser);

module.exports = router;
