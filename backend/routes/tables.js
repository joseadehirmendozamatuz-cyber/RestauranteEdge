const router = require('express').Router();
const RestaurantTable = require('../models/RestaurantTable');

router.get('/', async (req, res) => {
  try {
    const tables = await RestaurantTable.find().sort({ number: 1 });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const table = new RestaurantTable(req.body);
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const table = await RestaurantTable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await RestaurantTable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mesa eliminada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
