const {devlancer,post} = require("../database/models")
const bodyParser = require("body-parser");
const axios = require("axios")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sgMail = require("@sendgrid/mail")
const crypto = require('crypto')
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");




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