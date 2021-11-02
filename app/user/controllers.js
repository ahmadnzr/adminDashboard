const { User, Biodatas, UserGames } = require("../../models");
const asyncWrapper = require("../middleware/asyncWrapper");
const { success, fail, response } = require("../middleware/responseBuilder");

const checkUser = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return [];
  const user = await User.findAll({
    where: { id: n },
    include: { model: Biodatas },
    attributes: { exclude: ["biodataId"] },
  });
  return user;
};

const getUser = asyncWrapper(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["biodataId"] },
    include: [{ model: Biodatas }],
    order: [["updatedAt", "DESC"]],
  });
  return res.status(200).json(success(users));
});

const getUserById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await checkUser(id);
  if (user.length < 1) {
    return res.status(404).json(fail(`User with id '${id}' is not found!`));
  }
  return res.status(200).json(success(user));
});

const addUser = asyncWrapper(async (req, res) => {
  const { username, password, isAdmin } = req.body;
  const biodata = await Biodatas.create();
  const user = await User.create({
    username,
    password,
    isAdmin,
    biodataId: biodata.id,
  });
  return res.status(201).json(success(user));
});

const updateUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const cUser = await checkUser(id);
  if (cUser.length < 1) {
    return res.status(404).json(fail(`User with id '${id}' is not found!`));
  }

  const { username, password, isAdmin } = req.body;
  await User.update(
    {
      username,
      password,
      isAdmin,
    },
    { where: { id } }
  );

  const user = await User.findAll({ where: { id } });
  return res.status(201).json(success(user));
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const cUser = await checkUser(id);
  if (cUser.length < 1) {
    return res.status(404).json(fail(`User with id '${id}' is not found!`));
  }
  const user = await checkUser(id);
  await UserGames.destroy({ where: { userId: user[0].id } });
  await User.destroy({ where: { id } });
  await Biodatas.destroy({ where: { id: user[0].biodataId } });

  return res.status(200).json(response(`User with id '${id}' is deleted!`));
});

module.exports = {
  getUser,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
