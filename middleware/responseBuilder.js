module.exports = {
  error(err) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  },

  notFound(msg, url) {
    return {
      name: "NOT_FOUND",
      message: msg,
      documentation_url: url,
    };
  },
};
