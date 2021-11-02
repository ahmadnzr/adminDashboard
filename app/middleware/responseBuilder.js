const success = (data = []) => ({
  status: "OK",
  total: data.length,
  data,
});

const response = (msg) => ({
  status: "OK",
  message: msg,
});

const fail = (msg) => ({
  status: "FAIL",
  message: msg,
});

const error = (err) => ({
  status: "ERROR",
  data: {
    name: err.name,
    message: err.message,
    stack: err.stack,
  },
});

module.exports = {
  success,
  fail,
  error,
  response,
};
