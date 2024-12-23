
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true,default:null },             // Product Name
  price: { type: String,default:0 },            // Price (as string for flexibility)
  stock: { type: Number,default:0 },
  image: { type: Number,default:null },            // Stock quantity
  history: { type: [],default:[] }     // Associated Invoice Number
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
