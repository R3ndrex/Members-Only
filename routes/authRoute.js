const authController = require("../controllers/authController");
const Router = require("express");

const authRoute = Router();

authRoute
    .route("/login")
    .get(authController.getLoginPage)
    .post(authController.login);
authRoute
    .route("/register")
    .get(authController.getRegisterPage)
    .post(authController.register);
authRoute.get("/logout", authController.logout);

module.exports = authRoute;
