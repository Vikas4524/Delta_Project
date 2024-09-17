const Listing = require("./Models/listing.js");
const Review = require("./Models/review.js");


const {Schema , reviewSchema} = require("./Views/schema.js");
const expressError = require("./utils/ExpressError.js");


 module.exports.isLoggedIn = (req,res,next)=>{
  // console.log(req.user);
  // console.log(req);
  // console.log(req.originalUrl);
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
       return res.redirect("/login");
      }
      next();
};

 module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

 module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", "you are not the owner of this Listings");
     return res.redirect(`/listings/${id}`);
    }
  next();
};



                     // Validate middlewair
 module.exports.validateListing = (req,res,next) =>{
  let result = Schema.validate(req.body);
    if(result.error) {
       throw new expressError(400, result.error);
    }else{
      next();
    }
 };
                                                                 
 module.exports.validateReview = (req,res,next) =>{
  let result = reviewSchema.validate(req.body);
  if(result.error) {
     throw new expressError(400, result.error);
  }else{
     next();
  }
 }
                                  
 module.exports.isReviewAuthor = async (req,res,next)=>{
  let {id, reviewId} = req.params; 
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "you are not the author of this review");
   return res.redirect(`/listings/${id}`);
  }
next();
};

