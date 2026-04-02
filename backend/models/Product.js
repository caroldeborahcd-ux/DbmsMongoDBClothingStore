const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String },
  images: [{ type: String }],
  variants: [{
    size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'] },
    color: { type: String },
    colorHex: { type: String },
    stock: { type: Number, default: 0 },
    sku: { type: String }
  }],
  tags: [{ type: String }],
  material: { type: String },
  gender: { type: String, enum: ['Men', 'Women', 'Unisex', 'Kids'] },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  totalStock: { type: Number, default: 0 }
}, { timestamps: true });

// Calculate total stock before saving
productSchema.pre('save', function (next) {
  this.totalStock = this.variants.reduce((sum, v) => sum + v.stock, 0);
  next();
});

module.exports = mongoose.model('Product', productSchema);
