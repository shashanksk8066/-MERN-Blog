const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: false,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'], // Limit to valid roles
    default: 'user'          // Default to 'user' unless specified
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
