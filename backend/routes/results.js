const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const auth = require('../middleware/auth');

// GET today's live result (public)
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).replace(/ /g, '-');

    let result = await Result.findOne({ date: today });
    if (!result) {
      // Return empty slots
      result = {
        date: today,
        results: Array.from({ length: 8 }, (_, i) => ({ bazi: i + 1, open: '', close: '' })),
        isLive: false
      };
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET old results (public) - last 30 days
router.get('/old', async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 }).limit(30);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all results (admin)
router.get('/', auth, async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create result (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { date, results, isLive } = req.body;
    let existing = await Result.findOne({ date });
    if (existing) {
      existing.results = results;
      existing.isLive = isLive ?? existing.isLive;
      await existing.save();
      return res.json(existing);
    }
    const result = new Result({ date, results, isLive: isLive ?? false });
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update result (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE result (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
