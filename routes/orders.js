const { Orders } = require('../models/orders');
const express = require('express');
const router = express.Router();

// Get all orders based on query
router.get('/', async (req, res) => {
  try {
    const ordersList = await Orders.find(req.query);
    if (!ordersList) {
      return res.status(500).json({ success: false });
    }
    return res.status(200).json(ordersList);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);
    // console.log(req.params.id)
    if (!order) {
      return res.status(500).json({ message: 'The order with the given ID was not found.' });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while fetching the order.', error: error.message });
  }
});

// Get orders by user ID
router.get('/get/:userId', async (req, res) => {
    // console.log(req.params.userId)

  try {
    const userid = req.params.userId;
    const orders = await Orders.find({ userid: userid });
    

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'An error occurred while fetching orders.', error: error.message });
  }
});

// Get order count
router.get('/get/count', async (req, res) => {
  try {
    const orderCount = await Orders.countDocuments();
    if (!orderCount) {
      return res.status(500).json({ success: false });
    }
    return res.status(200).json({ orderCount: orderCount });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Create new order
router.post('/create', async (req, res) => {
  try {
    let order = new Orders({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      pincode: req.body.pincode,
      amount: req.body.amount,
      paymentId: req.body.paymentId,
      email: req.body.email,
      userid: req.body.userid,
      products: req.body.products,
    });

    order = await order.save();
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
});

// Delete order by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Orders.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found!', success: false });
    }
    return res.status(200).json({ success: true, message: 'Order Deleted!' });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while deleting the order.', error: error.message });
  }
});

// Update order by ID
router.put('/:id', async (req, res) => {
  try {
    const order = await Orders.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        pincode: req.body.pincode,
        amount: req.body.amount,
        paymentId: req.body.paymentId,
        email: req.body.email,
        userid: req.body.userid,
        products: req.body.products,
        status: req.body.status,
      },
      { new: true }
    );

    if (!order) {
      return res.status(500).json({ message: 'Order cannot be updated!', success: false });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while updating the order.', error: error.message });
  }
});

module.exports = router;
