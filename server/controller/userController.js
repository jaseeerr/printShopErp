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
const jwt = require('jsonwebtoken');
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
      const userToken = jwt.sign({ _id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
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
    
    const { newPassword, repeatPassword } = req.body;
    
    if (!newPassword || !repeatPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Check if new password matches repeat password
    if (newPassword !== repeatPassword) {
      return res.status(400).json({ message: 'New password and repeat password do not match' });
    }
  
    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
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
      user.password = hashedPassword;
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
        const { name, price, stock, image, code, category, costPrice } = req.body;
        
        // Make sure required fields are provided
        if (!name || !price || !stock) {
          return res.status(400).json({ message: "Name, price, and stock are required" });
        }
    
        // Create a new product instance
        const newProduct = new Product({
          name,
          code,
          category,
          costPrice,
          price,
          stock,
          image, // Can be the image URL or other metadata (like Cloudinary URL)
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
        const { name, price, stock, image,code, category, costPrice  } = req.body; // Extract updated data
    
        // Find the product by id and update its details
        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          { name, price, stock, image,code, category, costPrice  }, // New values to update
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
    }
    
}