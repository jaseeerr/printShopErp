const mongoose = require('mongoose')
const Schema = mongoose.Schema

const priceData = new Schema({
    item:{
      type:String,
      required:true
    },
    data:{
      type:[],
      required:true
    }

   
})





module.exports = mongoose.model('businessCard',priceData)
