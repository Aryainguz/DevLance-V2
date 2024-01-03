const {devlancer,post} = require("../database/models")
const bodyParser = require("body-parser");
const axios = require("axios")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sgMail = require("@sendgrid/mail")
const crypto = require('crypto')
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");




exports.getDevlanceDevlancer = async (req,res)=>{
    const token = req.cookies.token
    console.log(token)
    if(token){

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const the_user = await devlancer.findById(decoded._id) //getting requested user

        const all_posts = await post.find({owner_email:the_user.email})
        console.log(all_posts)
        if(!the_user.github_verified){
            res.render("githubVerify",{the_user:the_user})
            }
            else{
                if(all_posts==null){
                    let l = 0
                    res.render("mainDev",{the_user:the_user,all_posts:{},l:l})
                    } 
                    else{
                    let l = all_posts.length
                    res.render("mainDev",{the_user:the_user,all_posts:all_posts,l:l})
                    }  
            }
    }
    else{
        res.redirect("/login")
    }
}