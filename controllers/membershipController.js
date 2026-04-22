const { matchedData, body, validationResult } = require("express-validator");
const { giveMembership } = require("../db/queries");
const membershipValidator = [
    body("code", "Incorrect code")
        .trim()
        .notEmpty()
        .withMessage("Code can't be empty")
        .bail()
        .custom((value, { req }) => value === process.env.SECRET_CODE),
];

module.exports = {
    getMembershipFormPage: (req, res) => {
        res.render("pages/membershipForm");
    },
    getMembership: [
        membershipValidator,
        async (req, res) => {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                const { code } = req.body;
                return res.render("pages/membershipForm", {
                    code,
                    errors: result.array(),
                });
            }
            await giveMembership(req.user.id);
            return res.redirect("/posts");
        },
    ],
};
