const { UserGames, User, Game, Biodatas } = require("../../models");
const {
  DRAW,
  ENEMY_WIN,
  USER_WIN,
  KERTAS,
  BATU,
  GUNTING,
} = require("./constants");

const { success, fail, response } = require("../../middleware/responseBuilder");
const asyncWrapper = require("../../middleware/asyncWrapper");

const checkUser = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return [];
  const user = await User.findAll({
    where: { id: n },
  });
  return user;
};

const checkGame = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return [];
  const game = await Game.findAll({
    where: { id: n },
  });
  return game;
};

const getEnemyChoice = () => {
  const n = Math.random();
  if (n < 0.3) return KERTAS;
  if (n < 0.6) return BATU;
  return GUNTING;
};

const getTheWinner = (uChoice, eChoice) => {
  if (uChoice === eChoice) return DRAW;
  if (uChoice === BATU) return eChoice === KERTAS ? ENEMY_WIN : USER_WIN;
  if (uChoice === KERTAS) return eChoice === GUNTING ? ENEMY_WIN : USER_WIN;
  if (uChoice === GUNTING) return eChoice === BATU ? ENEMY_WIN : USER_WIN;
};

const getTheGames = asyncWrapper(async (req, res) => {
  const games = await UserGames.findAll();

  return res.status(200).json(success(games));
});

const getTheGamesByUserId = asyncWrapper(async (req, res) => {
  const { userId } = req.params;

  const user = await checkUser(userId);
  if (user.length < 1)
    return res.status(404).json(fail(`User with id '${userId}' not found!`));

  const games = await UserGames.findAll({ where: { userId } });

  return res.status(200).json(success(games));
});

const getTheGamesByGameId = asyncWrapper(async (req, res) => {
  const { gameId } = req.params;

  const game = await checkGame(gameId);
  if (game.length < 1)
    return res.status(404).json(fail(`Game with id '${gameId}' not found!`));

  const games = await UserGames.findAll({ where: { gameId } });

  return res.status(200).json(success(games));
});

const deleteHistoryByGameId = asyncWrapper(async (req, res) => {
  const { gameId } = req.params;

  const game = await checkGame(gameId);
  if (game.length < 1)
    return res.status(404).json(fail(`Game with id '${gameId}' not found!`));

  await UserGames.destroy({ where: { gameId } });

  return res
    .status(200)
    .json(response(`History game with game id '${gameId}' is deleted!`));
});

const deleteHistoryByUserId = asyncWrapper(async (req, res) => {
  const { userId } = req.params;

  const user = await checkUser(userId);
  if (user.length < 1)
    return res.status(404).json(fail(`User with id '${userId}' not found!`));

  await UserGames.destroy({ where: { userId } });

  return res
    .status(200)
    .json(response(`History game with user id '${userId}' is deleted!`));
});

const playTheGames = asyncWrapper(async (req, res) => {
  const { gameId } = req.params;
  const { userId, userChoice } = req.body;
  const uChoice = userChoice.toUpperCase();

  const game = await checkGame(gameId);
  if (game.length < 1)
    return res.status(404).json(fail(`Game with id '${gameId}' not found!`));

  const user = await checkUser(userId);
  if (user.length < 1)
    return res.status(404).json(fail(`User with id '${userId}' not found!`));

  if (uChoice !== KERTAS && uChoice !== BATU && uChoice !== GUNTING)
    return res.status(404).json(fail(`User choice ${uChoice} not found!`));

  const enemyChoice = await getEnemyChoice();
  const theWinner = await getTheWinner(uChoice, enemyChoice);

  const cPlayGame = await UserGames.create({
    userId,
    gameId,
    userChoice: uChoice,
    enemyChoice,
    winner: theWinner,
  });

  return res.status(200).json(success(cPlayGame));
});

module.exports = {
  getTheGames,
  playTheGames,
  getTheGamesByGameId,
  getTheGamesByUserId,
  deleteHistoryByUserId,
  deleteHistoryByGameId,
};
