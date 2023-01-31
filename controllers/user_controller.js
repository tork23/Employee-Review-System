const User = require("../models/users");
const Review = require("../models/review");

// Creating a new user employee(Not Admin)
module.exports.createUser = async function (req, res) {
  try {
    // password do not match
    if (req.body.password != req.body.password2) {
      console.log("password did not match");
      return res.redirect("/users/register");
    }

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      console.log("user already exist");
      return res.redirect("/users/login");
    } else {
      await User.create({
        name: req.body.name,
        last_name: req.body.last_name,
        email: req.body.email,
        isAdmin: false,
        password: req.body.password,
      });
      console.log("User created successfully");
      if (req.user.isAdmin) {
        return res.redirect("/");
      }
      return res.redirect("/users/login");
    }
  } catch (error) {
    console.log("error while creating a user", error);
    return res.redirect("/users/register");
  }
};

// Creating session
module.exports.createSession = function (req, res) {
  return res.redirect("/");
};

// Destroying session
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/users/login");
  });
};

// Render login page
module.exports.login = function (req, res) {
  if (req.isAuthenticated()) {
    return res.render("home", {
      title: "ERS | Home",
    });
  }
  return res.render("login", {
    title: "ERS | Login",
  });
};

// Render SignUp page
module.exports.register = function (req, res) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return res.render("register", {
      title: "ERS | Register",
    });
  }

  if (req.isAuthenticated()) {
    return res.render("home", {
      title: "ERS | Home",
    });
  }

  return res.render("register", {
    title: "ERS | Register",
  });
};

// Homepage just after login
module.exports.home = async function (req, res) {
  try {
    // if user is not looged in
    if (!req.isAuthenticated()) {
      console.log("not logged in");
      return res.redirect("/users/login");
    }

    let user = await User.findById(req.user.id);
    let review = await Review.find({ to: req.user.id });

    let recipients = [];

    for (let i = 0; i < user.to.length; i++) {
      let x = await User.findById(user.to[i]);
      recipients.push(x);
    }

    // Collect reviews
    let reviews = [];

    for (let i = 0; i < review.length; i++) {
      let x = await User.findById(review[i].from);

      let curr_review = {
        name: x.name,
        last_name: x.last_name,
        review: review[i].review,
        updated: review[i].updatedAt,
      };
      reviews.push(curr_review);
    }

    return res.render("home", {
      title: "ERS | Home",
      recipients: recipients,
      reviews: reviews,
      user: user,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
