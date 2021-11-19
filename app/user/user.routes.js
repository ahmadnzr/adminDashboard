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

module.exports = router;
