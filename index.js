const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const loginRouter = require('./routers/loginRouter')


app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

console.log("enter into backend")


app.use("/",loginRouter)
app.use("/",loginRouter)


app.listen(3000,()=>{
    console.log("port Running At Port 3000")
})