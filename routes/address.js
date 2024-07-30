const express = require('express');
const { Address } = require('../models/address');
const router = express.Router();

// Get all addresses for a user
router.get('/:userId', async (req, res) => {
    try {
        const addressList = await Address.find({ userId: req.params.userId });
        if (!addressList) {
            return res.status(404).json({ success: false, message: 'No addresses found for this user' });
        }
        res.status(200).json(addressList);
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
});

// Add a new address
router.post('/add', async (req, res) => {
    let address = new Address({
        userId: req.body.userId,
        addressType: req.body.addressType,
        flatNumber: req.body.flatNumber,
        floor: req.body.floor,
        locality: req.body.locality,
        landmark: req.body.landmark,
        name: req.body.name,
        phone: req.body.phone
    });

    address = await address.save();
    if (!address) {
        return res.status(500).json({ success: false, message: 'The address cannot be created' });
    }
    res.status(201).json(address);
});

// Delete an address
router.delete('/delete/:id', async (req, res) => {
    try {
        const address = await Address.findByIdAndRemove(req.params.id);
        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
        res.status(200).json({ success: true, message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
});

// Get an address by ID
router.get('/get/:userId/:id', async (req, res) => {
    try {
        const { userId, id } = req.params; // Destructuring userId and id from request params
        const address = await Address.findById(id); // Using id to find the address
        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
});


// Update an address
router.put('/update/:userId/:id', async (req, res) => {
    try {
        const { userId, id } = req.params;
        const {
            addressType,
            flatNumber,
            floor,
            locality,
            landmark,
            name,
            phone
        } = req.body;

        // Validate the input data
        if (!addressType || !flatNumber || !locality || !name || !phone) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });
        }

        // Update the address
        const updatedAddress = await Address.findByIdAndUpdate(
            id,
            {
                addressType,
                flatNumber,
                floor,
                locality,
                landmark,
                name,
                phone
            },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        res.status(200).json({ success: true, message: 'Address updated successfully', data: updatedAddress });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating the address', error: error.message });
    }
});

module.exports = router;
