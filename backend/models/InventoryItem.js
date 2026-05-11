const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name:          { type: String, required: true },
  quantity:      { type: Number, required: true },
  unit:          { type: String, enum: ['kg','litros','unidades','gramos','piezas'], default: 'unidades' },
  min_stock:     { type: Number, default: 0 },
  category:      { type: String, enum: ['carnes','verduras','frutas','lacteos','bebidas','secos','condimentos','otros'], default: 'otros' },
  cost_per_unit: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', inventorySchema);
