exports.verifyToken = async (req,res)=>{
    try{
        const user = await devlancer.findOneAndUpdate({verification_token:req.params.token}, { $set: { verified:true } })
        res.redirect("/login?message=Account Verified! You can login now.&color=green")
    }
    catch(e){
        console.log(e)
        res.send("<h1>Something Went Wrong!</h1>")
    }

}