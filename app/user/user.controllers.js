const { User, Biodatas } = require("../../models");
const asyncWrapper = require("../../middleware/asyncWrapper");
const UserView = require("./user.views");
const { notFound, fieldRequired } = require("../../utils/responseBuilder");
const bcrypt = require("bcrypt");

const checkUser = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return null;

  return await User.findOne({
    where: { id: n },
    include: [{ model: Biodatas, as: "biodata" }],
  });
};

const checkRole = async ({ role = "PlayerUser" }) => {
  return ["SuperAdmin", "PlayerUser"].includes(role);
};

const createUser = async ({ username, password, role = "PlayerUser" }) => {
  const encryptedPassword = bcrypt.hashSync(password, 10);
  return await User.create({ username, encryptedPassword, role });
};

const updateUser = async (user, body) => {
  const { username, role, fullname, email, age, gender, imgUrl } = body;
  await user.update({ username, role });

  await Biodatas.update(
    { fullname, email, age, gender, imgUrl },
    { where: { userId: user.id } }
  );
};

const addUserBiodata = async (userId, body) => {
  const { fullname, email, age, gender, imgUrl } = body;
  return await Biodatas.create({
    fullname,
    email,
    age,
    gender,
    imgUrl,
    userId,
  });
};

const getUser = asyncWrapper(async (req, res) => {
  const users = await User.findAll({
    include: [{ model: Biodatas, as: "biodata" }],
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

const create = asyncWrapper(async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res
      .status(400)
      .json(fieldRequired("username and pasword are required!"));

  const cRole = await checkRole(req.body);
  if (!cRole) {
    return res
      .status(400)
      .json(
        notFound(`Role ${req.body.role} is undefined`, [
          "SuperAdmin",
          "PlayerUser",
        ])
      );
  }

  const user = await createUser(req.body);
  await addUserBiodata(user.id, req.body);

  const response = new UserView(await checkUser(user.id));

  return res.status(201).json(response);
});

const update = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!req.body.username || !req.body.password)
    return res.status(400).json(fieldRequired("name is required"));

  const cRole = await checkRole(req.body);
  if (!cRole) {
    return res
      .status(400)
      .json(
        notFound(`Role ${req.body.role} is undefined`, [
          "SuperAdmin",
          "PlayerUser",
        ])
      );
  }

  const user = await checkUser(id);
  if (!user) {
    return res
      .status(404)
      .json(notFound(`user id '${id}' undefined`, "/users"));
  }

  await updateUser(user, req.body);

  const response = new UserView(await checkUser(id));

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

  await Biodatas.destroy({ where: { userId: user.id } });
  await user.destroy();

  return res.status(200).json({});
});

module.exports = {
  getUser,
  getUserById,
  create,
  update,
  deleteUser,
};
