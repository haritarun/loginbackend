const Location = require('../models/location')
const login = require('../models/loginModel')


const location = async(req,res)=>{
    const output = await login.find()
    const email = output[output.length-1].email

    const {location} = req.body
    const  {street,city,pincode}=location   
    const user = await Location.findOne({email})
    if (!user){
        const newData = new Location ({
            email,
            location: {
                street:street,
                city:city,
                pincode:pincode
            }
        })
        await newData.save()
        res.status(200).json({message:'Successfully'})
    }

    else{
        const value = user.location.pincode === pincode
        if (!value){
            location = {street,city,pincode}
            await user.location.save()
            res.status(200).json({message:'successfully'})

        }
        res.status(200).json({message:"successfully"})
    }
}

const getLocation = async(req,res)=>{
    const output = await login.find()
    const email = output[output.length-1].email

    const user = await Location.findOne({email})
    if (!user){
        res.status(400).json({message:"No Data is There"})
    }

    else{
        const data = user.location
        res.status(200).json({data})
    }
}

module.exports = {
    location,
    getLocation
}