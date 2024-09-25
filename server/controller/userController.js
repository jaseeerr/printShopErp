const BusinessCard = require('../models/businessCardSchema')

module.exports = {


    addBusinessCardRates:async(req,res)=>{
      try {
       console.log(req.body.data)
       const data = new BusinessCard({
        item:req.body.data[0].item,
        data:req.body.data
      })
       await data.save()
        res.json({success:true})
      } catch (error) {
        console.error('Error adding price data:', error);
        res.status(500).json({ success:false,error: 'Server error, unable to add price data.' });
      }
    },
    editBusinessCardRates:async(req,res)=>{
      try {
       console.log(req.body)
       const newData = {
        item:req.body.newItemData.data[0].item,
        data:req.body.newItemData.data
      }
      const x = await BusinessCard.findByIdAndUpdate(req.body.itemId,newData)
  
       res.json({success:true})
      } catch (error) {
        console.error('Error adding price data:', error);
        res.status(500).json({ error: 'Server error, unable to add price data.' });
      }
    },
    getBusinessCardItems:async(req,res)=>{
      try {
        const items = await BusinessCard.find().select('item');
        const data = await BusinessCard.find()
        console.log(data)
        res.json({success:true,items,data})
      } catch (error) {
        console.log(error)
        res.json({success:false})
      }
    }
}