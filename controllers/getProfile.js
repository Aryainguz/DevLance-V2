const {devlancer,post} = require("../database/models")
const bodyParser = require("body-parser");
const axios = require("axios")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sgMail = require("@sendgrid/mail")
const crypto = require('crypto')
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");



exports.getProfile = async (req,res)=>{
    const token = req.cookies.token
    console.log(token)
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    if(token){
        const {username} = req.params
        console.log(username)
        const the_user = await devlancer.findOne({"git_profile.username":username})
        console.log(the_user) 
        res.render("profile",{the_user:the_user})
    }
    else{
        res.redirect("/login")
    }
}