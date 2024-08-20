const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

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
router.post("/:userId/items", async (req, res) => {
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

// PUT: Update the quantity of a product in the cart
router.put("/:userId/items/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    item.quantity = quantity;

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Failed to update item quantity", details: error.message });
  }
});

// DELETE: Remove a product from the cart
router.delete("/:userId/items/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item from cart", details: error.message });
  }
});

// DELETE: Clear the cart
router.delete("/:userId/clear", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", details: error.message });
  }
});

module.exports = router;
