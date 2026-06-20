const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

// ── GET /api/products ────────────────────────────────────────────────────────
// Public — supports ?category=, ?search=, ?sort=, ?page=, ?limit=, ?featured=, ?hot=
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 20,
      featured,
      hot,
    } = req.query;

    const filter = { isActive: true };

    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (hot === 'true') filter.isHot = true;
    if (search) {
      filter.$text = { $search: search };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// ── GET /api/products/:id ────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

// ── POST /api/products ── Admin Only ─────────────────────────────────────────
router.post(
  '/',
  auth,
  adminOnly,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category')
      .isIn(['Dresses', 'Sets', 'Tops', 'Traditional', 'Outerwear', 'Bottoms', 'Accessories'])
      .withMessage('Invalid category'),
    body('image').notEmpty().withMessage('Image URL is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (req.body.image && req.body.image.startsWith('http') && !req.body.image.includes('res.cloudinary.com')) {
        try {
          const uploadResult = await cloudinary.uploader.upload(req.body.image, {
            folder: 'aura_boutique'
          });
          req.body.image = uploadResult.secure_url;
        } catch (uploadErr) {
          console.error('Failed to upload external URL to Cloudinary:', uploadErr);
          return res.status(400).json({ error: 'Failed to process the external image URL. Please ensure the link is a valid public image.' });
        }
      }

      const product = await Product.create(req.body);
      res.status(201).json({ product });
    } catch (err) {
      console.error('Create product error:', err);
      res.status(500).json({ error: 'Failed to create product.' });
    }
  }
);

// ── PUT /api/products/:id ── Admin Only ──────────────────────────────────────
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    // Prevent overwriting _id
    delete req.body._id;

    if (req.body.image && req.body.image.startsWith('http') && !req.body.image.includes('res.cloudinary.com')) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.body.image, {
          folder: 'aura_boutique'
        });
        req.body.image = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error('Failed to upload external URL to Cloudinary:', uploadErr);
        return res.status(400).json({ error: 'Failed to process the external image URL. Please ensure the link is a valid public image.' });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ product });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// ── DELETE /api/products/:id ── Admin Only ───────────────────────────────────
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    // Soft delete
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

module.exports = router;
