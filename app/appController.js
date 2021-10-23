const getDashboard = (req, res) => {
  res.render("app", {
    title: "Dashboard",
  });
};

module.exports = { getDashboard };
