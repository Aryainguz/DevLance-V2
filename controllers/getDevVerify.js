const {devlancer,post} = require("../database/models")
const bodyParser = require("body-parser");
const axios = require("axios")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sgMail = require("@sendgrid/mail")
const crypto = require('crypto')
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");




exports.getDevVerify = async (req,res)=>{
    const token = req.cookies.token
    console.log(token)
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    const the_user = await devlancer.findById(decoded._id) //getting requested user
    if(token){
        if(the_user.github_verified){
            res.redirect("/devlance/devlancer")
        }
        else{
        res.render("githubVerify")
        }
    }
    else{
        res.redirect("/login")
    }
}