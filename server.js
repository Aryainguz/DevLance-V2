const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config()
app.use(express.static(__dirname +"/Public"));
app.set('views', __dirname+'/views/');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())


const app = express();
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server ready at ${port}`)
})