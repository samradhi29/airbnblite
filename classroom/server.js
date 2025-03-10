const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path")
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));

app.listen(3000 , ()=>{
console.log("server is listening");
})

app.use(session({secret : "supersecret" , 
    resave : false , 
    saveUninitialized: true
}))
app.use(flash())
//better way to use the flash msgs
app.use((req , res , next)=>{
    res.locals.success= req.flash("success")
    res.locals.error = req.flash("error")
    next();
})

app.get("/register", (req, res) => {
    let { name = "me" } = req.query;
    req.session.name = name;
    console.log(req.session.name);

    

    if(name==="me"){
        req.flash("error"  , "user not registered")
    }
    else{
        req.flash("success", "User registered successfully"); // Set the flash message
    }
   res.redirect("/hello")
});

app.get("/hello" , (req , res)=>{
    // res.locals.success= req.flash("success")
    // res.locals.error = req.flash("error")
    res.render("page.ejs", { name: req.session.name});
})
// app.get("/req" , (req , res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count =1;
//     }
    
//     res.send(`you send a req ${req.session.count} times`);
// })
app.get("/test" , (req , res)=>{
    res.send("test successful");
})

