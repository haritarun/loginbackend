const login = require('../models/loginModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const { createClient } = require('redis');


const OtpExpire = 60 * 1000


const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: "tarunbommana798@gmail.com", 
        pass: "fznt ittn egav kajd",  
    }
})

const client = createClient({ url: 'redis://localhost:6379' });
client.on('error', (err) => console.error('Redis Error:', err));
client.connect()
    .then(() => console.log('Connected to Redis'))
    .catch(err => console.error('Redis Connection Error:', err));

const generateOtp = ()=>{
    const otp = Math.round(10000+Math.random()*900000)
    return otp
}


const postLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  console.log("enter into backend")


  if(!email){
    res.status(404).json({message:"Enter some Email"})
  }

  const user = await login.findOne({email})

  if(!user){
    const expireDate = Date.now()+OtpExpire
  const otp = generateOtp()
  
  const data = JSON.stringify({otp,expireDate})
  await client.setEx(email,300,data)
  console.log(client.get(email))

  const mailOptions={
    from:"tarunbommana798@gmail.com",
    to:email,
    subject:'Otp Verification',
    html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
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

    .header img {
      max-width: 120px;
      margin-bottom: 10px;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }

   
    .content {
      padding: 20px;
      text-align: center;
      color: #333;
    }

    .content p {
      font-size: 16px;
      margin: 20px 0;
    }

    .otp-code {
      margin: 30px auto;
      font-size: 40px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #00ba5a;
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

    .footer p {
      margin: 5px 0;
    }
    .user{
        text-align: start;
    }
  </style>
</head>
<body>
  <div class="email-container">
   
    <div class="header">
      
      <h1>Verify Your E-mail Address</h1>
    </div>


    <div class="content">
      <p class="user">Dear user,</p>
      <p>
        Thank you for registering at our hospital. To complete your registration,
        please use the following One-Time Password (OTP):
      </p>

      <div class="otp-code">
        ${otp}
      </div>

      <p>
        This OTP is valid for the next 2 minutes. Please do not share this code
        with anyone.
      </p>
      <p>Thanks,<br>The Hospital Team</p>
    </div>

    <div class="footer">
      <p>Get in touch</p>
      <p>+11 111 333 4444</p>
      <p>
        <a href="mailto:info@yourcompany.com">info@yourcompany.com</a>
      </p>
      <p>&copy; 2024 Your Company. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>
`

  }

  await transporter.sendMail(mailOptions)
  return res.status(200).json({message:"Otp Sent Successfully"})

  }
  
  res.status(201).json({message:"Email Already Exist"})
  
};

const verifyOtp =async(req,res)=>{
    const {email,userOtp,password} = req.body
    if(!email){
        return res.status(404).json({message:"Enter some Email"})
    }
    console.log(email,userOtp)
    
    const data = await client.get(email)
   
    const {otp,expireDate}=JSON.parse(data)
    console.log(otp,expireDate)

    
    if(Date.now()>expireDate){
        await client.del(email)
        console.log("time is over")
        return res.status(201).json({message:'Time is Over Otp Delete Successfully'})
    }
    if (parseInt(userOtp)!==(otp)){
      console.log("invalid otp ")
        return res.status(400).json({message:"Invalid OTP"})
    }
    await client.del(email)
   
    const hashedPassword = await bcrypt.hash(password,10)
    
    await login.create({
        email,
        password:hashedPassword
    })
    console.log("inserted Successfully")
    res.status(200).json({ message: 'Inserted Sucessfully' });
    

}

module.exports = {
  postLogin,
  verifyOtp,
};