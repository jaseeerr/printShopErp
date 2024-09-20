const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
    commercialInvoice:String,
    date:Date,
    address1:String,
    address2:String,
    address3:String,
    address4:String,
    address5:String,
    signature:String,
    company:String,
    taxId:String,
    acid:String,
    pt1:String,
    pt2:String,
    pt3:String,
    pt4:String,
    pt5:String,
    pt6:String,
    h1:String,
    h2:String,
    h3:String,
    h4:String,
    h5:String,
    h6:String,
    h7:String,
    values:[],
    total:String

   
})





module.exports = mongoose.model('data',dataSchema)
