const express = require('express');
const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/categories
// @desc    List all categories (with product counts)
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const countMap = counts.reduce((acc, c) => ({ ...acc, [c._id]: c.count }), {});

    res.json(
      categories.map((c) => ({
        _id: c._id,
        name: c.name,
        productCount: countMap[c.name] || 0,
      }))
    );
  })
);

// @route   POST /api/categories
// @desc    Create a category
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
      res.status(400);
      throw new Error('Category name is required');
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      res.status(400);
      throw new Error('Category already exists');
    }

    const category = await Category.create({ name: name.trim() });
    res.status(201).json(category);
  })
);

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  })
);

module.exports = router;
