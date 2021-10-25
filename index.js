const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const appRouter = require("./app/appRouters");
const PORT = process.env.PORT || 3000;
const path = require("path");
const methodOverride = require("method-override");

// setup
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

//router
app.use(appRouter);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
