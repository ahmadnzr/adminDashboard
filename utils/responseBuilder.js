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

  fieldRequired(msg) {
    return {
      name: "REQUIRED_FIELD",
      message: msg,
    };
  },

  credentialError(msg) {
    return {
      name: "CREDENTIAL_ERROR",
      message: msg,
    };
  },

  unauthorized(msg) {
    return {
      name: "UNAUTHORIZED",
      message: msg,
    };
  },
};
