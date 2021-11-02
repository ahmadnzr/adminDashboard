const {
  getTheGames,
  playTheGames,
  getTheGamesByUserId,
  getTheGamesByGameId,
  deleteHistoryByGameId,
  deleteHistoryByUserId,
} = require("./controllers");

const router = require("express").Router();

router.get("/user/games", getTheGames);
router.get("/user/games/:userId/u", getTheGamesByUserId);
router.get("/user/games/:gameId/g", getTheGamesByGameId);
router.delete("/user/games/:gameId/g", deleteHistoryByGameId);
router.delete("/user/games/:userId/u", deleteHistoryByUserId);
router.post("/user/games/:gameId/play", playTheGames);

module.exports = router;
