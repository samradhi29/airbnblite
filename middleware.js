const Listing = require("./models/listing");
const review = require("./models/review");
module.exports.isloggedIn = (req , res , next) =>{
    console.log(req.path , "..." , req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error" , "you must logged in to listings");
        return res.redirect("/login");

    }
    next();

};
module.exports.saveredirectUrl = (req , res , next)=>{
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
 module.exports.isOwner = async(req , res , next) =>{
    let {id} = req.param;
    let listing =  await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
     req.flash("error" , "you dont have permission");
    return  res.redirect(`/listings/${id}`);
    }
    next();
 }
module.exports.isAuthor = async(req , res,next)=>{
    let {id , reviewId} = req.params;
    let listing =  await review.findById(reviewId);
    if(!listing.author.equals(res.locals.currUser._id)){
     req.flash("error" , "you dont have permission");
    return  res.redirect(`/listings/${id}`);
    }
    next();
 }