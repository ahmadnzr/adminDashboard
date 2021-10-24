const data = [
  {
    id: 1,
    name: "Ahmad Nizar",
    gender: "Male",
  },
  {
    id: 2,
    name: "Ayu",
    gender: "Female",
    address: "",
    about: "simple",
  },
];

const getDashboard = (req, res) => {
  res.render("app", {
    title: "Dashboard",
    url: "/dashboard",
  });
};

const getUsers = (req, res) => {
  res.render("app", {
    title: "Users",
    url: "/users",
    data: data,
  });
};

const getUserDetails = (req, res) => {
  const { id } = req.params;
  const user = getUserById(id);
  res.render("app", {
    title: "User Details",
    url: `/users/${id}`,
    id: id,
    user,
  });
};

const getUserById = (id) => {
  const user = data.find((item) => item.id === Number(id));
  return user;
};

module.exports = { getDashboard, getUsers, getUserDetails };
