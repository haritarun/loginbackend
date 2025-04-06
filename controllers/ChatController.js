const Chat = require("../models/Chat");
const login = require('../models/loginModel');
const UserData = require('../models/UserData')

const chat = async (req, res) => {
    const output = await login.find()
    const email = output[output.length - 1].email
    const { userPrompt,botResponse,imageurl ,userId} = req.body
    console.log(email,userPrompt,botResponse,userId)   
    const user = await Chat.findOne({ email })


    if(imageurl){
        const imageurl = imageurl
    }
    else{
        const imageurl = ''
    }

    if (!user) {
        const newChat = new Chat({
            email: email,
            array: [
                {
                    sessionId: userId,
                    messages:[
                        {
                            user: 'user',
                            message: userPrompt,
                            imageurl:imageurl,
                            date: new Date(),
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            user: 'user',
                        },
                        {
                            user: 'bot',
                            message: botResponse,
                            imageurl:imageurl,
                            date: new Date(),
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                            user: 'bot',
                        }
                    ]
                }
            ]
        })
        await newChat.save()
        return res.status(200).json({ message: "data successfully added" })
    } else {
        
        user.array.push({
            sessionId: userId,
            messages: [
                {
                    user: 'user',
                    message: userPrompt,
                    imageurl:imageurl,
                    date: new Date(),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    user: 'user',
                },
                {
                    user: 'bot',   
                    message: botResponse,
                    imageurl:imageurl,
                    date: new Date(),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                    user: 'bot',
                }
            ]
    })
        
        await user.save()
        return res.status(200).json({ message: "data added successfully" })
    }
}

const getChat = async (req, res) => {
    const output = await login.find()
    const email = output[output.length - 1].email
    const {userId} = req.body
    console.log(email,userId)
    const user = await Chat.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: 'No data found' })
    }
    const data = user.array.filter(eachItem => eachItem.sessionId === userId)
    console.log(data)
    if (!data) {
        return res.status(400).json({ message: 'No data found' })
    }
    console.log(data)
    res.status(200).json({ message:data })
}

const getUserName = async (req, res) => {
    console.log('user name')
    const output = await login.find()
    const email = output[output.length - 1].email
    const user = await UserData.findOne({ email })
    
    if (!user) {
        return res.status(400).json({ message: 'No data found' })
    }
    const name = user.array.name
    
    res.status(200).json({ name })
}

module.exports = { 
    chat,
    getChat,
    getUserName,
} 