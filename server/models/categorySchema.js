const mongoose = require('mongoose');

// Define the schema for the user
const categorySchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  }
});

// Create a model for the user schema
const Category = mongoose.model('Categories', categorySchema);

module.exports = Category;
