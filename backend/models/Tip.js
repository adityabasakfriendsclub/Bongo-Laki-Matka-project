const mongoose = require('mongoose');

const TipSchema = new mongoose.Schema({
  date: { type: String, required: true },
  tips: [
    {
      bazi: { type: Number, required: true },
      open: { type: String, default: '' },
      close: { type: String, default: '' },
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TipSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Tip', TipSchema);
