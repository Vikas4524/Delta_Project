const express =require("express");
const router = express.Router();

const AsyncWrap = require("../utils/wrapAsync.js");

const Listing = require("../Models/listing.js");
const {isLoggedIn , isOwner , validateListing, isReviewAuthor } = require("../middleware.js");

                 //controllers 
   const listingController = require("../controllers/listings.js");
const { render } = require("ejs");

                     // multer (NPM)
const multer  = require('multer')
const {storage, cloudinary} = require("../cloudConfig.js");
const upload = multer({ storage })             
// const upload = multer({ dest: 'uploads/' })             

router.route("/listings")
                     // index Route
.get(AsyncWrap(listingController.index))
                                  //   Create Route
.post( isLoggedIn,upload.single("listing[image]"), validateListing,AsyncWrap ( listingController.createListing));             
             
                  //  cloudinary
// .post(upload.single("listing[image]"),(req,res)=>{
// res.send(req.file);
// })
                                    // New Route 
 router.get("/listing/new", isLoggedIn, listingController.renderNewForm);
      
                           //  Read show Route
 router.route("/listings/:id")
.get(AsyncWrap ( listingController.showListing))
                                             //Update Route 
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, AsyncWrap (listingController.updateListing));                  
                       
 
                                  
                                     // edit Route
 router.get("/listings/:id/edit", isLoggedIn,isOwner, AsyncWrap ( listingController.editListing));   
                              
                                                           
   
                              
                                      // Delete Route
   router.delete("/listings/:id", isLoggedIn, isOwner, AsyncWrap( listingController.deleteListing));


module.exports = router;






