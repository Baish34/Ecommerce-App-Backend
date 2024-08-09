// routes/wishlist.js
const express = require('express');
const Wishlist = require('../models/Wishlist');
const router = express.Router();

// GET: Fetch the wishlist for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Add a product to the wishlist
router.post('/:userId', async (req, res) => {
  const { productId, name, price, imageUrl, rating } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId: req.params.userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.params.userId, products: [] });
    }

    const productExists = wishlist.products.some(
      (product) => product.productId.toString() === productId
    );

    if (!productExists) {
      wishlist.products.push({ productId, name, price, imageUrl, rating });
    }

    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE: Remove a product from the wishlist
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      (product) => product.productId.toString() !== req.params.productId
    );

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE: Clear the wishlist
router.delete('/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = [];
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
