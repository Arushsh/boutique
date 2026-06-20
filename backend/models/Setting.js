const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // Global flag to toggle the sale banner
  saleActive: { type: Boolean, default: false },
  saleHeadline: { type: String, default: 'Mid-Season Boutique Sale' },
  saleSubheadline: { type: String, default: 'Enjoy Up To 50% Off Selected Collections' },
  saleCtaText: { type: String, default: 'Shop Sale' },
  saleImage: { type: String, default: '/WhatsApp%20Image%202026-06-20%20at%206.29.51%20PM%20(1).jpeg' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
