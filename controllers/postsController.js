const { validationResult, body, matchedData } = require("express-validator");
const { createPost, getAllPosts } = require("../db/queries");

const creatingValidator = [
    body("title").trim().notEmpty(),
    body("description").trim().notEmpty(),
];

module.exports = {
    getPostsPage: async (req, res) => {
        const posts = await getAllPosts();
        console.log(posts);
        res.render("pages/postsPage", { posts });
    },
    createPost: [
        creatingValidator,
        async (req, res) => {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                res.redirect("/posts");
            }
            const { title, description } = matchedData(req);
            const authorId = req.user.id;
            console.log(authorId);
            await createPost({ title, description, authorId });

            res.redirect("/posts");
        },
    ],
    deletePost: async (req, res) => {},
};
