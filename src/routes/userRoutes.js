const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// signup form
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

// post signup form
router.post("/signup",(req,res)=>{
    
    try{
        let {username,email,password} = req.body;
        bcrypt.genSalt(10, function(err,salt){
            bcrypt.hash(password,salt, async function(err,hash){
                let createUser = new User({
                    username,
                    email,
                    password : hash,
                });
                await createUser.save();
                let token = jwt.sign({ id: createUser._id },"mysupersecretkey");
                res.cookie("token",token);
                res.locals.currUser = createUser;
                req.flash("success_msg","Signup successfull!");
                res.redirect("/");
            })
        })
    }catch(err){
        console.log("Signup failed");
    }
})


router.get("/login",(req,res)=>{
    
    res.render("users/login.ejs");
});

router.post("/login", async (req,res)=>{
    
    try{
        let {email,password} = req.body;
        let user = await User.findOne({email});
        if(!user) throw new ExpressError(404,"user is not found");
        bcrypt.compare(password,user.password,function(err,result){
            if(result){
                let token = jwt.sign({ id: user._id },"mysupersecretkey");
                res.cookie("token",token);
                res.locals.currUser = user;
                req.flash("success_msg","User login successfull!");
                res.redirect("/");
            }    
            else return res.send("something want wrong!");
        })
    }catch(err){
        res.send("Login failed");
    }
})

router.get("/logout",(req,res)=>{
 
    res.cookie("token","");
    req.flash("success_msg","Logout successfull!");
    res.redirect("/");
});

module.exports = router;