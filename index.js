const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()
const mongoose = require('mongoose')
const loginRouter = require('./routers/loginRouter')
const LocationRouter = require('./routers/LocationRouter')

app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.use("/",loginRouter)
app.use("/",loginRouter)
app.use("/",LocationRouter)
app.use("/",LocationRouter)
 

app.listen(3000,()=>{
    console.log("port Running At Port 3000")
})