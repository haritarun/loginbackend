const mongoose = require("mongoose");


const ChatSchema = new mongoose.Schema({
    email: String,
    array: [
        {
            sessionId:String,

            messages: [
                {
                    user: String,
                    message: String,
                    sender: String,
                    time: String,
                    imageurl: String,
                    date: String,
                }
                ]
    }
    ],
    
},
{
    timestamps: true,
}
)

const Chat = mongoose.model('Chat', ChatSchema)
module.exports = Chat