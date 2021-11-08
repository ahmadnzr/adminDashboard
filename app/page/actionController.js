const { User, Biodatas, UserGames } = require("../../models");
const asyncWrapper = require("../middleware/asyncWrapper");

const checkUser = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return [];
  const user = await User.findAll({
    where: { id: n },
  });
  return user;
};

const userLogin = asyncWrapper(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findAll({
    where: { username, password },
    include: [{ model: Biodatas }],
  });
  const isAdmin = user[0]?.isAdmin;
  const sUname = "admin";
  const sPass = "admin";

  if (username === sUname && password === sPass) {
    req.session.name = username;
    return res.redirect("/dashboard");
  }

  if (user.length < 1 || !isAdmin) {
    return res.redirect("/user/login");
  }

  req.session.name = username;
  return res.redirect("/dashboard");
});

const userLogout = asyncWrapper(async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

const userAdd = asyncWrapper(async (req, res) => {
  const { username, password, fullname, email, gender, age, imgUrl } = req.body;
  const userAge = Number(age);
  const biodata = await Biodatas.create({
    fullname,
    email,
    age: userAge,
    gender,
    imgUrl,
  });
  await User.create({ username, password, biodataId: biodata.id });

  res.redirect("/users/view");
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await checkUser(id);

  await UserGames.destroy({ where: { userId: id } });
  await Biodatas.destroy({ where: { id: user[0].biodataId } });
  await User.destroy({ where: { id } });

  res.redirect("/users/view");
});

const editUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const {
    username,
    password,
    fullname,
    email,
    age,
    imgUrl,
    gender,
    biodataId,
  } = req.body;
  const userAge = Number(age);

  await User.update({ username, password }, { where: { id } });
  await Biodatas.update(
    { fullname, email, age: userAge, imgUrl, gender },
    { where: { id: biodataId } }
  );
  res.redirect("/users/view/" + id);
});

const deleteBiodata = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  await Biodatas.update(
    { fullname: "", email: "", age: 1, imgUrl: "", gender: "" },
    { where: { id } }
  );
  res.redirect("/users/view/" + id);
});

module.exports = {
  userLogin,
  userLogout,
  userAdd,
  deleteUser,
  editUser,
  deleteBiodata,
};
