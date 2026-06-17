require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boutique';

const products = [
  // New Arrivals
  { name: 'Sapphire Evening Gown', price: 450, category: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400', description: 'Stunning sapphire evening gown perfect for formal occasions.', stock: 15, isFeatured: true },
  { name: 'Silk Blend Co-ord', price: 280, category: 'Sets', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', description: 'Luxurious silk blend co-ordinate set for effortless style.', stock: 20 },
  { name: 'Embroidered Tunic', price: 150, category: 'Tops', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400', description: 'Delicately embroidered tunic with premium fabric.', stock: 30 },
  { name: 'Velvet Wrap Dress', price: 320, category: 'Dresses', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=400', description: 'Elegant velvet wrap dress for a sophisticated look.', stock: 12, isFeatured: true },
  { name: 'Organza Saree', price: 550, category: 'Traditional', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400', description: 'Premium organza saree with intricate border work.', stock: 8 },
  { name: 'Festive Lehenga', price: 890, category: 'Traditional', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', description: 'Exquisite festive lehenga for celebrations.', stock: 5, isFeatured: true },
  { name: 'Tailored Blazer', price: 220, category: 'Outerwear', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=400', description: 'Perfectly tailored blazer for a powerful look.', stock: 18 },
  { name: 'Pleated Midi Skirt', price: 140, category: 'Bottoms', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=400', description: 'Flowy pleated midi skirt in premium fabric.', stock: 25 },
  { name: 'Crystal Embellished Top', price: 190, category: 'Tops', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=400', description: 'Stunning crystal embellished top for evening wear.', stock: 10 },
  // Trending
  { name: 'Designer Blouse', price: 120, category: 'Tops', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400', description: 'Elegantly designed blouse for every occasion.', stock: 22, isFeatured: true },
  { name: 'Elegant Evening Top', price: 150, category: 'Tops', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=400', description: 'Chic evening top perfect for nights out.', stock: 16 },
  { name: 'Premium Silk Suit', price: 329, originalPrice: 350, category: 'Sets', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=400', description: 'Premium silk suit with sophisticated tailoring.', stock: 9, isHot: true },
  { name: 'Embroidered Gown', price: 430, category: 'Dresses', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=400', description: 'Heavily embroidered gown for grand occasions.', stock: 6 },
  // Accessories
  { name: 'Gold Link Necklace', price: 120, category: 'Accessories', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400', description: 'Elegant gold link necklace to complete your look.', stock: 35, sizes: ['One Size'] },
  { name: 'Leather Crossbody', price: 250, category: 'Accessories', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=400', description: 'Premium leather crossbody bag with gold accents.', stock: 14, sizes: ['One Size'] },
  { name: 'Pearl Drop Earrings', price: 85, category: 'Accessories', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400', description: 'Classic pearl drop earrings for timeless elegance.', stock: 40, sizes: ['One Size'] },
  { name: 'Silk Hair Scarf', price: 45, category: 'Accessories', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=400', description: 'Luxurious silk hair scarf in vibrant prints.', stock: 50, sizes: ['One Size'] },
  { name: 'Oversized Sunglasses', price: 180, category: 'Accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400', description: 'Chic oversized sunglasses with UV protection.', stock: 28, sizes: ['One Size'] },
  { name: 'Classic Leather Belt', price: 95, category: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400', description: 'Timeless leather belt in premium quality.', stock: 32, sizes: ['XS', 'S', 'M', 'L', 'XL'] },
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
