const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
    trim: true
  },
  products: [
    {
      pid: {
        type: String,  // Product code (not ObjectId)
        required: true,
        trim: true
      },
      code: {
        type: String,
        required: true,
       
      },
      quantity: {
        type: Number,
        required: true,
       
      }
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
