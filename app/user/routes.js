const {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  getUserById,
} = require("./controllers");

const router = require("express").Router();

router.get("/users", getUser);
router.get("/users/:id", getUserById);
router.post("/users", addUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
