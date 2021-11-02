const {
  getGame,
  addGame,
  editGame,
  deleteGame,
  getGameById,
} = require("./controllers");

const router = require("express").Router();

router.get("/games", getGame);
router.get("/games/:id", getGameById);
router.post("/games", addGame);
router.put("/games/:id", editGame);
router.delete("/games/:id", deleteGame);

module.exports = router;
