const login = require('../models/loginModel')
const bcrypt = require('bcrypt')

const signUp = async(req,res)=>{
    const {email,password}= req.body
    
    const user  = await login.findOne({email})
    if(!user){
        return res.status(404).json({message:"email not found"})
    }
    if (await bcrypt.compare(password,user.password)){
        
        return res.status(200).json({message:"login Successfully"})
    }
    else{
        
        return res.status(404).json({message:"password not matched"})
    }
}

module.exports = {
    signUp
}