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
