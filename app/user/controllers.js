const { User, Biodatas, UserGames } = require("../../models");
const asyncWrapper = require("../../middleware/asyncWrapper");
const { success, fail, response } = require("../../middleware/responseBuilder");

const checkUser = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return null;

  return await User.findByPk(n);
};

const getUser = asyncWrapper(async (req, res) => {
  const users = await User.findAll({ include: { model: Biodatas } });
  return res.status(200).json(success(users));
});

const getUserById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await checkUser(id);
  if (!user) {
    return res.status(404).json(fail(`User with id '${id}' is not found!`));
  }

  return res.status(200).json(success(user));
});

const addUser = asyncWrapper(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.create({
    username,
    encryptedPassword: password,
  });

  await Biodatas.create({ userId: user.id });

  return res.status(201).json(success(user));
});

const updateUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const user = await checkUser(id);
  if (!user) {
    return res.status(404).json(fail(`User with id '${id}' is not found!`));
  }

  const { username, password } = req.body;
  await user.update({
    username,
    encryptedPassword: password,
  });

  return res.status(201).json(success(user));
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await checkUser(id);
  if (!user) {
    return res.status(404).json(fail(`User with id '${id}' is not found!`));
  }

  await user.destroy({ where: { id } });

  return res.status(200).json(response(`User with id '${id}' is deleted!`));
});

module.exports = {
  getUser,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
