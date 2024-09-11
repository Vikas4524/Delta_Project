const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");

module.exports.createReview = async (req,res)=>{
      
    let listing = await Listing.findById(req.params.id);
       let newReview = new Review(req.body.review);
       newReview.author = req.user._id;
    //    console.log(newReview);
       listing.reviews.push(newReview);

       await newReview.save();
      let result = await listing.save();
req.flash("success", "success Add Review!");
      res.redirect(`/listings/${req.params.id}`);

};


module.exports.deleteReview =  async(req,res)=>{
    // console.log(req.params.id);
      let {id , reviewId} = req.params;
      // console.log(req.params);
      await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
       await Review.findByIdAndDelete(reviewId);

       req.flash("success", "Delete Review!");

      res.redirect(`/listings/${id}`);
  };


