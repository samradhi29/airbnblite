// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const User = require("../models/user"); // Adjust path based on where your User model is

// // Signup Page
// router.get("/signup", (req, res) => {
//     res.render("users/signup.ejs");
// });

// // Signup Handler (POST /signup)
// router.post("/signup", (req, res, next) => {
//     const { username, email, password, confirmPassword } = req.body;

//     // Simple validation
//     if (!username || !email || !password || !confirmPassword) {
//         req.flash("error", "All fields are required!");
//         return res.redirect("/signup");
//     }

//     if (password !== confirmPassword) {
//         req.flash("error", "Passwords do not match!");
//         return res.redirect("/signup");
//     }

//     // Create new user
//     const newUser = new User({ username, email });
    
//     // Set the password (you should hash it before saving)
//     User.register(newUser, password, (err, user) => {
//         if (err) {
//             req.flash("error", err.message);
//             return res.redirect("/signup");
//         }

//         // Log in the user after successful registration
//         req.login(user, (err) => {
//             if (err) return next(err);
//             req.flash("success", "Welcome! You are now registered and logged in.");
//             res.redirect("/listings"); // Redirect to listings page after successful signup
//         });
//     });
// });

// // Login Page
// router.get("/login", (req, res) => {
//     res.render("users/login.ejs");
// });

// // Login Handler
// router.post(
//     "/login",
//     passport.authenticate("local", {
//         failureRedirect: "/login", // Redirect on failure
//         failureFlash: true,       // Enable flash messages
//     }),
//     (req, res) => {
//         const redirectUrl = req.session.returnTo || "/listings"; // Redirect to previous page or default
//         delete req.session.returnTo; // Clear returnTo after redirection
//         req.flash("success", "Welcome back!"); // Flash success message
//         res.redirect(redirectUrl);
//     }
// );

// // Logout Route
// router.get("/logout", (req, res, next) => {
//     req.logout((err) => {
//         if (err) {
//             return next(err); // Pass error to the next middleware
//         }
//         req.flash("success", "You are logged out");
//         res.redirect("/listings"); // Redirect after logout
//     });
// });

// // Post Router for Adding Data
// router.post("/add", (req, res) => {
//     // Simulate adding data
//     const { title, description } = req.body;
//     if (!title || !description) {
//         req.flash("error", "All fields are required!");
//         return res.redirect("/listings/new");
//     }

//     // Simulated save (replace with database logic)
//     console.log("Data added:", { title, description });
//     req.flash("success", "Listing added successfully!");
//     res.redirect("/listings");
// });

// module.exports = router;





const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js")
const {saveredirectUrl} = require("../middleware.js");
// Signup Page
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});
router.post("/signup" , async(req , res)=>{
try{
let {username , email ,  password} = req.body;
const newUser = new User({email , username});
const registereduser = await User.register(newUser , password);
req.flash("success" , "user was registered");
req.login(registereduser , (err)=>{ //thsi is for login aftersighup
    if(err){
        return next(err);
    }
    req.flash("success" , "welcome!!")
    res.redirect("/listings")


})

}catch(err){
    req.flash("error" , err.message);
    res.redirect("/signup");
}

}

)
// Login Page
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Login Handler
router.post(
    "/login",
saveredirectUrl,

    passport.authenticate("local", {
        failureRedirect: "/sighup", // Redirect to login page on failure
        failureFlash: true, // Enable flash messages
    }),
    async (req, res) => {
        // After successful login, redirect to a protected page or dashboard
       let redirectUrl = res.locals.redirectUrl || "/listings"; 
        res.redirect(redirectUrl);
    }
);

router.get("/logout" , (req , res , next)=>{
    req.logout((err)=>{
        if (err) {
            return next(err);
        }
        req.flash("success" , "you are logged out");
        res.redirect("/login");
    });
})

module.exports = router;
//req contain many many details