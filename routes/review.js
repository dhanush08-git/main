const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const Listing = require('../Models/listing.js');
const Review = require('../Models/Review.js');
const { validateReview,isLoggedIn,isReviewAuthor } = require('../middleware.js');
const reviewController=require('../controllers/reviews.js');



//Reviews

router.post("/",isLoggedIn
    ,validateReview,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",   isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview));

module.exports = router;