const jwt = require("jsonwebtoken");
const { unauthorized } = require("../utils/responseBuilder");
const asyncWrapper = require("./asyncWrapper");
const KEY = process.env.JWT_SIGNATURE_KEY;

module.exports = asyncWrapper((req, res, next) => {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(401).json(unauthorized("token is undefined!"));
  }

  const token = header.split(" ")[1];

  jwt.verify(token, KEY, (err, user) => {
    if (err) return res.status(401).json(unauthorized(err.message));

    req.user = user;
    next();
  });
});
