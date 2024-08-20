const express = require("express");
const Wishlist = require("../models/Wishlist");
const router = express.Router();

// GET: Fetch wishlist for a user

router.get("/wishlists/:userId", async (req,res)=>{
  const {userId} = req.params

  try{
    const wishlist = await Wishlist.findOne({userId}).populate({path:"items.productId",
              model:"Product"  })
    if(wishlist){
      res.status(200).json(wishlist)
    } else {
      res.status(404).json({error:"wishlist not found"})
    }
  }catch (error) {
    res.status(500).json({ error: 'Failed to retrieve wishlist', details: error.message });
  }
})

// POST: Add a product to the wishlist

router.post('/wishlists/:userId/items', async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [{ productId }] });
    } else {
      const existingItem = wishlist.items.find(item => item.productId.toString() === productId);
      if (!existingItem) {
        wishlist.items.push({ productId });
      }
    }

    const updatedWishlist = await wishlist.save();
    res.status(200).json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to wishlist', details: error.message });
  }
});


// DELETE: Remove a product from the wishlist
router.delete('/wishlists/:userId/items/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });

    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
    const updatedWishlist = await wishlist.save();
    res.status(200).json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from wishlist', details: error.message });
  }
});
// DELETE: Clear the wishlist
router.delete("/:userId/clear", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = [];
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
