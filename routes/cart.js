const { Cart } = require('../models/cart');
const express = require('express');
const router = express.Router();


router.get(`/`, async (req, res) => {

    try {

        const cartList = await Cart.find(req.query);

        if (!cartList) {
            res.status(500).json({ success: false })
        }

        return res.status(200).json(cartList);

    } catch (error) {
        res.status(500).json({ success: false })
    }
});



router.post('/add', async (req, res) => {

    const cartItem = await Cart.find({productId:req.body.productId, user: req.body.userId});

    if(cartItem.length===0){
        let cartList = new Cart({
            productTitle: req.body.productTitle,
            image: req.body.image,
            rating: req.body.rating,
            price: req.body.price,
            quantity: req.body.quantity,
            subTotal: req.body.subTotal,
            productId: req.body.productId,
            user: req.body.userId,
            countInStock:req.body.countInStock,
        });
    
    
    
        if (!cartList) {
            res.status(500).json({
                error: err,
                success: false
            })
        }
    
    
        cartList = await cartList.save();
    
        res.status(201).json(cartList);
    }else{
        res.status(401).json({status:false,msg:"Product already added in the cart"})
    }

   

});


router.delete('/delete/:userId/:productId', async (req, res) => {
    const { userId, productId } = req.params;
  
    try {
      const cartItem = await Cart.findOneAndDelete({ userId, productId });
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      res.status(200).json({
        success: true,
        message: 'Product removed from the cart',
        cartItem
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove product from the cart', error });
    }
  });
  



  router.get('/get/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const cartItems = await Cart.find({ user :userId});

        if (!cartItems.length) {
            return res.status(404).json({ message: 'No cart items found for the given user ID.' });
        }

        return res.status(200).send(cartItems);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while fetching the cart items.', error });
    }
});




router.put('/:id', async (req, res) => {

    const cartList = await Cart.findByIdAndUpdate(
        req.params.id,
        {
            productTitle: req.body.productTitle,
            image: req.body.image,
            rating: req.body.rating,
            price: req.body.price,
            quantity: req.body.quantity,
            subTotal: req.body.subTotal,
            productId: req.body.productId,
            userId: req.body.userId
        },
        { new: true }
    )

    if (!cartList) {
        return res.status(500).json({
            message: 'Cart item cannot be updated!',
            success: false
        })
    }

    res.send(cartList);

})


module.exports = router;

