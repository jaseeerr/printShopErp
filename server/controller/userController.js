const BusinessCard = require('../models/businessCardSchema')
const Uniform = require('../models/uniformSchema')
const BillBook = require('../models/billBookSchema')
const Keychain = require('../models/keychainSchema')
const Flyer = require('../models/flyerSchema')
const WeddingCard = require('../models/weddingCardSchema')
const Product = require('../models/productSchema')
const User = require('../models/userSchema')
const Category = require('../models/categorySchema')
const argon2 = require('argon2');
const Cart = require('../models/cartSchema')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = {



  signup:async(req,res)=>{
    const { username, password } = req.body;
  
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }
  
    // Hash the password using argon2
    const hashedPassword = await argon2.hash(password);
  
    // Create and save the new user
    const user = new User({ username, password: hashedPassword });
    await user.save();
  
    // Respond with success
    res.status(201).json({ message: 'User created successfully' });
  },
  login:async(req,res)=>{
    const { username, password } = req.body;
  
    try {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.json({ baduser: true, success: false });
      }
  
      // Verify the password using argon2
      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        return res.json({ baduser: true, success: false });
      }
  
      // Generate JWT token
      const userToken = jwt.sign({ _id: user._id, username: user.username,block:user.block }, process.env.ACCESS_TOKEN_SECRET);
  
      // Send the token back to the user
      res.json({ success: true, token: userToken });
    } catch (error) {
      console.error(error);
      res.json({ baduser: true, success: false });
    }
  },

  loginSu:async(req,res)=>{
    const {password} = req.body;
    try {
      // Find user by username
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.json({ baduser: true, success: false });
      }
      
  
      // Verify the password using argon2
      const isMatch = await argon2.verify(user.suPassword, password);
      if (!isMatch) {
        return res.json({ baduser: true, success: false });
      }

      const change = await User.findByIdAndUpdate(req.user._id,{$set:{suAccess:true}})
  
  
      // Generate JWT token
      // const userToken = jwt.sign({ userId: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
      // Send the token back to the user
      res.json({ success: true});
    } catch (error) {
      console.error(error);
      res.json({ baduser: true, success: false });
    }
  },
  logoutSu:async(req,res)=>{
    try {
      // Find user by username
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.json({ baduser: true, success: false });
      }
      
  
    

      const change = await User.findByIdAndUpdate(req.user._id,{$set:{suAccess:false}})
  
  
      // Generate JWT token
      // const userToken = jwt.sign({ userId: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
      // Send the token back to the user
      res.json({ success: true});
    } catch (error) {
      console.error(error);
      res.json({ baduser: true, success: false });
    }
  },
  changePassword:async(req,res)=>{
    
    const { newPassword, repeatPassword, currentPassword } = req.body;
    
    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required' });
  }

    if (!newPassword || !repeatPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Check if new password matches repeat password
    if (newPassword !== repeatPassword) {
      return res.status(400).json({ message: 'New password and repeat password do not match' });
    }
  
    // Validate password length
    if (newPassword.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters' });
    }
  
    try {
      // Find the user by ID from req.user._id
      const user = await User.findById(req.user._id);

       // Check if the current password matches the stored password
       const isMatch = await argon2.verify(user.password, currentPassword);
       if (!isMatch) {
           return res.status(400).json({ message: 'Current password is incorrect' });
       }
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await argon2.hash(newPassword);
  
      // Update the password in the database
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  updateSuPassword:async(req,res)=>{
    
    const { newPassword, repeatPassword } = req.body;
    
    if (!newPassword || !repeatPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Check if new password matches repeat password
    if (newPassword !== repeatPassword) {
      return res.status(400).json({ message: 'New password and repeat password do not match' });
    }
  
    // Validate password length
    if (newPassword.length < 3) {
      return res.status(400).json({ message: 'Password must be at least 3 characters' });
    }
  
    try {
      // Find the user by ID from req.user._id
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await argon2.hash(newPassword);
  
      // Update the password in the database
      user.suPassword = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
    addBusinessCardRates:async(req,res)=>{
      try {
        const { name, data } = req.body; // Extract name and data from the request body
    
        // Create a new instance of the PriceData model
        const newPriceData = new BusinessCard({
         
          data: data
        });
    
        // Save the priceData to the database
        const savedPriceData = await newPriceData.save();
    
        // Send success response
        res.status(201).json({
          success: true,
          message: 'Price data saved successfully',
          data: savedPriceData
        });
      } catch (error) {
        // Send error response in case of failure
        console.error('Error saving price data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to save price data',
          error: error.message
        });
      }
    },
    getBusinessCardRates:async(req,res)=>{
      try {
        // Fetch all price data from MongoDB
        const priceData = await BusinessCard.find({});
        res.status(200).json({ success: true, data: priceData });
      } catch (error) {
        console.error('Error fetching price data:', error);
        res.status(500).json({ success: false, message: 'Error fetching price data' });
      }
    },
    updateBusinessCardRates:async(req,res)=>{
      try {
        const { id, data } = req.body; // Extract name and data from the request body
    
        
        const update = await BusinessCard.findByIdAndUpdate(id,{$set:{data:data}})
    
        // Send success response
        res.status(201).json({
          success: true,
          message: 'Price data updated successfully',
        });
      } catch (error) {
        // Send error response in case of failure
        console.error('Error saving price data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to save price data',
          error: error.message
        });
      }
    },
    addUniformRares:async(req,res)=>{
      try {
        const { data } = req.body; // Extract name and data from the request body
    
        // Create a new instance of the PriceData model
        const newPriceData = new Uniform({
         
          data: data
        });
    
        // Save the priceData to the database
        const savedPriceData = await newPriceData.save();
    
        // Send success response
        res.status(201).json({
          success: true,
          message: 'Price data saved successfully',
          data: savedPriceData
        });
      } catch (error) {
        // Send error response in case of failure
        console.error('Error saving price data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to save price data',
          error: error.message
        });
      }
    },
    updateUniformRares:async(req,res)=>{
      try {
        const { id, data } = req.body; // Extract name and data from the request body
    
        
        const update = await Uniform.findByIdAndUpdate(id,{$set:{data:data}})
    
        // Send success response
        res.status(201).json({
          success: true,
          message: 'Price data updated successfully',
        });
      } catch (error) {
        // Send error response in case of failure
        console.error('Error saving price data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to save price data',
          error: error.message
        });
      }
    },
    getUniformRates:async(req,res)=>{
      try {
        // Fetch all price data from MongoDB
        const priceData = await Uniform.find({});
        console.log(priceData)
        res.status(200).json({ success: true, data: priceData });
      } catch (error) {
        console.error('Error fetching price data:', error);
        res.status(500).json({ success: false, message: 'Error fetching price data' });
      }
    },

    addBillBookRates:async(req,res)=>{
      try {
        const { name, data } = req.body; // Extract name and data from the request body
    
        // Create a new instance of the PriceData model
        const newPriceData = new BillBook({
         
          data: data
        });
    
        // Save the priceData to the database
        const savedPriceData = await newPriceData.save();
    
        // Send success response
        res.status(201).json({
          success: true,
          message: 'Price data saved successfully',
          data: savedPriceData
        });
      } catch (error) {
        // Send error response in case of failure
        console.error('Error saving price data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to save price data',
          error: error.message
        });
      }
    },
    getBillBookRates:async(req,res)=>{
      try {
        // Fetch all price data from MongoDB
        const priceData = await BillBook.find({});
        // console.log(priceData)
        res.status(200).json({ success: true, data: priceData });
      } catch (error) {
        console.error('Error fetching price data:', error);
        res.status(500).json({ success: false, message: 'Error fetching price data' });
      }
    },
    updateBillBookRates:async(req,res)=>{
      try {
        const { id, data } = req.body; // Extract name and data from the request body
    
        
        const update = await BillBook.findByIdAndUpdate(id,{$set:{data:data}})
    
        // Send success response
        res.status(201).json({
          success: true,
          message: 'Price data updated successfully',
        });
      } catch (error) {
        // Send error response in case of failure
        console.error('Error saving price data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to save price data',
          error: error.message
        });
      }
    },
    addKeychainRates:async(req,res)=>{
      try {
        const { name, data } = req.body; // Extract name and data from the request body
    
        // Create a new instance of the PriceData model
        const newPriceData = new Keychain({
         
          data: data
        });
    
        // Save the priceData to the database
        const savedPriceData = await newPriceData.save();
    
        // Send success response
        res.status(201).json({
          success: true,
          message: 'Price data saved successfully',
          data: savedPriceData
        });
      } catch (error) {
        // Send error response in case of failure
        console.error('Error saving price data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to save price data',
          error: error.message
        });
      }
    },
    getKeychainRates:async(req,res)=>{
      try {
        // Fetch all price data from MongoDB
        const priceData = await Keychain.find({});
        // console.log(priceData)
        res.status(200).json({ success: true, data: priceData });
      } catch (error) {
        console.error('Error fetching price data:', error);
        res.status(500).json({ success: false, message: 'Error fetching price data' });
      }
    },
    updateKeychainRates:async(req,res)=>{
      try {
        const { id, data } = req.body; // Extract name and data from the request body
    
        
        const update = await Keychain.findByIdAndUpdate(id,{$set:{data:data}})
    
        // Send success response
        res.status(201).json({
          success: true,
          message: 'Price data updated successfully',
        });
      } catch (error) {
        // Send error response in case of failure
        console.error('Error saving price data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to save price data',
          error: error.message
        });
      }
    },

    getFlyerRates:async(req,res)=>{
      try {
        // Fetch all price data from MongoDB
        const priceData = await Flyer.find({});
        // console.log(priceData)
        res.status(200).json({ success: true, data: priceData });
      } catch (error) {
        console.error('Error fetching price data:', error);
        res.status(500).json({ success: false, message: 'Error fetching price data' });
      }
    },
    updateFlyerRates:async(req,res)=>{
      try {
        const { id, data } = req.body; // Extract name and data from the request body
    
        
        const update = await Flyer.findByIdAndUpdate(id,{$set:{data:data}})
    
        // Send success response
        res.status(201).json({
          success: true,
          message: 'Price data updated successfully',
        });
      } catch (error) {
        // Send error response in case of failure
        console.error('Error saving price data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to save price data',
          error: error.message
        });
      }
    },
    addFlyerRates:async(req,res)=>{
      try {
        const { name, data } = req.body; // Extract name and data from the request body
    
        // Create a new instance of the PriceData model
        const newPriceData = new Flyer({
         
          data: data
        });
    
        // Save the priceData to the database
        const savedPriceData = await newPriceData.save();
    
        // Send success response
        res.status(201).json({
          success: true,
          message: 'Price data saved successfully',
          data: savedPriceData
        });
      } catch (error) {
        // Send error response in case of failure
        console.error('Error saving price data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to save price data',
          error: error.message
        });
      }
    },
    getWeddingCardRates:async(req,res)=>{
      try {
        // Fetch all price data from MongoDB
        const priceData = await WeddingCard.find({});
        // console.log(priceData)
        res.status(200).json({ success: true, data: priceData });
      } catch (error) {
        console.error('Error fetching price data:', error);
        res.status(500).json({ success: false, message: 'Error fetching price data' });
      }
    },
    updateWeddingCardRates:async(req,res)=>{
      try {
        const { id, data } = req.body; // Extract name and data from the request body
    
        
        const update = await WeddingCard.findByIdAndUpdate(id,{$set:{data:data}})
    
        // Send success response
        res.status(201).json({
          success: true,
          message: 'Price data updated successfully',
        });
      } catch (error) {
        // Send error response in case of failure
        console.error('Error saving price data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to save price data',
          error: error.message
        });
      }
    },
    addWeddingCardRates:async(req,res)=>{
      try {
        const { name, data } = req.body; // Extract name and data from the request body
    
        // Create a new instance of the PriceData model
        const newPriceData = new WeddingCard({
         
          data: data
        });
    
        // Save the priceData to the database
        const savedPriceData = await newPriceData.save();
    
        // Send success response
        res.status(201).json({
          success: true,
          message: 'Price data saved successfully',
          data: savedPriceData
        });
      } catch (error) {
        // Send error response in case of failure
        console.error('Error saving price data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to save price data',
          error: error.message
        });
      }
    },
    addProduct:async(req,res)=>{
      try {
        const { name, price, stock,minStock,damagedStock, image, code, category, costPrice,cartoons,storageArea,packingDetails,dimensions,weight } = req.body;
        console.log(req.body)
        // Make sure required fields are provided
        if (!name || !price || !stock) {
          return res.status(400).json({ message: "Name, price, and stock are required" });
        }

        const stockInEntry = {
          quantity:stock,
          timestamp: new Date(),  // Current timestamp when the stock is added
          action:true,  //True while adding stock
        };
    
        // Create a new product instance
        const newProduct = new Product({
          name,
          code,
          category:category.name,
          history:[stockInEntry],
          costPrice,
          price,
          stock,
          minStock,
          damagedStock,
          image, // Can be the image URL or other metadata (like Cloudinary URL)
          cartoons,
          storageArea,
          packingDetails,
          dimensions,
          weight
        });
    
        // Save the product to the database
        const savedProduct = await newProduct.save();
    
        // Respond with the saved product details
        res.status(201).json({
          message: "Product added successfully!",
          product: savedProduct
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add product", error: error.message });
      }
    },
    addCategory:async(req,res)=>{
      try {
        const { name } = req.body;
        
        // Make sure required fields are provided
        if (!name) {
          return res.status(400).json({ message: "Name required" });
        }
    
        // Create a new product instance
        const newCategory = new Category({
          name
          
        });
    
        // Save the product to the database
        const savedCategory = await newCategory.save();

        const newCat = await Category.find()
    
        // Respond with the saved product details
        res.status(201).json({
          message: "Category added successfully!",
          category: newCat
        });
      } catch (error) {
        console.error(error);
        
        if (error.code === 11000) {
          return res.status(400).json({ message: "Cannot add duplicate category" });
        }

        res.status(500).json({ message: "Failed to add category", error: error.message });
      }
    },
    getAllCategories:async(req,res)=>{
      try {
        const categories = await Category.find(); // Fetch all products
        res.status(200).json({ categories }); // Send products in response
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch category', error: error.message });
      }
    },
    deleteCategory:async(req,res)=>{
      try {
        const categoriesDel = await Category.findByIdAndDelete(req.params.id);
        const newCat = await Category.find()  // Fetch all products
        res.status(200).json({ categories:newCat, success:true }); // Send products in response
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch category', success:false ,error: error.message });
      }
    },
    getAllProducts:async(req,res)=>{
      try {
        const products = await Product.find(); // Fetch all products
        const categories = await Category.find()
        res.status(200).json({ products,categories }); // Send products in response
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
      }
    },
    editProduct:async(req,res)=>{
      try {
        const { id } = req.params;
        const { name, price, stock,minStock,damagedStock, image,code, category, costPrice,cartoons,storageArea,packingDetails,dimensions,weight  } = req.body; // Extract updated data
    
        // Find the product by id and update its details
        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          { name, price, stock,damagedStock,minStock, image,code, category, costPrice,cartoons,storageArea,packingDetails,dimensions,weight  }, // New values to update
          { new: true } // Return the updated product
        );
    
        if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        res.status(200).json({
          message: 'Product updated successfully!',
          product: updatedProduct, // Send the updated product
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
      }
    },
    deleteProduct:async(req,res)=>{
      try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
    
        if (!deletedProduct) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
    
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
      } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    },
    getProduct:async(req,res)=>{
      try {
        const product = await Product.findById(req.params.id); // Find the product by ID
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        res.json(product); // Send the product details as the response
      } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
      }
    },
    stockout:async(req,res)=>{
      const { id } = req.params;
      const { quantity, invoiceNumber } = req.body;
    
      try {
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
    
        // Ensure that there's enough stock for the stock out operation
        if (product.stock < quantity) {
          return res.status(400).json({ message: "Not enough stock available" });
        }
    
        // Add the stock out record to the history with a timestamp
        const stockOutEntry = {
          quantity,
          invoiceNumber,
          action:false,  //True while adding stock
          timestamp: new Date(),
        };
        product.history.push(stockOutEntry);
    
        // Update the stock by subtracting the quantity
        product.stock -= quantity;
    
        // Save the updated product to the database
        await product.save();
    
        res.json({ message: "Stock updated successfully", product });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
      }
    },
    addStock:async(req,res)=>{
      const { id } = req.params;
      const { quantity } = req.body;
    
      // Check if the quantity is a valid positive number
      if (quantity <= 0 || isNaN(quantity)) {
        return res.status(400).json({ message: "Invalid quantity value" });
      }
    
      try {
        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
    
        // Add the stock to the current stock
        product.stock += quantity;
    
        // Add a new entry to the product's history (with a timestamp)
        const stockInEntry = {
          quantity,
          timestamp: new Date(), // Current timestamp when the stock is added
          action:true,  //True while adding stock
        };
        product.history.push(stockInEntry);
    
        // Save the updated product
        await product.save();
    
        // Return the updated product
        res.json({ message: "Stock added successfully", product });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
      }
    },
    addToCart:async(req,res)=>{
      try {
        const {  pid, code } = req.body;
     
        const owner = req.user._id
        if (!owner || !pid || !code) {
          return res.status(400).json({ message: 'Owner, Product ID, and Code are required' });
        }
    
        let cart = await Cart.findOne({ owner });
    
        if (!cart) {
          cart = new Cart({ owner, products: [] });
        }
    
        // Check if product already exists
        const productExists = cart.products.some(product => product.pid === pid);
        if (productExists) {
          return res.status(400).json({ message: 'Product already in cart' });
        }
    
        // Add new product
        cart.products.push({ pid, code,quantity:1 });
        await cart.save();
    
        res.status(200).json({ message: 'Product added to cart', cart });
      } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
      }
    },
    updateCartQuantity:async(req,res)=>{
      const {pid, quantity } = req.body;
      const owner = req.user._id
      // Validate input
      if (!owner || !pid || quantity === undefined || quantity <= 0) {
          return res.status(400).json({ message: 'Invalid input, ensure owner, pid, and quantity are provided and valid.' });
      }
  
      try {
          // Find the cart by owner
          const cart = await Cart.findOne({ owner });
  
          if (!cart) {
              return res.status(404).json({ message: 'Cart not found for the specified owner' });
          }
  
          // Find the product by pid in the products array
          const productIndex = cart.products.findIndex(product => product.pid === pid);
  
          if (productIndex === -1) {
              return res.status(404).json({ message: 'Product not found in the cart' });
          }
  
          // Update the quantity of the product
          cart.products[productIndex].quantity = quantity;
  
          // Save the updated cart
          await cart.save();
  
          res.status(200).json({ message: 'Quantity updated successfully', cart });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
      }
  },
    removeProduct:async(req,res)=>{
      try {
        const { owner, identifier } = req.body; // identifier can be pid or code
    
        if (!owner || !identifier) {
          return res.status(400).json({ message: 'Owner and product identifier (pid or code) are required' });
        }
    
        const cart = await Cart.findOne({ owner });
    
        if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
        }
    
        const initialLength = cart.products.length;
    
        // Remove product based on pid or code
        cart.products = cart.products.filter(
          product => product.pid !== identifier && product.code !== identifier
        );
    
        if (cart.products.length === initialLength) {
          return res.status(404).json({ message: 'Product not found in cart' });
        }
    
        await cart.save();
    
        res.status(200).json({ message: 'Product removed successfully', cart });
      } catch (error) {
        res.status(500).json({ message: 'Error removing product', error: error.message });
      }
    },
    getCart:async(req,res)=>{
      try {
        // const { owner } = req.body;
        const owner = req.user._id
        // console.log(owner)
    
        if (!owner) {
          return res.status(400).json({ message: 'Owner ID is required' });
        }
    
        // Find the cart by owner ID
        const cart = await Cart.findOne({ owner });
    
        if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
        }
    
        const productObjectIds = cart.products.map(product => new mongoose.Types.ObjectId(product.pid));
    
        // Fetch product details from Product collection, excluding costPrice
        const products = [];

        for (const id of productObjectIds) {
          const product = await Product.findById(id, { costPrice: 0, __v: 0 }); // Exclude costPrice and __v
          if (product) {
            products.push(product);
          }
        }
        // console.log(products)
    
        // Merge product details with quantity from cart
        const cartProducts = cart.products.map(cartItem => {
          // console.log(cartItem)
          const productDetail = products.find(p => p._id == cartItem.pid);
          if (productDetail) {
            return {
              ...productDetail.toObject(),
              quantity: cartItem.quantity
            };
          }
          return null;
        }).filter(item => item !== null); // Remove null values if any product was not found
    
        // console.log(cartProducts)
        res.status(200).json({ message: 'Cart products retrieved successfully', products: cartProducts });
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching cart products', error: error.message });
      }
    }
    
}