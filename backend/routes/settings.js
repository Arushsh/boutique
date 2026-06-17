const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// @route   GET /api/settings
// @desc    Get global site settings (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   PUT /api/settings
// @desc    Update global site settings
// @access  Private/Admin
router.put('/', auth, adminOnly, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }
    
    // Update fields if provided
    const fields = ['saleActive', 'saleHeadline', 'saleSubheadline', 'saleCtaText', 'saleImage'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
