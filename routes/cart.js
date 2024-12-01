const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");

// GET: Fetch the cart for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve cart", details: error.message });
  }
});

// POST: Add a product to the cart
router.post("/:userId/cart/items", async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
  
    try {
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [{ productId, quantity }] });
      } else {
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ productId, quantity });
        }
      }
  
      const updatedCart = await cart.save();
      res.status(201).json(updatedCart);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to cart", details: error.message });
    }
  });

  // Increase quantity of a product in the cart
router.post('/carts/:userId/items/:productId/increase', async (req, res) => {
    const { userId, productId } = req.params;
  
    try {
      let cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ error: 'Cart not found' });
  
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += 1;
        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);
      } else {
        res.status(404).json({ error: 'Product not found in cart' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to increase quantity', details: error.message });
    }
  });