exports.logout = (req,res)=>{

    res.cookie("token",null,{
        httpOnly:true,expires:new Date(Date.now()) //deleting cookies now
    })
    res.redirect("login")
}