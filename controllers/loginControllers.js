const login = require('../models/loginModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');


const OtpExpire = 2 * 60 * 1000
let otpStore ={}

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: "tarunbommana798@gmail.com", 
        pass: "fznt ittn egav kajd",  
    }
})

const generateOtp = ()=>{
    const otp = Math.round(10000+Math.random()*900000)
    return otp
}


const postLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  


  if(!email){
    res.status(404).json({message:"Enter some Email"})
  }

  const user = await login.findOne({email})

  if(!user){
    const expireDate = Date.now()+OtpExpire
  const otp = generateOtp()

  otpStore[email]={otp,expireDate}
  console.log(otpStore)

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

    console.log(otpStore)

    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({ message: "No OTP found for this email" });
    }
    
    const {otp,expireDate}=record
    if(Date.now()>expireDate){
        delete otpStore[email]
        return res.status(201).json({message:'Time is Over Otp Delete Successfully'})
    }
    if (userOtp!==otp){
        return res.status(400).json({message:"Invalid OTP"})
    }
    delete otpStore[email]
   
    const hashedPassword = await bcrypt.hash(password,10)
    
    await login.create({
        email,
        password:hashedPassword
    })
    res.status(200).json({ message: 'Inserted Sucessfully' });
    

}

module.exports = {
  postLogin,
  verifyOtp,
};