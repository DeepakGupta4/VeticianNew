const mongoose = require('mongoose');

const groomingPricingSchema = new mongoose.Schema({
  weightCategory: {
    type: String,
    required: true,
    enum: ['0-10kg', '10-30kg', '30+kg']
  },
  shortHair: {
    type: Number,
    required: true
  },
  longHair: {
    type: Number,
    required: true
  },
  withHairTrim: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  includesNailTrimming: {
    type: Boolean,
    default: true
  },
  includesEarCleaning: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GroomingPricing', groomingPricingSchema);
