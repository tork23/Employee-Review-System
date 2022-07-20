const express = require("express");
const passport = require("passport");
const router = express.Router();

const reviewController = require('../controllers/review_controller');

// For creating new review
router.get('/newReview/:id', reviewController.createReview);

module.exports = router;