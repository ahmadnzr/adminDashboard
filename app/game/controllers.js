const { Game, UserGames } = require("../../models");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { success, fail, response } = require("../../middleware/responseBuilder");

const checkGame = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return [];
  const game = await Game.findAll({ where: { id: n } });
  return game;
};

const getGame = asyncWrapper(async (req, res) => {
  const games = await Game.findAll();
  return res.status(200).json(success(games));
});

const getGameById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const game = await checkGame(id);
  return res.status(200).json(success(game));
});

const addGame = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json(fail("field name is required!"));

  const game = await Game.create({ name });
  return res.status(201).json(success(game));
});

const deleteGame = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const game = await checkGame(id);
  if (game.length < 1)
    return res.status(404).json(fail(`Game with id '${id}' is not found!`));

  await UserGames.destroy({ where: { gameId: id } });
  await Game.destroy({ where: { id } });

  return res.status(200).json(response(`Game with id '${id}' is deleted!`));
});

const editGame = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const cGame = await checkGame(id);

  if (cGame.length < 1)
    return res.status(404).json(fail(`Game with id '${id}' is not found!`));

  if (!name) return res.status(400).json(fail("field name is required!"));

  await Game.update({ name }, { where: { id } });
  const game = await Game.findAll({ where: { id } });
  return res.status(200).json(success(game));
});

module.exports = {
  getGame,
  getGameById,
  addGame,
  deleteGame,
  editGame,
};
