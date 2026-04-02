const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const seed = async () => {
  await connectDB();

  await User.deleteMany();
  await Category.deleteMany();
  await Product.deleteMany();

  console.log('🗑️  Cleared existing data...');

  // Seed admin user
  const admin = await User.create({ name: 'Admin User', email: 'admin@threads.com', password: 'admin123', role: 'admin' });
  await User.create({ name: 'Test Customer', email: 'customer@threads.com', password: 'customer123', role: 'customer' });
  console.log('👤 Users seeded');

  // Seed categories
  const categories = await Category.insertMany([
    { name: "Men's Wear", slug: 'mens-wear', description: 'Clothing for men', sortOrder: 1 },
    { name: "Women's Wear", slug: 'womens-wear', description: 'Clothing for women', sortOrder: 2 },
    { name: "Kids' Wear", slug: 'kids-wear', description: 'Clothing for kids', sortOrder: 3 },
    { name: 'Ethnic Wear', slug: 'ethnic-wear', description: 'Traditional Indian wear', sortOrder: 4 },
    { name: 'Activewear', slug: 'activewear', description: 'Sports and fitness wear', sortOrder: 5 },
    { name: 'Accessories', slug: 'accessories', description: 'Bags, belts, scarves', sortOrder: 6 }
  ]);
  console.log('📂 Categories seeded');

  // Seed products
  const products = [
    { name: 'Classic White Oxford Shirt', slug: 'classic-white-oxford-shirt', description: 'A timeless white Oxford shirt crafted from 100% premium cotton. Perfect for formal and casual occasions.', price: 1299, comparePrice: 1799, category: categories[0]._id, brand: 'Threads & Co', gender: 'Men', material: 'Cotton', isFeatured: true, tags: ['shirt', 'formal', 'cotton', 'white'], images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500'], variants: [{ size: 'S', color: 'White', colorHex: '#FFFFFF', stock: 15, sku: 'TWO-S-WHT' }, { size: 'M', color: 'White', colorHex: '#FFFFFF', stock: 25, sku: 'TWO-M-WHT' }, { size: 'L', color: 'White', colorHex: '#FFFFFF', stock: 20, sku: 'TWO-L-WHT' }, { size: 'XL', color: 'White', colorHex: '#FFFFFF', stock: 10, sku: 'TWO-XL-WHT' }] },
    { name: 'Slim Fit Chino Pants', slug: 'slim-fit-chino-pants', description: 'Versatile slim fit chino pants. Great for office wear and weekend outings alike.', price: 1599, comparePrice: 2199, category: categories[0]._id, brand: 'Threads & Co', gender: 'Men', material: 'Cotton Blend', isFeatured: true, tags: ['pants', 'chino', 'slim-fit'], images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500'], variants: [{ size: 'S', color: 'Khaki', colorHex: '#C3B091', stock: 12, sku: 'SCP-S-KHK' }, { size: 'M', color: 'Khaki', colorHex: '#C3B091', stock: 18, sku: 'SCP-M-KHK' }, { size: 'L', color: 'Navy', colorHex: '#001F5B', stock: 14, sku: 'SCP-L-NVY' }] },
    { name: 'Floral Wrap Dress', slug: 'floral-wrap-dress', description: 'A stunning floral wrap dress that flows beautifully. Perfect for brunches, dates, and garden parties.', price: 1899, comparePrice: 2699, category: categories[1]._id, brand: 'Threads & Co', gender: 'Women', material: 'Chiffon', isFeatured: true, tags: ['dress', 'floral', 'casual', 'summer'], images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500'], variants: [{ size: 'XS', color: 'Rose Floral', colorHex: '#FFB6C1', stock: 8, sku: 'FWD-XS-RSF' }, { size: 'S', color: 'Rose Floral', colorHex: '#FFB6C1', stock: 15, sku: 'FWD-S-RSF' }, { size: 'M', color: 'Rose Floral', colorHex: '#FFB6C1', stock: 12, sku: 'FWD-M-RSF' }] },
    { name: 'Women\'s Yoga Leggings', slug: 'womens-yoga-leggings', description: 'High-waist yoga leggings with moisture-wicking fabric. 4-way stretch for maximum flexibility.', price: 999, comparePrice: 1499, category: categories[4]._id, brand: 'ActiveFit', gender: 'Women', material: 'Polyester Spandex', tags: ['leggings', 'yoga', 'activewear', 'fitness'], images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500'], variants: [{ size: 'XS', color: 'Black', colorHex: '#000000', stock: 20, sku: 'WYL-XS-BLK' }, { size: 'S', color: 'Black', colorHex: '#000000', stock: 30, sku: 'WYL-S-BLK' }, { size: 'M', color: 'Navy', colorHex: '#001F5B', stock: 25, sku: 'WYL-M-NVY' }] },
    { name: 'Banarasi Silk Saree', slug: 'banarasi-silk-saree', description: 'Authentic Banarasi silk saree with intricate zari work. A timeless piece of Indian heritage.', price: 8999, comparePrice: 12999, category: categories[3]._id, brand: 'Heritage Looms', gender: 'Women', material: 'Pure Silk', isFeatured: true, tags: ['saree', 'silk', 'ethnic', 'banarasi', 'wedding'], images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500'], variants: [{ size: 'Free Size', color: 'Royal Blue', colorHex: '#002366', stock: 5, sku: 'BSS-FS-RBL' }, { size: 'Free Size', color: 'Deep Red', colorHex: '#8B0000', stock: 7, sku: 'BSS-FS-DRD' }] },
    { name: 'Kids Cartoon T-Shirt', slug: 'kids-cartoon-tshirt', description: 'Fun and comfortable cartoon print t-shirts for kids. Soft cotton, easy to wash.', price: 399, comparePrice: 599, category: categories[2]._id, brand: 'KidZone', gender: 'Kids', material: 'Cotton', tags: ['kids', 't-shirt', 'cartoon', 'casual'], images: ['https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=500'], variants: [{ size: 'XS', color: 'Yellow', colorHex: '#FFD700', stock: 25, sku: 'KCT-XS-YLW' }, { size: 'S', color: 'Yellow', colorHex: '#FFD700', stock: 20, sku: 'KCT-S-YLW' }, { size: 'M', color: 'Blue', colorHex: '#1E90FF', stock: 18, sku: 'KCT-M-BLU' }] },
    { name: 'Men\'s Running Shorts', slug: 'mens-running-shorts', description: 'Lightweight running shorts with built-in liner and zip pocket. Ideal for marathons and gym sessions.', price: 799, comparePrice: 1099, category: categories[4]._id, brand: 'ActiveFit', gender: 'Men', material: 'Polyester', tags: ['shorts', 'running', 'gym', 'activewear'], images: ['https://images.unsplash.com/photo-1556906781-9a412961a28b?w=500'], variants: [{ size: 'S', color: 'Black', colorHex: '#000000', stock: 22, sku: 'MRS-S-BLK' }, { size: 'M', color: 'Black', colorHex: '#000000', stock: 28, sku: 'MRS-M-BLK' }, { size: 'L', color: 'Grey', colorHex: '#808080', stock: 15, sku: 'MRS-L-GRY' }] },
    { name: 'Kurta Pajama Set', slug: 'kurta-pajama-set', description: 'Elegant cotton kurta pajama set with subtle embroidery. Perfect for festivals and casual ethnic events.', price: 1699, comparePrice: 2499, category: categories[3]._id, brand: 'Heritage Looms', gender: 'Men', material: 'Cotton', isFeatured: true, tags: ['kurta', 'ethnic', 'cotton', 'festival'], images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=500'], variants: [{ size: 'M', color: 'Off White', colorHex: '#FAF9F6', stock: 10, sku: 'KPS-M-OFW' }, { size: 'L', color: 'Cream', colorHex: '#FFFDD0', stock: 12, sku: 'KPS-L-CRM' }, { size: 'XL', color: 'Cream', colorHex: '#FFFDD0', stock: 8, sku: 'KPS-XL-CRM' }] }
  ];

  await Product.insertMany(products);
  console.log('👗 Products seeded');

  console.log('\n✅ Database seeded successfully!');
  console.log('📧 Admin: admin@threads.com / admin123');
  console.log('📧 Customer: customer@threads.com / customer123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
