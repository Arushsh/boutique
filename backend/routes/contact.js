const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

// ── POST /api/contact ── Submit contact form (public) ────────────────────────
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('subject')
      .isIn(['order', 'styling', 'returns', 'other'])
      .withMessage('Invalid subject'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, subject, message } = req.body;
      const contact = await Contact.create({ name, email, subject, message });
      res.status(201).json({
        message: 'Your message has been received. We\'ll get back to you soon!',
        id: contact._id,
      });
    } catch (err) {
      console.error('Contact submit error:', err);
      res.status(500).json({ error: 'Failed to submit message.' });
    }
  }
);

// ── GET /api/contact ── List all messages (admin only) ───────────────────────
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { resolved, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (resolved === 'true') filter.resolved = true;
    if (resolved === 'false') filter.resolved = false;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));

    const [messages, total] = await Promise.all([
      Contact.find(filter)
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('resolvedBy', 'firstName lastName'),
      Contact.countDocuments(filter),
    ]);

    res.json({ messages, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// ── PUT /api/contact/:id/resolve ── Mark resolved (admin only) ───────────────
router.put('/:id/resolve', auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid message ID.' });
    }

    const { adminNotes } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        resolved: true,
        resolvedAt: new Date(),
        resolvedBy: req.user._id,
        ...(adminNotes && { adminNotes }),
      },
      { new: true }
    );

    if (!contact) return res.status(404).json({ error: 'Message not found.' });

    res.json({ contact });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve message.' });
  }
});

// ── DELETE /api/contact/:id ── Delete message (admin only) ───────────────────
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid message ID.' });
    }
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Message not found.' });
    res.json({ message: 'Message deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message.' });
  }
});

module.exports = router;
