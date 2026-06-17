const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // Global flag to toggle the sale banner
  saleActive: { type: Boolean, default: false },
  saleHeadline: { type: String, default: 'Mid-Season Boutique Sale' },
  saleSubheadline: { type: String, default: 'Enjoy Up To 50% Off Selected Collections' },
  saleCtaText: { type: String, default: 'Shop Sale' },
  saleImage: { type: String, default: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
