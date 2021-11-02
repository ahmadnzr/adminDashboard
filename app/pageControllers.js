const { data } = require("./data");

const getUserById = (id) => {
  const user = data.find((item) => item.id === Number(id));
  return user;
};

const loginPage = (req, res) => {
  res.render("login", {
    title: "Login Page",
  });
};

const getDashboardPage = (req, res) => {
  res.render("app", {
    title: "Dashboard",
    url: req.url,
  });
};

const getUsersPage = (req, res) => {
  res.render("app", {
    title: "Users",
    url: req.url,
    data: data,
  });
};

const getUserDetailsPage = (req, res) => {
  const { id } = req.params;
  const user = getUserById(id);
  res.render("app", {
    title: "User Details",
    url: req.url,
    id: id,
    user,
  });
};

const addNewUserPage = (req, res) => {
  res.render("app", {
    title: "Add User",
    url: req.url,
  });
};

const updateUserPage = (req, res) => {
  const id = req.url.split("/")[2];
  res.render("app", {
    title: "Update User",
    url: req.url,
    id,
  });
};

module.exports = {
  loginPage,
  getDashboardPage,
  getUsersPage,
  getUserDetailsPage,
  addNewUserPage,
  updateUserPage,
};
