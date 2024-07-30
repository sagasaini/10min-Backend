
const { Modal } = require('../models/driver');
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads"); // Set your upload directory
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });
  
  const upload = multer({ storage: storage });
  
  // POST route to create a new SubCategory
  router.post('/create', async (req, res) => {
    const { cover, name, email, phone, status } = req.body;
    console.log('body',req.body)

    const driverExist = await Modal.findOne({ email: email });
    
    if (driverExist) {
        return res.status(400).send('Driver already exists');
    }

    // Create new driver
    let driver = new Modal({
        cover: cover,
        name: name,
        email: email,
        phone: phone,
        status: status,
    });

    driver = await driver.save();

    if (!driver) {
        return res.status(400).send('The driver cannot be created!');
    }

    res.send(driver);
});

// Update an existing driver
router.put('/update/:id', async (req, res) => {
    const { cover, name, email, phone, status } = req.body;

    // Find driver by ID and update
    const driver = await Modal.findByIdAndUpdate(
        req.params.id,
        {
            cover: cover,
            name: name,
            email: email,
            phone: phone,
            status: status,
        },
        { new: true }
    );

    if (!driver) {
        return res.status(400).send('The driver cannot be updated!');
    }

    res.send(driver);
});

// Delete an existing driver
router.delete('/delete/:id', async (req, res) => {
    const driver = await Modal.findByIdAndRemove(req.params.id);

    if (!driver) {
        return res.status(400).send('The driver cannot be deleted!');
    }

    res.send({ message: 'Driver deleted successfully' });
});

// Get all drivers
router.get('/', async (req, res) => {
    const drivers = await Modal.find();

    if (!drivers) {
        return res.status(500).json({ success: false });
    }

    res.send(drivers);
});

// Get a specific driver by ID
router.get('/:id', async (req, res) => {
    const driver = await Modal.findById(req.params.id);

    if (!driver) {
        return res.status(500).json({ message: 'The driver with the given ID was not found.' });
    }

    res.send(driver);
});

module.exports = router;