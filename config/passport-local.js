const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/users");

// Authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (email, password, done) {
      // Find the user by email and stablish the identity
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log("Error while finding user");
          return done(err);
        }
        if (!user || user.password != password) {
          console.log("Invalid username or password");
          return done(null, false);
        }

        return done(null, user);
      });
    }
  )
);

// Serializing user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserializing the user from the key into the cookie
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error while finding user in deseralizing");
      return done(err);
    }
    return done(null, user);
  });
});

// Check Authentication
passport.checkAuthentication = function (req, res, next) {
  // if user is sign in then pass on the req to next(controller action)
  if (req.isAuthenticated()) {
    return next();
  }

  // if user is not sign in
  return res.redirect("/users/login");
};

// Set Authenticated User
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // user is authenticated then req.user is contains the curr login user from the session cookie
    // and we are just sending this to locals for views
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
