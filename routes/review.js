const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// POST review route (Create a new review)
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

// DELETE review route (Delete a review)
router.delete("/:reviewid", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
