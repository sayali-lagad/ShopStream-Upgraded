const express = require('express');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { cloudinary, isConfigured } = require('../config/cloudinary');

const router = express.Router();

// Helper: upload a local file to Cloudinary if configured, else return local static path
const handleImageUpload = async (file) => {
  if (!file) return { image: '', imagePublicId: '' };

  if (isConfigured) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'shopstream/products',
    });
    fs.unlink(file.path, () => {}); // cleanup temp file
    return { image: result.secure_url, imagePublicId: result.public_id };
  }

  // Fallback: serve locally from /uploads
  return { image: `/uploads/${file.filename}`, imagePublicId: '' };
};

// @route   GET /api/products
// @desc    Get all products (supports search, category filter, pagination)
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { search, category, minPrice, maxPrice, featured, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));

    const [products, total, categories] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(query),
      Product.distinct('category'),
    ]);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      total,
      categories,
    });
  })
);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const { name, brand, description, price, category, stock, rating, featured } = req.body;

    if (!name || !price) {
      res.status(400);
      throw new Error('Name and price are required');
    }

    const { image, imagePublicId } = await handleImageUpload(req.file);

    const product = await Product.create({
      name,
      brand,
      description,
      price,
      category,
      stock,
      rating: rating === '' || rating === undefined ? undefined : rating,
      featured: featured === 'true' || featured === true,
      image,
      imagePublicId,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  })
);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  admin,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const { name, brand, description, price, category, stock, rating, featured } = req.body;

    if (req.file) {
      const { image, imagePublicId } = await handleImageUpload(req.file);
      // remove old cloudinary image if applicable
      if (isConfigured && product.imagePublicId) {
        cloudinary.uploader.destroy(product.imagePublicId).catch(() => {});
      }
      product.image = image;
      product.imagePublicId = imagePublicId;
    }

    product.name = name ?? product.name;
    product.brand = brand ?? product.brand;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;
    product.rating = rating === '' || rating === undefined ? product.rating : rating;
    if (featured !== undefined) product.featured = featured === 'true' || featured === true;

    const updated = await product.save();
    res.json(updated);
  })
);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (isConfigured && product.imagePublicId) {
      cloudinary.uploader.destroy(product.imagePublicId).catch(() => {});
    }

    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  })
);

module.exports = router;
