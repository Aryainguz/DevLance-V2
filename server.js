const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sgMail = require("@sendgrid/mail")
const crypto = require('crypto')
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");
const { response } = require("express");

require("dotenv").config()

const API_KEY = process.env.SENDGRID_API_KEY
sgMail.setApiKey(API_KEY)
const app = express()
app.use(express.static(__dirname +"/Public"));
app.set('views', __dirname+'/views/');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

//configuring database
const  db = require("./database/db_confg")
db()



const {getRegister, postRegister,getIndex, verifyToken, getLogin, postLogin, logout} = require("./controllers/auth");
const { devlanceClient, devlanceTopDevs, devlanceDevDen, postDevlanceMainDev, getDevlanceDevlancer, postDevVerify, getDevVerify, getDashboard, getProfile } = require("./controllers/devlance");

//importing models
const devlancer = require("./database/models")
const post = require("./database/models")


const port = "http://localhost:3000/";

app.get("/", getIndex)

app.get("/register",getRegister)

app.post("/register", postRegister)

app.get("/verify/:token",verifyToken)

app.get("/login",getLogin)

app.post("/login",postLogin)

app.get("/logout",logout)



app.get("/devlance/client",devlanceClient)

app.get("/devlance/topdevs",devlanceTopDevs)

app.get("/devlance/devden",devlanceDevDen)

app.post("/devlance/mainDev",postDevlanceMainDev)

app.get("/devlance/devlancer",getDevlanceDevlancer)


app.post("/dev/verify",postDevVerify)

app.get("/dev/verify",getDevVerify)

app.get("/devlance/dashboard",getDashboard)

app.get("/devlance/profile/:username",getProfile)


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server ready at ${port}`)
})