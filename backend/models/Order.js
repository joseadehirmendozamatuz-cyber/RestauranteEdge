const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menu_item_id: String,
  name:         String,
  quantity:     Number,
  unit_price:   Number,
  subtotal:     Number,
  notes:        String,
});

const orderSchema = new mongoose.Schema({
  table_number:  { type: Number, required: true },
  customer_name: { type: String, default: '' },
  items:         [orderItemSchema],
  notes:         { type: String, default: '' },
  total:         { type: Number, default: 0 },
  status:        { type: String, enum: ['pendiente','en_preparacion','lista','entregada','cancelada'], default: 'pendiente' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
