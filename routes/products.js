const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET products by category
router.get("/category/:categoryId", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single product by ID
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Pass the ID directly
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product); // Return the found product
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle any errors
  }
});

// POST a new product
router.post("/", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    imageUrl: req.body.imageUrl,
    rating: req.body.rating,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        rating: req.body.rating,
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
