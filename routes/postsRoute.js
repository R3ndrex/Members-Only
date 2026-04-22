const Router = require("express");
const postsController = require("../controllers/postsController");

const postsRoute = Router();

postsRoute.get("/", postsController.getPostsPage);
postsRoute.post("/create", postsController.createPost);
postsRoute.get("/delete/:postId", postsController.deletePost);
module.exports = postsRoute;
