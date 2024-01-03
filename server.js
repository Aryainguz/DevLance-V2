const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config()
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(__dirname +"/Public"));
app.set('views', __dirname+'/views/');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.listen(port, () => {
    console.log(`Server ready at ${port}`)
})