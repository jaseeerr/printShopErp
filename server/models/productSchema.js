const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },          // Product Name
  code: { type: String, },          // Product Code
  category: { type: String, required: false },          // Product Category
  costPrice: { type: String, required: false },          // Cost Price
  price: { type: Number, default: 0 },           // Price (as string for flexibility)
  stock: { type: Number, default: 0 },             // Stock quantity
  image: { type: String, default: null },          // Image URL or path (store as string)
  history: { type: Array, default: [] },           // History of the product
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
