const { validationResult, body, matchedData } = require("express-validator");
const { createPost, getAllPosts } = require("../db/queries");

const creatingValidator = [
    body("title").trim().notEmpty(),
    body("description").trim().notEmpty(),
];

module.exports = {
    getPostsPage: async (req, res) => {
        const posts = await getAllPosts();
        res.render("pages/postsPage", { posts });
    },
    createPost: [
        creatingValidator,
        async (req, res) => {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                const { title, description } = req.body;
                const posts = await getAllPosts();
                return res.render("pages/postsPage", {
                    title,
                    description,
                    posts,
                });
            }
            const { title, description } = matchedData(req);
            const authorId = req.user.id;
            await createPost({ title, description, authorId });

            return res.redirect("/posts");
        },
    ],
    deletePost: async (req, res) => {},
};
