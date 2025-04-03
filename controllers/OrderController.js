const Order = require('../models/Order');
const login = require('../models/loginModel');
const Cart = require('../models/Cart')
const nodemailer = require('nodemailer');

const OrderController = async (req, res) => {
    try {
        console.log('enter into backend ')
        const users = await login.find().sort({ _id: -1 });
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        const email = users[0].email;
        const {data}=req.body
        const {cartList}=data
        
        if (!data) {
            return res.status(400).json({ message: "No data provided" });
        }
        
    
        let order = await Order.findOne({ email });
        const checkout = await Cart.findOne({email});

        if (!order) {
           
            const newOrder = new Order({
                email: email,
                array: cartList.map(item => ({
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity || 1, 
                    imageurl: item.imageurl ,
                    rating: item.rating
                }))

            });
            
            await newOrder.save();
            return res.status(200).json({ message: "Order created successfully" });
        } else {
            
            for (const item of cartList) {
                const existingItem = order.array.find(i => i.title === item.title);
                
                if (existingItem) {
                    existingItem.quantity += item.quantity || 1;
                } else {
                    order.array.push({
                        title: item.title,
                        price: item.price,  
                        quantity: item.quantity || 1,
                        imageurl: item.imageurl || item.image,
                        rating: item.rating
                    });
                }
                
                checkout.array=checkout.array.filter(eachItem=>eachItem._id.toString() !== item._id)
                await checkout.save()
            }
             
            await order.save();
            
            const transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user: "tarunbommana798@gmail.com", 
                    pass: "fznt ittn egav kajd",  
                }
            })
            const mailOptions = {
                from:'tarunbommana798@gmail.com',
                to:email,
                subject:'Order Confirmed',
                html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }

    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .header {
      background-color: #009957;
      color: #fff;
      text-align: center;
      padding: 20px;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }

    .content {
      padding: 20px;
      color: #333;
    }

    .order-details {
      margin: 20px 0;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 15px;
    }

    .detail-row {
      display: flex;
      margin-bottom: 10px;
    }

    .detail-label {
      font-weight: bold;
      width: 150px;
      color: #555;
    }

    .detail-value {
      flex: 1;
    }

    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }

    .status-confirmed {
      background-color: #d4edda;
      color: #155724;
    }

    .footer {
      background-color: #009961;
      color: #fff;
      text-align: center;
      padding: 15px;
      font-size: 14px;
    }

    .footer a {
      color: #fff;
      text-decoration: none;
    }

    .user {
      text-align: start;
    }

    .thank-you {
      margin-top: 30px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Order Confirmation</h1>
    </div>

    <div class="content">
      <p class="user">Dear Customer,</p>
      <p>Thank you for your order. Here are your order details:</p>

      <div class="order-details">
        <div class="detail-row">
          <div class="detail-label">Order Number:</div>
          <div class="detail-value">#ORD-20240615-1234</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Order Date:</div>
          <div class="detail-value">June 15, 2024 at 10:30 AM</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Status:</div>
          <div class="detail-value">
            <span class="status-badge status-confirmed">Confirmed</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Payment Method:</div>
          <div class="detail-value">Visa ending in 4242</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Billing Address:</div>
          <div class="detail-value">
            123 Main Street, Apt 4B<br>
            New York, NY 10001
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Shipping Address:</div>
          <div class="detail-value">
            123 Main Street, Apt 4B<br>
            New York, NY 10001<br>
            Estimated Delivery: June 18, 2024
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Total Amount:</div>
          <div class="detail-value" style="font-weight: bold; font-size: 18px;">$129.98</div>
        </div>
      </div>

      <p class="thank-you">Thank you for shopping with us! We'll notify you when your order ships.</p>
      <p>Best regards,<br>The Store Team</p>
    </div>

    <div class="footer">
      <p>Need help with your order?</p>
      <p>+1 (800) 123-4567</p>
      <p>
        <a href="mailto:support@yourstore.com">support@yourstore.com</a>
      </p>
      <p>&copy; 2024 Your Store. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>`     
            }

            await transporter.sendMail(mailOptions)
        
            return res.status(200).json({ message: "Order updated successfully" });
        }
    } catch (error) {
        console.error("Error in OrderController:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const GetOrderDetailes = async(req,res) =>{
    console.log('enter into the backend ')
    const data =await login.find().sort({_id:-1})
    console.log(data)
    console.log(data[0].email)
    const email = data[0].email
    const user = await Order.findOne({email})

    if(!user){
        res.status(200).json({message:"User Not Found"})
    }
    else{
        const data = user.array
        res.status(200).json({message:"successfully",data})
    }
}

module.exports = {
    OrderController,
    GetOrderDetailes
};