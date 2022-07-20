const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/ERS');

// Aquire connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to db'));


db.once('open', function(){
    console.log("Successfully connected to database");
});

module.exports = db;