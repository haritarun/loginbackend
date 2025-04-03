const mongoose = require("mongoose");

const UserDataSchema = new mongoose.Schema({
  email: String,
  array:
    {
      name: String,
      age: String,
      imageurl: String,
      gender: String,
    }
  
}, {
  timestamps: true,  
});

const UserData = mongoose.model('UserData', UserDataSchema)

module.exports = UserData