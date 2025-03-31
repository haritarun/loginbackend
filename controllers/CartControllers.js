const Cart = require('../models/Cart')
const login = require('../models/loginModel')

const cart = async(req,res)=>{
    const output = await login.find()
    const email = output[output.length-1].email
    const {title,price,image,rating}=req.body
    
    console.log(email,title,price)
    const user = await Cart.findOne({email})
    
    if(!user){
        const Item = new Cart({
        email:email,
        array:[
            {
            title:title,
            price:price,
            quantity:1,
            imageurl:image,
            rating:rating
            }
        ]
        })
        await Item.save()
        return res.status(200).json({message:"data successfully added"})
    }
    else{
        const existing = user.array.find(eachItem=>eachItem.title===title)
        if (!existing){
            user.array.push({
            title:title,
            price:price,
            
            quantity:1,
            imageurl:image,
            rating:rating
            
            })
            await user.save()
            res.status(200).json({message:"data added successfully"})
        }
      }
      
}

const CartGet = async(req,res)=>{
    
    const output = await login.find()
    const email = output[output.length-1].email
    const user=await Cart.findOne({email})
    if (!user){
        return res.status(400).json({message:'user not register'})
    }
    const data = user.array.map(eachItem=>({
        title:eachItem.title,
        price:eachItem.price,
        quantity:eachItem.quantity,
        rating:eachItem.rating
    }))
    res.status(200).json({data}) 
}

const GetIncrement = async(req,res)=>{
    const {title}=req.body
    const output = await login.find()
    const email = output[output.length-1].email
    const user = await Cart.findOne({email})

    if (!user){
        return res.status(400).json({data:'email not found'})
    }
    const existing = user.array.find(eachItem=>eachItem.title===title)
    if (existing){
        existing.quantity+=1
        await user.save();
        return res.status(200).json({data:'message'})
    }
}

const GetDecrement=async(req,res)=>{
  const {title}=req.body
  const output = await login.find()
  const email = output[output.length-1].email
  const user = await Cart.findOne({email})

  if (!user){
    return res.status(400).json({data:'email not found'})
  }
  const existingIndex = user.array.findIndex(eachItem=>eachItem.title===title)
  if (user.array[existingIndex].quantity > 1){
    user.array[existingIndex].quantity-=1   
  }
  else{
    user.array.splice(existingIndex,1)
  }
  await user.save()

  const data = user.array.map(eachItem=>({
    title:eachItem.title,
    price:eachItem.price,
    quantity:eachItem.quantity,
    rating:eachItem.rating
  }))
  
  return res.status(200).json({data})
  
}

const GetDetailes = async(req,res)=>{
    const output = await login.find()
    const email = output[output.length-1].email
    const user = await Cart.findOne({email})
    
    if (!user){
        return res.status(400).json({message:'email not found'})
    }

    res.status(200).json(user.array)
}

const GetDelete = async(req,res)=>{
    
    const {id} = req.query
    const output = await login.find()
    const email = output[output.length-1].email
    
    
        const user = await Cart.findOne({email})
        if (!user){
            return res.status(400).json({message:'email not found'})
        }
        const existingIndex = user.array.findIndex(eachItem=>(
            eachItem._id.toString()===id.toString()
        ))
        console.log(existingIndex)
        
        if (existingIndex!==-1){
            console.log(user.array[existingIndex])
            user.array.splice(existingIndex,1)
            await user.save()
            return res.status(200).json({message:'deleted successfully'})
        }
}

module.exports ={
    cart,
    CartGet,
    GetIncrement,
    GetDecrement,
    GetDetailes,
    GetDelete
}
