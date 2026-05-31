const mongoose = require('mongoose');

const PattiSchema = new mongoose.Schema({
  headers: [String],
  rows: [[String]],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patti', PattiSchema);
