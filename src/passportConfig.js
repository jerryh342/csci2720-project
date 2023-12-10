const Login = require("./models/login");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
        Login.findOne({ username: username })
  .then(user => {
    if (!user) return done(null, false);
    return bcrypt.compare(password, user.password)
      .then(result => {
        if (result) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
  })
  .catch(err => {
    throw err;
  });
    }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    console.log("deserialize")
    Login.findOne({ _id: id })
      .then(user => {
        const userInformation = {
          username: user.username,
        };
        cb(null, userInformation);
      })
      .catch(err => {
        cb(err);
      });
  });
};