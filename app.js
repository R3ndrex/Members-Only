require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool");
const passport = require("passport");
const authRoute = require("./routes/authRoute");
const postsRoute = require("./routes/postsRoute");
const membershipRoute = require("./routes/membershipRoute");
const compression = require("compression");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
        },
        store: new pgSession({ pool, tableName: "session" }),
    }),
);
app.use(compression());
require("./passport/initialization");

app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use("/auth", authRoute);
app.use("/posts", postsRoute);
app.use("/membership", membershipRoute);

app.get("/", (req, res) => {
    res.redirect("/posts");
});
app.use((req, res) => {
    return res.status(404).send("404 page not found");
});

app.use((error, req, res, next) => {
    console.error(error.message || error);
    res.status(500).send("Internal Server error");
});

app.listen(process.env.PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`started at port ${process.env.PORT}`);
});
