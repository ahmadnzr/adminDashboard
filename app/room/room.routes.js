const authrorize = require("../../middleware/authrorize");
const { create, getAll } = require("./room.controllers");

const router = require("express").Router();

router.post("/rooms/create", authrorize, create);
router.get("/rooms", getAll);

module.exports = router;
