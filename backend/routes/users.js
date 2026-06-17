const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

// ── GET /api/users ── All users (admin only) ─────────────────────────────────
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName:  { $regex: search, $options: 'i' } },
        { email:     { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    res.json({ users, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// ── PUT /api/users/:id/role ── Promote/Demote (admin only) ───────────────────
router.put('/:id/role', auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    // Prevent self-demotion
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot change your own role.' });
    }

    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "user" or "admin".' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: '-password' }
    );

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

// ── PUT /api/users/:id/status ── Activate/Deactivate (admin only) ────────────
router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot deactivate your own account.' });
    }

    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, select: '-password' }
    );

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user status.' });
  }
});

// ── DELETE /api/users/:id ── Delete user (admin only) ────────────────────────
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

module.exports = router;
