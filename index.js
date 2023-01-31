const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const port = 8000;
const app = express();

const expressLayouts = require("express-ejs-layouts");

const ERS = require("./config/mongoose");

// passport setup session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local");

const MongoStore = require("connect-mongo");

// for static files
app.use(express.static("./assets"));

app.use(expressLayouts);

// to render css file link in header
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// middleware for use session cookie
app.use(
  session({
    name: "ERS",
    secret: "nothing",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: "mongodb://127.0.0.1:27017/ERS",
        // mongoUrl: `mongodb+srv:Joyous:Manual@cluster1.mcl2r.mongodb.net/?retryWrites=true&w=majority`,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// Body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie parser
app.use(cookieParser());

app.use("/", require("./routes/index"));

app.listen(port, function (err) {
  if (err) {
    console.log("Error while connecting to server");
    return;
  }
  console.log(`Server running on port ${port}.`);
});
