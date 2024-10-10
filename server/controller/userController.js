const BusinessCard = require('../models/businessCardSchema')

module.exports = {


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
    }
    
}