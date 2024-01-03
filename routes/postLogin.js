exports.postLogin = async (req, res) => {
    try{
        const {email,password} = req.body
        const current_user = await devlancer.findOne({$or:[{email:email},{password:password}]})
        if(!current_user){
            res.render("login",{"message":"Account doesn't exist! check entered credentials.","color":"red"})
        }
        else if(!current_user.verified){
            res.render("login",{"message":"Account not Verified! check email and verify before login.","color":"red"})
        }
        else{
            const passCheck = await bcrypt.compare(req.body.password,current_user.password)
            if(passCheck){
                if(current_user.accountType=="Client"){

                    const token = await jwt.sign({_id:current_user._id},process.env.JWT_SECRET);
            
                    res.cookie("token",token,{
                        httpOnly:true,expires:new Date(Date.now()+6000*1000) //60*1000 = 60 seconds
                    })
                    res.redirect("/devlance/client")
                }
                else{
                    const token = await jwt.sign({_id:current_user._id},process.env.JWT_SECRET);
            
                    await res.cookie("token",token,{
                        httpOnly:true,maxAge:3600000 //60*1000 = 60 seconds
                    })
                    if(current_user.github_verified){
                        res.redirect("/devlance/devlancer")
                    }
                    else{
                        res.render("githubVerify")
                    }
                }
            }
            else{
            res.render("login",{"message":"Invalid Password!","color":"red"})
            }
        }

    }
    catch(e){
        console.log(e)
        res.render("login",{"message":"Invalid Credentials!","color":"red"})
    }

}