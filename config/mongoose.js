const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// Connect to local MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ERS");

// Connect to MongoDb Atlas
// mongoose.connect('mongodb+srv://Joyous:Manual@cluster1.mcl2r.mongodb.net/?retryWrites=true&w=majority');

// Aquire connection
const db = mongoose.connection;

db.on("error", console.error.bind(console, "error connecting to db"));

db.once("open", function () {
  console.log("Successfully connected to database");
});

module.exports = db;
