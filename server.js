const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config()
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(__dirname +"/Public"));

app.set('views', __dirname+'/views/');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser())

// routes 

const {getIndex} = require('./controllers/getIndex')
const {getRegister} = require('./controllers/getRegister')
const {postRegister} = require('./controllers/postRegister')
const {verifyToken} = require('./controllers/verifyToken')
const {getLogin} = require('./controllers/getLogin')
const {postLogin} = require('./controllers/postLogin')
const {logout} = require('./controllers/logout')

app.get("/", getIndex)
app.get("/register",getRegister)
app.post("/register", postRegister)
app.get("/verify/:token",verifyToken)
app.get("/login",getLogin)
app.post("/login",postLogin)
app.get("/logout",logout)




app.listen(port, () => {
    console.log(`Server ready at ${port}`)
})