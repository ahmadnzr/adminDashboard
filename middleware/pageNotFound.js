const { notFound } = require("../utils/responseBuilder");

exports.pageNotFound = (req, res) => {
  return res.status(404).json(notFound("Page not Found", ""));
};
