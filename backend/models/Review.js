const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true },
  comment: { type: String, required: true },
  images: [{ type: String }],
  isVerifiedPurchase: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product rating after review save
reviewSchema.post('save', async function () {
  const Product = mongoose.model('Product');
  const reviews = await mongoose.model('Review').find({ product: this.product, isApproved: true });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(this.product, {
    'ratings.average': Math.round(avg * 10) / 10,
    'ratings.count': reviews.length
  });
});

module.exports = mongoose.model('Review', reviewSchema);
