const Review = require('../models/review');
const Listing = require('../models/listing');

// Create a new review
module.exports.createReview = async (req, res) => {
  // Fetch the listing
  const listing = await Listing.findById(req.params.listingId);

  // Create a new review and set its properties
  const review = new Review({
    comment: req.body.review.comment,
    rating: req.body.review.rating,
    author: req.user._id  // Assuming user is authenticated and their ID is available in req.user
  });

  // Add the review to the listing
  listing.reviews.push(review);

  // Save the listing and the review
  await listing.save();
  await review.save();

  // Redirect back to the listing's page
  res.redirect(`/listings/${listing._id}`);
};

// Destroy a review (Delete a review)
module.exports.destroyReview = async (req, res) => {
  const { reviewid, listingId } = req.params;

  // Fetch the listing and the review
  const listing = await Listing.findById(listingId);
  const review = await Review.findById(reviewid);

  // Check if the logged-in user is the author of the review
  if (review.author.equals(req.user._id)) {
    // Remove the review from the listing's reviews array
    listing.reviews.pull(reviewid);

    // Save the updated listing
    await listing.save();

    // Remove the review itself
    await review.remove();

    // Redirect back to the listing's page
    res.redirect(`/listings/${listingId}`);
  } else {
    // If not the author, return a 403 Forbidden error
    res.status(403).send("You are not authorized to delete this review.");
  }
};
