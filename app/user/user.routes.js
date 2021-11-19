const { login } = require("./auth.controllers");
const {
  getUser,
  create,
  update,
  deleteUser,
  getUserById,
} = require("./user.controllers");

const router = require("express").Router();

router.get("/users", getUser);
router.get("/users/:id", getUserById);
router.post("/users", create);
router.put("/users/:id", update);
router.delete("/users/:id", deleteUser);

router.post("/users/login", login);
router.post("/users/register", create);

module.exports = router;
