const {
  getRoles,
  addRole,
  updateRole,
  deleteRole,
} = require("./role.controllers");

const router = require("express").Router();

router.get("/roles", getRoles);
router.post("/roles", addRole);
router.put("/roles/:id", updateRole);
router.delete("/roles/:id", deleteRole);

module.exports = router;
