const notFound = (req, res) => {
  return res.status(404).json({
    status: "FAIL",
    error: {
      title: "Not Found",
      url: req.url,
      method: req.method,
    },
  });
};

module.exports = notFound;
