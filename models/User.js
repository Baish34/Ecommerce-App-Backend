const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String, 
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
  addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  }],
  phoneNumber:String,


},{timestamps:true})

const User = mongoose.model("User", userSchema)
module.exports = User