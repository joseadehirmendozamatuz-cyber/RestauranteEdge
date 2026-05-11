const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true },
  category:    { type: String, enum: ['entradas','platos_fuertes','postres','bebidas','ensaladas','sopas'], default: 'entradas' },
  available:   { type: Boolean, default: true },
  image_url:   { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
