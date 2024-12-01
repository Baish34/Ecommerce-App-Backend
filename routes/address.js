const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const User = require("../models/User");

//address
// Add new address
router.post('/users/:userId/addresses', async (req, res) => {
    const { userId } = req.params;
    const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;
  
    try {
      const address = new Address({
        userId,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country
      });
  
      const savedAddress = await address.save();
  
      // Add address to user's addresses array
      await User.findByIdAndUpdate(userId, { $push: { addresses: savedAddress._id } });
  
      res.status(201).json(savedAddress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add address', details: error.message });
    }
  });