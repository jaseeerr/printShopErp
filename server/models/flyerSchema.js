const mongoose = require('mongoose');

// Define the schema for the price data
const FlyerSchema = new mongoose.Schema({
  data: { 
    type: {}, 
  
    required: true // This will store the entire priceData object
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create the model from the schema
const PriceData = mongoose.model('Flyer', FlyerSchema);

module.exports = PriceData;
