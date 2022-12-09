const mongoose = require("mongoose");

// First step => Make Your Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    lowercase: true,
    enum: ["fruit", "vegetable", "dairy", "fungus"],
  },
});

// Second Step => Make your model
const Product = mongoose.model("Product", productSchema);

//Now we're gonna export the 'Product' model for ../index.js
module.exports = Product;
