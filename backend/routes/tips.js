const express = require('express');
const router = express.Router();
const Tip = require('../models/Tip');
const auth = require('../middleware/auth');

// GET tips by date (public)
router.get('/:date', async (req, res) => {
  try {
    const tip = await Tip.findOne({ date: req.params.date });
    if (!tip) {
      return res.json({
        date: req.params.date,
        tips: Array.from({ length: 8 }, (_, i) => ({ bazi: i + 1, open: '', close: '' }))
      });
    }
    res.json(tip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all tips (admin)
router.get('/', auth, async (req, res) => {
  try {
    const tips = await Tip.find().sort({ createdAt: -1 });
    res.json(tips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create/update tips (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { date, tips } = req.body;
    let existing = await Tip.findOne({ date });
    if (existing) {
      existing.tips = tips;
      await existing.save();
      return res.json(existing);
    }
    const tip = new Tip({ date, tips });
    await tip.save();
    res.status(201).json(tip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE tip (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Tip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
