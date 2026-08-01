const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    brand: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' }, // for cloudinary cleanup
    category: { type: String, default: 'General', trim: true },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    featured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
