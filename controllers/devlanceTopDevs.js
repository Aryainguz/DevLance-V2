const {devlancer,post} = require("../database/models")
const bodyParser = require("body-parser");
const axios = require("axios")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sgMail = require("@sendgrid/mail")
const crypto = require('crypto')
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");




exports.devlanceTopDevs = async (req,res)=>{
    const token = req.cookies.token
    console.log(token)
    if(token){

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const the_user = await devlancer.findById(decoded._id) //getting requested user

        const all_developers = await devlancer.find({accountType:"Developer"})
        res.render("topdevs",{the_user:the_user,all_developers:all_developers})
    }
    else{
        res.redirect("/login")
    }
}