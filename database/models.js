const mongoose = require("mongoose");

const schemaUser = new mongoose.Schema({
    name: String,
    photo:{
        type:String,
        default:""
    },
    linkedin:String,
    email: String,
    password:String,
    accountType:String,    
    verification_token:String,
    github_verified:{
        type:Boolean,
        default:false,
    },
    verified:{
        type:Boolean,
        default:false,
    },
    git_profile:{

    },
})


const schemaPost = new mongoose.Schema({
    owner_email:String,
    owner_username:String,
    owner_linkedin:String,
    owner_img:String,
    blog:String
})

exports.devlancer = mongoose.model("devlancer", schemaUser)
exports.post = mongoose.model("post", schemaPost)

