const { User, Biodatas, UserGames } = require("../../models");
const asyncWrapper = require("../../middleware/asyncWrapper");
const UserView = require("./user.views");
const { notFound } = require("../../middleware/responseBuilder");

const checkUser = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return null;

  return await User.findOne({
    where: { id: n },
    include: { model: Biodatas, as: "biodata" },
  });
};

const getUser = asyncWrapper(async (req, res) => {
  const users = await User.findAll({
    include: { model: Biodatas, as: "biodata" },
  });

  const response = users.map((user) => {
    return new UserView(user);
  });

  return res.status(200).json(response);
});

const getUserById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await checkUser(id);

  if (!user) {
    return res
      .status(404)
      .json(notFound(`user id '${id}' undefined`, "/users"));
  }

  const response = new UserView(user);

  return res.status(200).json(response);
});

const addUser = asyncWrapper(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.create({
    username,
    encryptedPassword: password,
  });

  const biodata = await Biodatas.create({ userId: user.id });

  user.biodata = biodata;

  const response = new UserView(user);

  return res.status(201).json(response);
});

const updateUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const user = await checkUser(id);

  if (!user) {
    return res
      .status(404)
      .json(notFound(`user id '${id}' undefined`, "/users"));
  }

  const { username, password } = req.body;

  await user.update({
    username,
    encryptedPassword: password,
  });

  const response = new UserView(user);

  return res.status(200).json(response);
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await checkUser(id);

  if (!user) {
    return res
      .status(404)
      .json(notFound(`user id '${id}' undefined`, "/users"));
  }

  await user.destroy();

  return res.status(200).json({});
});

module.exports = {
  getUser,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
