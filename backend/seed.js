require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique';

const products = [
  // New Arrivals
  { name: 'Jade Chevron Unstitched Suit', price: 450, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.51%20PM%20(2).jpeg', description: 'Stunning unstitched dress material with elegant embroidery.', stock: 15, isFeatured: true },
  { name: 'Black Floral Stud Earrings', price: 25, category: 'Accessories', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.51%20PM.jpeg', description: 'Beautiful floral stud earrings to match your traditional wear.', stock: 20 },
  { name: 'LSM Galleria Parian Dream', price: 350, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.52%20PM%20(1).jpeg', description: 'Exclusive LSM Galleria unstitched collection.', stock: 30 },
  { name: 'Jade Chevron Floral Suit', price: 320, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.52%20PM.jpeg', description: 'Elegant floral unstitched suit by Jade Chevron.', stock: 12, isFeatured: true },
  { name: 'Peach Geometric Motif Suit', price: 290, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.34%20PM%20(1).jpeg', description: 'Premium geometric printed unstitched suit.', stock: 8 },
  { name: 'Classic Unstitched Suit', price: 310, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.34%20PM.jpeg', description: 'Exquisite classic unstitched suit.', stock: 5, isFeatured: true },
  { name: 'Jade Bin Saeed Heavy Cotton Vol.19 Beige', price: 380, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.35%20PM%20(1).jpeg', description: 'Heavy cotton luxury collection by Jade Bin Saeed.', stock: 18 },
  { name: 'Arsala Amira Heavy Cotton Vol.13 Blue', price: 360, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.35%20PM.jpeg', description: 'Arsala Amira 100% cotton heavy luxury collection.', stock: 25 },
  { name: 'Jade Bin Saeed Heavy Cotton Vol.19 Blue', price: 380, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.36%20PM%20(1).jpeg', description: 'Heavy cotton luxury collection by Jade Bin Saeed.', stock: 10 },
  // Trending
  { name: 'Jade Bin Saeed Heavy Cotton Vol.19 Green', price: 380, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.36%20PM.jpeg', description: 'Heavy cotton luxury collection by Jade Bin Saeed.', stock: 22, isFeatured: true },
  { name: 'Hala Readymade Magenta Vol.23', price: 420, category: 'Sets', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.37%20PM%20(1).jpeg', description: 'Hala Bin Saeed readymade lawn collection.', stock: 16 },
  { name: 'Hala Readymade Navy Vol.23', price: 420, originalPrice: 450, category: 'Sets', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.37%20PM.jpeg', description: 'Hala Bin Saeed readymade lawn collection.', stock: 9, isHot: true },
  { name: 'Hala Readymade Teal Vol.23', price: 420, category: 'Sets', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.38%20PM%20(1).jpeg', description: 'Hala Bin Saeed readymade lawn collection.', stock: 6 },
  // Accessories
  { name: 'Hala Readymade Purple Vol.23', price: 420, category: 'Sets', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.38%20PM%20(2).jpeg', description: 'Hala Bin Saeed readymade lawn collection.', stock: 35, sizes: ['M', 'L', 'XL'] },
  { name: 'Hala Readymade Mustard Vol.23', price: 420, category: 'Sets', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.38%20PM.jpeg', description: 'Hala Bin Saeed readymade lawn collection.', stock: 14, sizes: ['M', 'L', 'XL'] },
  { name: 'Crimson Blue Floral Vol-02', price: 390, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.39%20PM%20(1).jpeg', description: 'Beautiful unstitched dress material by Crimson.', stock: 40 },
  { name: 'Crimson Maroon Floral Vol-02', price: 390, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.39%20PM.jpeg', description: 'Beautiful unstitched dress material by Crimson.', stock: 50 },
  { name: 'Crimson Pink Floral Vol-02', price: 390, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.40%20PM%20(1).jpeg', description: 'Beautiful unstitched dress material by Crimson.', stock: 28 },
  { name: 'Jade Chevron Cyan Cotton Vol.19', price: 380, category: 'Traditional', image: '/WhatsApp%20Image%202026-06-20%20at%206.29.40%20PM%20(2).jpeg', description: 'Exclusive heavy cotton collection by Jade Chevron.', stock: 32 },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'Aura',
      email: 'admin@auraboutique.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log(`👑 Admin created: ${admin.email} / Admin@123`);

    // Create a test user
    await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'Test@123',
      role: 'user',
    });
    console.log('👤 Test user created: jane@example.com / Test@123');

    // Seed products
    await Product.insertMany(products);
    console.log(`📦 Seeded ${products.length} products`);

    console.log('\n✨ Seed complete!\n');
    console.log('  Admin login:  admin@auraboutique.com / Admin@123');
    console.log('  User login:   jane@example.com / Test@123');
    console.log('  Admin panel:  http://localhost:5173/admin\n');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
