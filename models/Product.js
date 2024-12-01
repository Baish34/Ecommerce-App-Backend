const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  imageUrl: { type: String },
  rating: { type: Number },
});

module.exports = mongoose.model("Product", productSchema);