const {devlancer,post} = require("../database/models")
const bodyParser = require("body-parser");
const axios = require("axios")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sgMail = require("@sendgrid/mail")
const crypto = require('crypto')
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");






exports.postDevlanceMainDev = async (req,res)=>{
    const token = req.cookies.token
    console.log(token)
    if(token){

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const the_user = await devlancer.findById(decoded._id) //getting requested user

        const owner_email=the_user.email
        const owner_username=the_user.git_profile.username
        const owner_linkedin=the_user.linkedin
        const owner_img=the_user.git_profile.img
        const blog= req.body.blog

        const the_post = await post.create({owner_email:owner_email,owner_img:owner_img,owner_linkedin:owner_linkedin,owner_img:owner_img,blog:blog,owner_username:owner_username})

        res.redirect("/devlance/devlancer")
    }
    else{
        res.redirect("/login")
    }
}