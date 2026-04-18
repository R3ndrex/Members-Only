const Router = require("express");
const postsController = require("../controllers/postsController");

const postsRoute = Router();

postsRoute.get("/", postsController.getPostsPage);

module.exports = postsRoute;
