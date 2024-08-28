const express = require("express");
const User = require("../models/User");
const router = express.Router();

//to add data for user
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user", details: error.message });
  }
});

//update user data
router.put('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});


//get user
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate({path: "cart.items.productId",
    model:"Product"                                                  }).populate("addresses");  


    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "user not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve user", details: error.message });
  }
});


module.exports = router;
