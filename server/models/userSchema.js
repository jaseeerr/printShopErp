const mongoose = require('mongoose');

// Define the schema for the user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  suPassword:{
    type: String,
    
  },
  suAccess:{
   type:Boolean,
   default:false
  },
  block:{
    type:Boolean,
    default:true
  }
});

// Create a model for the user schema
const User = mongoose.model('User', userSchema);

module.exports = User;
