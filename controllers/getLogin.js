exports.getLogin = async (req,res)=>{
    const token = await req.cookies.token
    console.log(token)
    if(token){
        const decoded = await jwt.verify(token,process.env.JWT_SECRET)
        const the_user = await devlancer.findById(decoded._id)
        if(the_user.accountType=="Devloper"){
            if(the_user.github_verified){
                res.redirect("/devlance/devlancer")
            }
            else{
                res.redirect("/dev/verify")
            }
        }
        else{
            res.redirect("devlance/client")
        }


    }
    else{
        res.render("login",{message:req.query.message,color:req.query.color})
    }
}