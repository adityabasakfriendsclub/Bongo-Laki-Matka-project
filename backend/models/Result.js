const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // e.g. "29-May-2026"
  results: [
    {
      bazi: { type: Number, required: true }, // 1–8
      open: { type: String, default: '' },    // 3-digit patti
      close: { type: String, default: '' },   // single digit
    }
  ],
  isLive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ResultSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Result', ResultSchema);
