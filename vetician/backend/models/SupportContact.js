const mongoose = require('mongoose');

const supportContactSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  whatsappNumber: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SupportContact', supportContactSchema);
