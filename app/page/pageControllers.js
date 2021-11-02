const { User, Biodatas, UserGames } = require("../../models");
const asyncWrapper = require("../middleware/asyncWrapper");

const getAllUser = async () => {
  const users = await User.findAll({
    include: [{ model: Biodatas }],
    where: { isAdmin: false },
    order: [["updatedAt", "DESC"]],
  });
  return users;
};

const getAllUserGame = async () => {
  const userGames = await UserGames.findAll();
  return userGames;
};

const getUserById = async (id) => {
  const user = await User.findAll({
    where: { id },
    include: [{ model: Biodatas }],
  });
  return user;
};

const getTotalGamePlayedByUser = async (id) => {
  const total = await UserGames.findAll({ where: { userId: id } });
  return total;
};

const getLoginPage = asyncWrapper(async (req, res) => {
  if (req.session.name) return res.redirect("/dashboard");
  res.render("pages/login", {
    title: "Dashboard",
    layout: "layouts/min-layout",
  });
});

const getDashboardPage = asyncWrapper(async (req, res) => {
  const user = await getAllUser();
  const userGames = await getAllUserGame();
  res.render("pages/dashboard", {
    title: "Dashboard",
    layout: "layouts/main-layout",
    tUsers: user.length,
    tGames: userGames.length,
  });
});

const getUsersPage = asyncWrapper(async (req, res) => {
  const users = await getAllUser();
  res.render("pages/user/users", {
    title: "Users",
    data: users,
    layout: "layouts/main-layout",
  });
});

const getAddUserPage = asyncWrapper((req, res) => {
  res.render("pages/user/add-user", {
    title: "User Create",
    layout: "layouts/main-layout",
  });
});

const getDetailUserPage = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  const total = await getTotalGamePlayedByUser(id);
  console.log(total);
  if (user.length < 1)
    return res.status(404).json(fail(`User with id '${id}' not found!`));

  res.render("pages/user/detail-user", {
    title: "Detail User",
    layout: "layouts/main-layout",
    id,
    total: total.length,
    data: user,
  });
});

const getEditUserPage = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);

  if (user.length < 1)
    return res.status(404).json(fail(`User with id '${id}' not found!`));

  res.render("pages/user/edit-user", {
    title: "User Edit",
    layout: "layouts/main-layout",
    id,
    data: user,
  });
});

module.exports = {
  getLoginPage,
  getDashboardPage,
  getUsersPage,
  getAddUserPage,
  getDetailUserPage,
  getEditUserPage,
};
