const Listing = require("../Models/listing.js");
               //   mapbox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res,)=>{
    // console.log(req.user);
     const allListings = await Listing.find({});
     res.render("listings/index.ejs",{allListings});   
 };

 
 module.exports.renderNewForm = (req,res)=>{
    // console.log(req.user);
    // if(!req.isAuthenticated()){
    //   req.flash("error", "You must be logged in to create listing!");
    //   res.redirect("/login");
    // }
     res.render("listings/new.ejs");
                               
  };

 module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
     const idListing = await Listing.findById(id).populate({
      path : "reviews",
       populate : {
         path: "author",
      },
   }).populate("owner");

     if(!idListing){
      req.flash("error" ,"Listing you requested for does not exist!");
      res.redirect("/listings");
   }
     res.render("listings/show.ejs", {idListing});
};

module.exports.createListing =async (req,res, next)=>{
  let response= await geocodingClient.forwardGeocode({
      // query: 'New Delhi, India',
      query: req.body.listing.location,
      limit: 1,
    })
      .send()

      // console.log(response.body.features[0].geometry);
      // res.send("done!");
      

   let url = req.file.path;
   let filename = req.file.filename;
   // console.log(req.file);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};

    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
   //  console.log(savedListing);
    req.flash("success", "Create New Listing!");
    res.redirect("/listings");
 };


 module.exports.editListing =async (req,res ,next)=>{
    let {id} = req.params;
    const idListing = await Listing.findById(id);
 
    if(!idListing){
       req.flash("error" ,"Listing you requested for does not exist!");
       res.redirect("/listings");
    }
    let originalImageUrl = idListing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {idListing , originalImageUrl});
  };

  module.exports.updateListing = async (req,res)=>{
    let {id} =req.params;
   //                         // setting Authorization
   //  let listing = await Listing.findById(id);
   //  if(!listing.owner._id.equals(res.locals.currUser._id)){
   //    req.flash("error", "you don't have permission to edit");
   //   return res.redirect(`/listings/${id}`);
   //  }
    let UpListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if (typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      UpListing.image = {url , filename};
      await UpListing.save(); 
    }
    req.flash("success", "Listing Update!");
                        // new 
    res.redirect(`/listings/${id}`);
 };
                              
                           
 module.exports.deleteListing =async (req,res)=>{
    let {id} = req.params;
     await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Delete!");

     res.redirect("/listings");
 };



//  MAP_TOKEN=pk.eyJ1IjoiaXRzc2FyYW5oZXJlIiwiYSI6ImNsd3B3aDFybjFodTMyaXJ6cGQxeWdwYzcifQ.4HPJRlRvgTdHaXXTDQEWCg