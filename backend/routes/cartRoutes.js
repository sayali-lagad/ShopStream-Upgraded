const express = require('express');
const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get the logged-in user's cart
// @access  Private
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out any items whose product was deleted
    cart.items = cart.items.filter((item) => item.product);

    res.json(cart);
  })
);

// @route   POST /api/cart
// @desc    Add an item to the cart (or increment quantity)
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400);
      throw new Error('productId is required');
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [{ product: productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  })
);

// @route   PUT /api/cart/:productId
// @desc    Update quantity of a cart item
// @access  Private
router.put(
  '/:productId',
  protect,
  asyncHandler(async (req, res) => {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400);
      throw new Error('Quantity must be at least 1');
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const item = cart.items.find((item) => item.product.toString() === req.params.productId);
    if (!item) {
      res.status(404);
      throw new Error('Item not in cart');
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  })
);

// @route   DELETE /api/cart/:productId
// @desc    Remove an item from the cart
// @access  Private
router.delete(
  '/:productId',
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);

    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  })
);

// @route   DELETE /api/cart
// @desc    Clear the entire cart
// @access  Private
router.delete(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  })
);

module.exports = router;
