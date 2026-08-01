const express = require('express');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

const SHIPPING_PRICE = 0; // free shipping — simple internship-level checkout

// @route   POST /api/orders
// @desc    Create an order from the current user's cart (simulated payment)
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      res.status(400);
      throw new Error('Complete shipping address is required');
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error('Your cart is empty');
    }

    const items = cart.items
      .filter((item) => item.product)
      .map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
      }));

    const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice,
      shippingPrice: SHIPPING_PRICE,
      totalPrice: itemsPrice + SHIPPING_PRICE,
      isPaid: paymentMethod !== 'COD',
      paidAt: paymentMethod !== 'COD' ? new Date() : undefined,
    });

    // Decrement stock (never below 0)
    await Promise.all(
      items.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -Math.min(item.quantity, 999999) },
        })
      )
    );
    await Product.updateMany({ stock: { $lt: 0 } }, { $set: { stock: 0 } });

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  })
);

// @route   GET /api/orders/myorders
// @desc    Get the logged-in user's order history
// @access  Private
router.get(
  '/myorders',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  })
);

// @route   GET /api/orders
// @desc    Get all orders (admin)
// @access  Private/Admin
router.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  })
);

// @route   GET /api/orders/:id
// @desc    Get a single order (owner or admin)
// @access  Private
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  })
);

// @route   PUT /api/orders/:id/status
// @desc    Update order status (admin)
// @access  Private/Admin
router.put(
  '/:id/status',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const allowed = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!allowed.includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = status;
    await order.save();
    res.json(order);
  })
);

module.exports = router;
