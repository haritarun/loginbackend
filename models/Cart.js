const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
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
}, {
  timestamps: true,  
});

const Cart = mongoose.model('Cart',CartSchema)

module.exports=Cart