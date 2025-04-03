const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');
                
const mongoose = require('mongoose')
const loginRouter = require('./routers/loginRouter')
const LocationRouter = require('./routers/LocationRouter')
const CartRouter = require('./routers/CartRouter')
const ProfilleRouter = require('./routers/ProfileRouter')

const OrderRouter = require('./routers/OrderRouter')


app.use(express.json());
app.use(cors())
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

  

  const razorpay = new Razorpay({
    key_id: 'rzp_test_c6OOqIRzJ4dxn4',
    key_secret: 'RwpxzvOaEawLlGy3DOFhQj2D'
  });
  



  app.get('/getChat',async(req,res)=>{
    const completion = openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {"role": "user", "content": "write a haiku about ai"},
      ],
    });

    completion.then((result) => console.log(result.choices[0].message));

    
  })

  app.post('/create-order', async (req, res) => {
    try {
      const { amount, currency = 'INR' } = req.body;
      
      const options = {
        amount: amount, // amount in paise
        currency,
        receipt: `receipt_${Date.now()}`
      };
  
      const order = await razorpay.orders.create(options);
      
      res.json({
        id: order.id,
        currency: order.currency,
        amount: order.amount
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });
  
  
  app.post('/verify-payment', async (req, res) => {
    try {
      const { orderId, paymentId, signature } = req.body;
      
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + "|" + paymentId)
        .digest('hex');
  
      if (generatedSignature !== signature) {
        return res.status(400).json({ error: 'Payment verification failed' });
      }
  
      // Payment is successful and verified
      // Here you can update your database, send confirmation email, etc.
      
      res.json({ success: true, message: 'Payment verified successfully' });
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ error: 'Payment verification failed' });
    }
  });


  
  

  app.use("/",loginRouter)

  app.use("/",LocationRouter)

  app.use('/',CartRouter)

  app.use('/',ProfilleRouter)
  app.use('/',OrderRouter)


  app.listen(3000,()=>{
      console.log("port Running At Port 3000")
  })