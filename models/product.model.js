//import * as mongoose from "mongoose"
const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  price: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
} 
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product
