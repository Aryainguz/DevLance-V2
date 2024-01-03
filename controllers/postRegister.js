const {devlancer,post} = require("../database/models")
const bcrypt = require("bcrypt")
const sgMail = require("@sendgrid/mail")
const crypto = require('crypto')




exports.postRegister = async (req, res) => {

    const {email,linkedin,password1,password2,accountType} = req.body

    // checking if name or email already exists in the database
    const userExists = await devlancer.findOne({email:email})
    try{
        if(password1!==password2){
            res.render("register",{"message":"Passwords don't match!","color":"red"})
        }
        else if(password1.length <8){
            res.render("register",{"message":"Password is too short","color":"red"})
        }
        else{
            if(!userExists){
                hashedPass = await bcrypt.hash(password1,10)
                const token = crypto.randomBytes(32).toString('hex')

                const photo = "/assets/images/client.jpg"
                await devlancer.create({email:email,linkedin:linkedin,password:hashedPass,accountType:accountType,verification_token:token,photo:photo});

                verification_link = `https://devlance-by-the-xiting-way.onrender.com/verify/${token}`
                const message = {
                    to : email,
                    from : 'aryans12345678@gmail.com',
                    subject:"DevLance Verification!",
                    text:`Verify your account here (paste link on browser if not clickabl)\n \n ${verification_link} \n\n Thanks For Choosing Devlance! \n Team, The Xiting Way`
                  }
                     await sgMail
                     .send(message)
                     .then((response)=>console.log("Email sent!"))
                     .catch((error)=>console.log(error.message))
                res.redirect("login?message=Email Sent! Verify to login.&color=green")

            }
            else{
                res.render("register",{"message":"User with similar data already exists!","color":"red"})
            }    
        }
    }
    catch(e){
        console.log(e)
        res.send("Something Went Wrong!")
    }
}