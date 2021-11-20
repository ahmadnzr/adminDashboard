const authrorize = require("../../middleware/authrorize");
const { fight, getRoomById, test } = require("./game.controllers");

const router = require("express").Router();

router.post("/game/fight", authrorize, fight);
router.get("/game/fight", authrorize, getRoomById);

module.exports = router;
