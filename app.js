const path = require("path");

const express = require("express");
const session = require("express-session");
const csrf = require("csurf");

const sessionConfig = require("./config/session");
const db = require("./data/database");
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/account");
const authMiddleware = require("./middleware/auth-middleware");
const csrfMiddleware = require("./middleware/csrf-token-middleware");

const mongoDbSessionStore = sessionConfig.createSessionStore(session);
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(session(sessionConfig.createSessionConfig(mongoDbSessionStore)));
app.use(csrf());

app.use(csrfMiddleware);

app.use(authMiddleware);

app.use(blogRoutes);
app.use(authRoutes);

app.use(function (error, req, res, next) {
  console.log(error);
  res.render("500");
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
