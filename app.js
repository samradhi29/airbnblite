if(process.env.NODE_ENV!= "production"){
    require('dotenv').config();
};
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
app.use(express.urlencoded({extended : true}))
app.use(methodOverride("_method"));
app.use (express.static(path.join(__dirname , "/public")));
const ejsMate = require("ejs-mate");
const wrapasync = require("./utils/wrapasync.js")
const expressError = require("./utils/expresserror.js")
const {listingSchema} = require("./schema.js")
const {reviewSchema} = require("./schema.js")
const listings = require("./routes/listing.js");
const review = require("./models/review.js");
const session = require("express-session")
const flash = require("connect-flash");
const passport = require("passport");
const localStategy = require("passport-local").Strategy;
const User = require("./models/user.js");
const UserRouter = require("./routes/user.js")
async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.engine("ejs" , ejsMate);

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});


//setting the session options
const sessionOptions = {
    secret : "mysupersecretcode" , 
    resave : false , 
    saveUninitialized : true ,
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000, //number of milisec after one week
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httOnly : true , //for the security 
    }
};
app.use(session(sessionOptions))
app.use(flash()); // always use before route
  
//session require for passport
app.use(passport.initialize());//it will initialize for each and every step
app.use(passport.session());  //same user or not 
passport.use(new localStategy(User.authenticate())); // Replace User with your user model
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());// unstore user details





app.get("/" , (req , res)=>{
    res.send("hi , i am root");
})

//validate listing schema funcartion

// const validateListing = (req , res , next)=>{
//     let {error} = listingSchema.validate(req.body);
    
//    if (error){
//     let errormsg = error.details.map((el)=>el.message).join(",") //to join the error deitals by ,

    
//  throw new expressError(400 , errormsg);
//     }else{
//         next()
//     }
// }


// const validatereview = (req , res , next)=>{
//     let {error} = reviewSchema.validate(req.body);
    
//    if (error){
//     let errormsg = error.details.map((el)=>el.message).join(",") //to join the error deitals by ,

    
//  throw new expressError(400 , errormsg);
//     }else{
//         next()
//     }
// }

app.use ((req , res , next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
})


app.get("/demouser" , async (req , res ) =>{
let fakeUser = new User({
    email : "student@getMaxListeners.com",
    username : "samradhi"
});



const registeredUser = await User.register(fakeUser , "hellome"); //it will autometic check wether the user present or not 
res.send(registeredUser);
})

app.use("/listings" , listings);

app.use("/listings/:id/reviews" , review);

app.use("/" , UserRouter);





app.get("/listings" , async(req , res)=>{
  const alllisting=  await Listing.find({});
  res.render("listings/index.ejs" , {alllisting});
        

    });
// app.get("/testlisting" , async (req , res) =>{
//    let samplelisting = new Listing({
//     title: "My New Villa",
//             description: "By the beach",
//             price: 1200,
//             location: "Calicut",
//             country: "India",
//    });
// await samplelisting.save();
//   console.log("sample was saved");
//   res.send("suceesfull");
// });
// app.get("/listings/new" , (req , res)=>{
//     res.render("listings/new.ejs")
//     })

// app.get("/listings/:id" ,wrapasync(async (req , res)=>{
//     let {id} =req.params;
//    const listing= await Listing.findById(id).populate("reviews");
//    res.render("listings/show.ejs" , {listing});
// }))

// app.post("/listings", validateListing ,  wrapasync(async (req, res ,next) => {
// //    let result = listingSchema.validate(req.body);
// //    console.log(result);
// //    if (result.error){
// // throw new expressError(400 , result.error);
// //    }
//     // console.log(req.body); // Debugging: Log the incoming request body
//     // if(!req.body.listing){
//     //     console.log(req.body); // Debugging: Log the incoming request body
//     //     throw new expressError(400 , "send valid data for listing");
//     // }
    
//     let listing = req.body.listing;
    
//       const newListing = new Listing(listing);
//     //   if(!newListing.title){
//     //     throw new expressError(400 , "tittle is missing");
//     //  this can be a solution }
//       await newListing.save();
//       res.redirect("/listings");
// }))

// app.get("/listings/:id/edit", wrapasync(async(req , res , next)=> {
// let {id} = req.params;
// const listing = await Listing.findById(id);
// res.render("listings/edit.ejs" , {listing});
// }))
// app.put("/listings/:id" , wrapasync(async (req , res)=>{
//     // console.log(req.body); // Debugging: Log the incoming request body
//     // if(!req.body.listing){
//     //     console.log(req.body); // Debugging: Log the incoming request body
//     //     throw new expressError(400 , "send valid data for listing");
//     // }
//     let {id} = req.params;
//   await Listing.findByIdAndUpdate(id , {...req.body.listing});
//    res.redirect("/listings");
// }))
// app.delete("/listings/:id", wrapasync(async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }));


// reviews post route
// app.post("/listings/:id/reviews",   wrapasync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newreview = new Review(req.body.review);
//     listing.reviews.push(newreview);
//     await newreview.save();
//     await listing.save();
//     console.log("New review sent");
//     res.redirect(`/listings/${listing._id}`);
//     // Redirect to the listing page after adding the review
// }));

// /// delete review route 
// app.delete("/listings/:id/reviews/:reviewId" , wrapasync(async( req , res)=>{
//     let {id , reviewId} = req.params;
//     Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId} });
//     Review.findByIdAndDelete(reviewId);
//     res.redirect("/listings/${id}");
// }));








app.all("*" , (req , res , next)=>{
    next(new expressError(404 , "page not found"))})
app.use((err , req , res , next)=>{
  let {statuscode="500" , message="something"} = err;
//   res.status(statuscode).send(message);
res.render("listings/error.ejs" , {err})

})
app.listen(8080 , ()=>{
    console.log("server is listing to the port");
});
