const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const appRouter = require("./app/appRouters");
const PORT = process.env.PORT || 3000;

// setup

app.set("view engine", "ejs");
app.use(express.static("./public"));

//router
app.use(appRouter);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
