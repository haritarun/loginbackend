const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    location:
        {
            street:{
                type:String,
                require:true
            },
            city:{
                type:String,
                requrie:true
            },
            pincode:{
                type:String,
                requrie:true
            }
        }
    
})

const Location = mongoose.model("Location",LocationSchema)

module.exports = Location