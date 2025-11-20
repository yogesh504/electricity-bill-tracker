const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    applianceName: { type: String, required: true },
    units: { type: Number, required: true },
    costPerUnit: { type: Number, required: true },
    totalCost: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reading', readingSchema);
