const asyncWrapper = require("../../middleware/asyncWrapper");
const { User } = require("../../models");
const { credentialError } = require("../../utils/responseBuilder");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthView = require("./auth.views");

const createToken = ({ id, username, role }) => {
  return jwt.sign({ id, username, role }, process.env.JWT_SIGNATURE_KEY, {
    expiresIn: "1h",
  });
};
const checkUser = async ({ username = "", password = "" }) => {
  const user = await User.findOne({ where: { username } });
  const checkPassword = await decryptPassword(password, user.encryptedPassword);

  return !checkPassword ? false : user;
};

const decryptPassword = async (password, encryptedPassword) => {
  return await bcrypt.compareSync(password, encryptedPassword);
};

const login = asyncWrapper(async (req, res) => {
  const user = await checkUser(req.body);

  if (!user)
    return res
      .status(400)
      .json(credentialError("username or password is wrong!"));

  const token = createToken(user);
  user.token = token;

  const response = new AuthView(user);
  return res.status(200).json(response);
});

module.exports = { login };
