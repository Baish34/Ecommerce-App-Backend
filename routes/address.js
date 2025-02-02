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

  // Get all addresses for a user
router.get('/users/:userId/addresses', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId).populate('addresses');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user.addresses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve addresses', details: error.message });
    }
  });

  // Updating an address
router.put('/addresses/:addressId', async (req, res) => {
    const { addressId } = req.params;
    const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;
  
    try {
      const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        { addressLine1, addressLine2, city, state, postalCode, country },
        { new: true }
      );
  
      if (!updatedAddress) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      res.status(200).json(updatedAddress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update address', details: error.message });
    }
  });

  // Deleting an address
router.delete('/addresses/:addressId', async (req, res) => {
    const { addressId } = req.params;
  
    try {
      const deletedAddress = await Address.findByIdAndDelete(addressId);
      if (!deletedAddress) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      // Remove address from user's addresses array
      await User.findByIdAndUpdate(deletedAddress.userId, { $pull: { addresses: addressId } });
  
      res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete address', details: error.message });
    }
  });
  
  module.exports = router;