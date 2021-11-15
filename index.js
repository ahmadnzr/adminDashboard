const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 8080;
const sessionAge = 1000 * 60 * 60 * 24;

const expressLayout = require("express-ejs-layouts");
const session = require("express-session");

const path = require("path");
const pageRoutes = require("./app/page/routes");
const userRoutes = require("./app/user/routes");
const gameRoutes = require("./app/game/routes");
const userGamesRoutes = require("./app/userGames/routes");
const biodataRoutes = require("./app/biodata/routes");

const notFound = require("./middleware/notFound");
const serverError = require("./middleware/serverError");

// setup
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
app.use("/api/v1", gameRoutes);
app.use("/api/v1", userGamesRoutes);
app.use("/api/v1", biodataRoutes);

// middleware
app.use(notFound);
app.use(serverError);

app.listen(PORT, () => {
  console.clear();
  console.log(`server is running on http://localhost:${PORT}`);
});
