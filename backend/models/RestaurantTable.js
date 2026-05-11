const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number:   { type: Number, required: true },
  capacity: { type: Number, required: true },
  status:   { type: String, enum: ['disponible','ocupada','reservada','mantenimiento'], default: 'disponible' },
  location: { type: String, enum: ['interior','terraza','bar','privado'], default: 'interior' },
}, { timestamps: true });

module.exports = mongoose.model('RestaurantTable', tableSchema);
