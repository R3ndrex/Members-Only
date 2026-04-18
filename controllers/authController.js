const { validationResult, matchedData, body } = require("express-validator");
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../db/queries");
const passport = require("passport");

const registerValidator = [
    body("firstName", "Incorrect first name format")
        .trim()
        .notEmpty()
        .withMessage("First name can't be empty")
        .bail()
        .isLength({ min: 2, max: 25 })
        .withMessage("First name must be between 2 and 25 characters"),
    body("lastName", "Incorrect last name format")
        .trim()
        .notEmpty()
        .withMessage("Last name can't be empty")
        .bail()
        .isLength({ min: 2, max: 25 })
        .withMessage("Last name must be between 2 and 25 characters"),
    body("email", "Incorrect email format")
        .trim()
        .notEmpty()
        .withMessage("Email can't be empty")
        .bail()
        .custom(async (value, { req }) => {
            const emailIsUsed = await findUserByEmail(value);
            if (emailIsUsed) {
                throw new Error("Email is already in use");
            }
        })
        .isEmail(),
    body("password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 8,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1,
            minLowercase: 1,
        })
        .withMessage(
            "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.",
        ),
    body("confirmPassword")
        .trim()
        .custom((value, { req }) => {
            return req.body.password === value;
        })
        .withMessage("Passwords must be same"),
];

const loginValidator = [
    body("email", "Incorrect email format")
        .trim()
        .notEmpty()
        .withMessage("Email can't be empty")
        .bail()
        .isEmail(),
    body("password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 8,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1,
            minLowercase: 1,
        })
        .withMessage(
            "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.",
        ),
    body("confirmPassword")
        .trim()
        .custom((value, { req }) => req.body.password === value)
        .withMessage("Passwords must be same"),
];

module.exports = {
    getLoginPage: (_, res) => {
        return res.render("pages/loginPage");
    },
    getRegisterPage: (_, res) => {
        return res.render("pages/registerPage");
    },
    login: [
        loginValidator,
        async (req, res, next) => {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).render("pages/loginPage", {
                    errors: result.array(),
                });
            }
            next();
        },
        async (req, res, next) => {
            passport.authenticate("local", (error, user, info) => {
                if (error) {
                    return next(error);
                }
                if (!user) {
                    return res.status(400).render("pages/loginPage", {
                        errors: [{ msg: "Invalid credentials" }],
                    });
                }
                req.logIn(user, (error) => {
                    if (error) {
                        return next(error);
                    }
                    return res.redirect("/posts");
                });
            })(req, res, next);
        },
    ],
    register: [
        registerValidator,
        async (req, res) => {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).render("pages/registerPage", {
                    errors: result.array(),
                });
            }

            const { lastName, firstName, email, password } = matchedData(req);
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await createUser({
                lastName,
                firstName,
                email,
                password: hashedPassword,
            });
            req.logIn(user, (error) => {
                if (error) {
                    return next(error);
                }
                return res.redirect("/posts");
            });
        },
    ],
    logout: (req, res, next) => {
        req.logout((error) => {
            if (error) {
                return next(error);
            }
            res.redirect("/posts");
        });
    },
};
