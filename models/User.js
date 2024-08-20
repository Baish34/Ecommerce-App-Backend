// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
    required: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
