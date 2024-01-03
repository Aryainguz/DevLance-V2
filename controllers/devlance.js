const {devlancer,post} = require("../database/models")
const bodyParser = require("body-parser");
const axios = require("axios")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sgMail = require("@sendgrid/mail")
const crypto = require('crypto')
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");


exports.devlanceClient = async (req,res)=>{
    const token = req.cookies.token
    console.log(token)
    if(token){

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const the_user = await devlancer.findById(decoded._id) //getting requested user

        const all_posts = await post.find({})
        const all_developers = await devlancer.find({accountType:"Developer"})
        res.render("mainClient",{the_user:the_user,all_developers:all_developers,all_posts:all_posts})
    }
    else{
        res.redirect("/login")
    }
}

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

exports.devlanceDevDen = async (req,res)=>{
    const token = req.cookies.token
    console.log(token)
    if(token){

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const the_user = await devlancer.findById(decoded._id) //getting requested user

        const all_developers = await devlancer.find({accountType:"Developer"})
        const all_posts = await post.find({})

        res.render("devden",{the_user:the_user,all_developers:all_developers,all_posts:all_posts})
    }
    else{
        res.redirect("/login")
    }
}

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


exports.postDevVerify = async (req,res)=>{
    const token = req.cookies.token
    console.log(token)
    if(token){
    const GITHUB_USERNAME = req.body.github
    const GITHUB_API_BASE_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;
    const headers = {
        Authorization: process.env.GIT_KEY
    }
    try {
        const response = await axios.get(`${GITHUB_API_BASE_URL}/events`,headers);
        const contributions = response.data.filter(event => event.type === 'PushEvent');
        const response2 = await axios.get(`${GITHUB_API_BASE_URL}`,headers);
        const res3 = await axios.get(`${GITHUB_API_BASE_URL}/events`,headers);
        const contributions_all = res3.data.length
        const profile_photo = response2.data.avatar_url
        const bio = response2.data.bio
        const followers = response2.data.followers
        const location = response2.data.location

        
        const git_profile = {
            bio:bio,
          username: GITHUB_USERNAME,
          totalContributions: contributions.length,
          contributions_all:contributions_all,
          followers:followers,
          location:location,
          img:profile_photo,
          contributions: contributions.map(event => ({
            repo: event.repo.name,
            count: event.payload.commits.length
          }))
        }
        console.log(git_profile)
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log(decoded)

        // const the_user = await devlancer.findById(decoded._id) //getting requested user

        await devlancer.findOneAndUpdate({_id:decoded._id}, { $set: { git_profile:git_profile,github_verified:true } })
        the_user = await devlancer.findById(decoded._id)
        const all_posts = await post.find({owner_email:the_user.email})
        const l = all_posts.length
            
        res.render("mainDev",{the_user: await devlancer.findById(decoded._id),all_posts:all_posts,l:l})
    

      } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch GitHub contributions' });
      }
    }
    else{
        res.redirect("/login")
    }

}

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
exports.getDashboard = async (req,res)=>{
    const token = req.cookies.token
    console.log(token)
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    const the_user = await devlancer.findById(decoded._id) //getting requested user
    if(token){
        if(the_user.github_verified){
            res.render("dashboard",{the_user:the_user})
        }
        else{
            res.redirect("/dev/verify")
        }
    }
    else{
        res.redirect("/login")
    }
}

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