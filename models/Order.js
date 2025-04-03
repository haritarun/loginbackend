const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({

    email:String,
    array:[
        {
        title:String,
        price:Number,
        quantity:Number,
        imageurl:String,
        rating:Number
        }
    ]
})
const Order = mongoose.model('Order',OrderSchema)
module.exports=Order