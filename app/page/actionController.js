const { User, Biodatas, UserGames } = require("../../models");
const asyncWrapper = require("../../middleware/asyncWrapper");
const bcrypt = require("bcrypt");

const checkUser = async (id) => {
  const n = Number(id);
  if (isNaN(n)) return [];
  const user = await User.findAll({
    where: { id: n },
  });
  return user;
};

const checkCredentials = async (username = "", password = "") => {
  const user = await User.findOne({
    where: { username: username, role: "SuperAdmin" },
  });
  if (!user) return false;

  const checkPassword = await bcrypt.compareSync(
    password,
    user.encryptedPassword
  );
  console.log(checkPassword);
  return checkPassword ? user : false;
};

const userLogin = asyncWrapper(async (req, res) => {
  const { username, password } = req.body;
  const user = await checkCredentials(username, password);

  console.log(user);
  if (!user) return res.redirect("/user/login");

  req.session.user_id = user.id;
  return res.redirect("/dashboard");
});

const userLogout = asyncWrapper(async (req, res) => {
  req.session.destroy();
  res.redirect("/user/login");
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
