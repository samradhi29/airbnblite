const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js")
const {listingSchema} = require("../schema.js")
const expressError = require("../utils/expresserror.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const {isloggedIn, isOwner} = require("../middleware.js");
const review = require("../models/review.js");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage});

const validateListing = (req , res , next)=>{
    let {error} = listingSchema.validate(req.body);

   if (error){
    let errormsg = error.details.map((el)=>el.message).join(",") //to join the error deitals by ,

    
 throw new expressError(400 , errormsg);
    }else{
        next()
    }
}



router.get("/" , async(req , res)=>{
    const alllisting=  await Listing.find({});
    res.render("listings/index.ejs" , {alllisting});
          
  
      });


      router.get("/new" , isloggedIn, (req , res)=>{
        if(!req.isAuthenticated()){
      req.flash("error" , "you must be logged-in");
      return res.redirect("/login")
        }
        res.render("listings/new.ejs")
        })

        router.post("/", upload.single('listing[image]') , validateListing ,  wrapasync(async (req, res , next) => {
            //    let result = listingSchema.validate(req.body);
            //    console.log(result);
            //    if (result.error){
            // throw new expressError(400 , result.error);
            //    }
                // console.log(req.body); // Debugging: Log the incoming request body
                // if(!req.body.listing){
                //     console.log(req.body); // Debugging: Log the incoming request body
                //     throw new expressError(400 , "send valid data for listing");
                // }
                res.send(req.file);
                let listing = req.body.listing;
                
                  const newListing = new Listing(listing);
                //   if(!newListing.title){
                //     throw new expressError(400 , "tittle is missing");
                //  this can be a solution }
              let url =    req.file.path;
              let filename = req.file.filename;
                newListing.owner = req.user._id;
                newListing.image  ={url , filename};
                  await newListing.save();
                  req.flash("success" , "new listing created");
                  res.redirect("/listings");
            }))
    
    router.get("/:id" ,wrapasync(async (req , res)=>{
        let {id} =req.params;
       const listing= await Listing.findById(id).populate({path : "reviews" , populate : {
        path : "author" ,
       } }).populate("owner");
       if(!listing){
        req.flash("error" , "listing not exist");
        res.redirect("/listing");
       }
       res.render("listings/show.ejs" , {listing , review: listing.reviews,});
    }))      


    router.put("/:id" , 
      isloggedIn , 
      isOwner ,
      upload.single('listing[image]'),
      
      wrapasync(async (req , res)=>{
        // console.log(req.body); // Debugging: Log the incoming request body
        // if(!req.body.listing){
        //     console.log(req.body); // Debugging: Log the incoming request body
        //     throw new expressError(400 , "send valid data for listing");
        // }
       
        let {id} = req.params;

//authorization      
    
   const  listing=  await Listing.findByIdAndUpdate(id , {...req.body.listing});
   if (typeof req.file !== "undefined"){
   let url =    req.file.path;
   let filename = req.file.filename;
   listing.image = {url  , filename};
       res.redirect("/listings");
    }}))
  router.post(
      "/listings",
      validateListing,
      wrapasync(async (req, res, next) => {
        // Check if the request contains valid listing data
        if (!req.body.listing) {
          throw new expressError(400, "Listing data is required");
        }
    
        // Create and save the new listing
        const newListing = new Listing(req.body.listing);
        try {
          await newListing.save();
          res.redirect("/listings");
        } catch (error) {
          throw new expressError(500, "Failed to save the listing");
        }
      })
    );
    




    router.get("/:id/edit", isloggedIn  , isOwner,wrapasync(async(req , res)=> {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
          req.flash("error" , "listing not exist");
          res.redirect("/listing");
         }


        res.render("listings/edit.ejs" , {listing});
        }))
       
        router.delete("/:id", isloggedIn , isOwner, wrapasync(async (req, res) => {
            let { id } = req.params;
            let deletedListing = await Listing.findByIdAndDelete(id);
            req.flash("success" , "new listing deleted");
            res.redirect("/listings");
        }));
module.exports = router;
       
    
//.env files to store over envirment variables

