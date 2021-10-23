const { getDashboard } = require("./appController");

const router = require("express").Router();

router.get("/", getDashboard);

module.exports = router;
