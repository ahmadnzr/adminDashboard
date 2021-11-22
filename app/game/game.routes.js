const authrorize = require("../../middleware/authrorize");
const {
  fight,
  getRoomById,
  gameRound,
  gameUserHistory,
} = require("./game.controllers");

const router = require("express").Router();

router.post("/game/fight", authrorize, fight);
router.get("/game/result/:roomId", authrorize, getRoomById);
router.get("/game/result/:roomId/round-one", authrorize, gameRound);
router.get("/game/result/:roomId/round-two", authrorize, gameRound);
router.get("/game/result/:roomId/round-three", authrorize, gameRound);
router.get("/game/history", authrorize, gameUserHistory);

module.exports = router;
