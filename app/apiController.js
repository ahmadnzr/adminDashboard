const addNewUser = (req, res) => {
  const { username, password, fullname, address, img, gender } = req.body;
  res.json({
    username,
    password,
    fullname,
    address,
    img,
    gender,
  });
};

const updateUser = (req, res) => {
  res.json({
    ...req.body,
  });
};

const loginAdmin = (req, res) =>{
  res.json({
    ...req.body
  })
}
module.exports = {
  loginAdmin,
  addNewUser,
  updateUser,
};
