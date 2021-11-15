const checkLoginUser = require("../../middleware/checkLoginUser");
const {
  userLogin,
  userLogout,
  userAdd,
  deleteUser,
  editUser,
  deleteBiodata,
} = require("./actionController");
const {
  getDashboardPage,
  getUsersPage,
  getAddUserPage,
  getDetailUserPage,
  getEditUserPage,
  getLoginPage,
} = require("./pageControllers");

const router = require("express").Router();

router.get("/", (req, res) => res.redirect("/dashboard"));
router.get("/user/login", getLoginPage);
router.get("/dashboard", checkLoginUser, getDashboardPage);
router.get("/users/view", checkLoginUser, getUsersPage);
router.get("/users/view/:id", checkLoginUser, getDetailUserPage);
router.get("/users/create", checkLoginUser, getAddUserPage);
router.get("/users/edit/:id", checkLoginUser, getEditUserPage);

router.post("/login", userLogin);
router.get("/logout", userLogout);
router.post("/users/create", userAdd);
router.post("/users/edit/:id", editUser);
router.get("/users/delete/:id", deleteUser);
router.get("/users/delete/:id/biodata", deleteBiodata);

module.exports = router;
