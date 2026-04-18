const passport = require("passport");
const { getUserById, findUserByEmail } = require("../db/queries");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await findUserByEmail(email);
                if (!user) {
                    return done(null, false, { message: "Incorrect email" });
                }
                const isEqual = await bcrypt.compare(password, user.password);
                if (!isEqual) {
                    return done(null, false, { message: "Incorrect password" });
                }
                return done(null, user);
            } catch (e) {
                return done(e);
            }
        },
    ),
);

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await getUserById(userId);
        return done(null, user);
    } catch (e) {
        return done(e);
    }
});

module.exports = passport;
