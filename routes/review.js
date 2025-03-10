const express = require("express");
const router = express.Router({mergeParams : true});
const wrapasync = require("../utils/wrapasync.js")
const {reviewSchema} = require("./schema.js")
const expressError = require("../utils/expresserror.js");
const mongoose = require("mongoose");
const Review = require("./models/review.js");
const {isLoggedIn} = require("../middleware.js");
const validatereview = (req , res , next)=>{
    let {error} = reviewSchema.validate(req.body);
    
   if (error){
    let errormsg = error.details.map((el)=>el.message).join(",") //to join the error deitals by ,

    
 throw new expressError(400 , errormsg);
    }else{
        next()
    }
}

router.post("/",isLoggedIn,wrapasync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    console.log("New review sent");
    req.flash("success" , "new review created");
    res.redirect(`/listings/${listing._id}`);
    // Redirect to the listing page after adding the review
}));

/// delete review route 
route.delete("/:reviewId" , wrapasync(async( req , res)=>{
    let {id , reviewId} = req.params;
    Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId} });
    Review.findByIdAndDelete(reviewId);
    req.flash("success" , "new listing deleted");
    res.redirect("/listings/${id}");
}));


