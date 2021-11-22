const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require('morgan')
dotenv.config();

const PORT = process.env.PORT || 8080;
const sessionAge = 1000 * 60 * 60 * 24;

const expressLayout = require("express-ejs-layouts");
const session = require("express-session");

const path = require("path");
const pageRoutes = require("./app/page/routes");
const userRoutes = require("./app/user/user.routes");
const biodataRoutes = require("./app/biodata/biodata.routes");
const roomRoutes = require("./app/room/room.routes");
const gameFightRoutes = require("./app/game/game.routes");

const { pageNotFound } = require("./middleware/pageNotFound");
const { serverError } = require("./middleware/serverError");
const models = require("./models");

// setup
app.use(morgan('dev'))
app.use(expressLayout);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "ch-6-challenge",
    cookie: { maxAge: sessionAge },
    resave: true,
    saveUninitialized: true,
  })
);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

//router
app.use(pageRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", biodataRoutes);
app.use("/api/v1", roomRoutes);
app.use("/api/v1", gameFightRoutes);

// middleware
app.use(pageNotFound);
app.use(serverError);

models.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.clear();
      console.log(`server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
