const { error } = require("../utils/responseBuilder");

exports.serverError = (err, req, res, next) => {
  return res.status(500).json(error(err));
};
