const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

// ── POST /api/orders ── Place an order (auth required) ───────────────────────
router.post(
  '/',
  auth,
  [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shippingAddress.firstName').notEmpty().withMessage('First name is required'),
    body('shippingAddress.lastName').notEmpty().withMessage('Last name is required'),
    body('shippingAddress.email').isEmail().withMessage('Valid email required'),
    body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { items, shippingAddress, paymentMethod = 'card', notes } = req.body;

      // Validate and enrich each item from DB
      const enrichedItems = [];
      let subtotal = 0;

      for (const item of items) {
        if (!mongoose.Types.ObjectId.isValid(item.productId)) {
          return res.status(400).json({ error: `Invalid product ID: ${item.productId}` });
        }

        const product = await Product.findById(item.productId);
        if (!product || !product.isActive) {
          return res.status(404).json({ error: `Product not found: ${item.productId}` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            error: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
          });
        }

        enrichedItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: item.quantity,
          size: item.size || 'One Size',
        });

        subtotal += product.price * item.quantity;

        // Decrement stock
        await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
      }

      const shippingCost = 15;
      const total = subtotal + shippingCost;

      const order = await Order.create({
        user: req.user._id,
        items: enrichedItems,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        status: 'confirmed',
        subtotal,
        shippingCost,
        total,
        notes,
      });

      await order.populate('user', 'firstName lastName email');

      res.status(201).json({ order });
    } catch (err) {
      console.error('Create order error:', err);
      res.status(500).json({ error: 'Failed to place order.' });
    }
  }
);

// ── GET /api/orders/my ── User's own orders ──────────────────────────────────
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt')
      .populate('items.product', 'name image');

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// ── GET /api/orders ── All orders (admin only) ────────────────────────────────
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('user', 'firstName lastName email'),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// ── GET /api/orders/:id ── Single order (admin or owner) ─────────────────────
router.get('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID.' });
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name image category');

    if (!order) return res.status(404).json({ error: 'Order not found.' });

    // Only admin or the order owner can view
    if (
      req.user.role !== 'admin' &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
});

// ── PUT /api/orders/:id/status ── Admin Only ─────────────────────────────────
router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID.' });
    }

    const { status, trackingNumber } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (status === 'cancelled') {
      // Restore stock on cancellation
      const order = await Order.findById(req.params.id);
      if (order && order.status !== 'cancelled') {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }
      }
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('user', 'firstName lastName email');

    if (!order) return res.status(404).json({ error: 'Order not found.' });

    res.json({ order });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// ── GET /api/orders/stats/summary ── Admin dashboard stats ───────────────────
router.get('/stats/summary', auth, adminOnly, async (req, res) => {
  try {
    const [totalOrders, totalRevenue, pendingOrders, deliveredOrders] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' }),
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      deliveredOrders,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

module.exports = router;
