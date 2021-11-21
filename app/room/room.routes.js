const authrorize = require("../../middleware/authrorize");
const { create, getAll, join } = require("./room.controllers");

const router = require("express").Router();

router.post("/rooms/create", authrorize, create);
router.post("/rooms/join", authrorize, join);
router.get("/rooms", authrorize, getAll);

module.exports = router;
