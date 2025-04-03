const login = require('../models/loginModel')
const UserData = require('../models/UserData')

const UserProfile = async (req, res) => {
    const {title,image,date,gender}= req.body
    
    const output = await login.find()
    const email = output[output.length-1].email

    const user = await UserData.findOne({email})

    if (!user){
        const data  = new UserData({
            email:email,
            array:{
                name:title,
                age:date,
                imageurl:image,
                gender:gender

            }
        })
        await data.save()
        res.status(200).json({message:'successfully'})
    }
    else{
        const data ={
            name:title,
            age:date,
            imageurl:image,
            gender:gender
        }
        user.array=data
        await user.save()
        res.status(200).json({message:'successfully'})

    }
}


const getUserProfile = async (req, res) => {
    
    const output = await login.find()
    const email = output[output.length-1].email

    const user = await UserData.findOne({email})
    if (!user){
        res.status(400).json({message:"No Data is There"})
    }
    else{
        const data = user.array
        res.status(200).json({data,email})
    }
}


module.exports = {
    UserProfile,
    getUserProfile
}