const express =require("express");
const { route } = require("./listing");

const router = express.Router({mergeParams :true} );
const Review = require("../Models/review.js");
const AsyncWrap = require("../utils/wrapAsync.js");
const {Schema , reviewSchema} = require("../Views/schema.js");
const expressError = require("../utils/ExpressError.js");
const Listing = require("../Models/listing.js");
const { isLoggedIn, isReviewAuthor,validateReview } = require("../middleware.js");

                     //   controllers
const reviewController = require("../controllers/review.js");
   
   //Reviews
    // Post Route

    router.post("/listings/:id/reviews",isLoggedIn, validateReview,AsyncWrap(reviewController.createReview));
    
    // Delete Review Route 
    
    router.delete("/listings/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor, AsyncWrap(reviewController.deleteReview));
    
    
module.exports = router;
