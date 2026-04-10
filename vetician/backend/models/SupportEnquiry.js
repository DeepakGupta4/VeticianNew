const mongoose = require('mongoose');

const supportEnquirySchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: String,
  userEmail: String,
  userPhone: String,
  userRole: {
    type: String,
    enum: ['paravet', 'parent', 'veterinarian', 'admin']
  },
  issueType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  contactMethod: {
    type: String,
    enum: ['email', 'phone', 'whatsapp'],
    default: 'email'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  deviceInfo: {
    platform: String,
    version: String
  },
  adminNotes: String,
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate ticket ID before saving
supportEnquirySchema.pre('save', async function(next) {
  if (!this.ticketId) {
    const count = await mongoose.model('SupportEnquiry').countDocuments();
    this.ticketId = `TKT${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('SupportEnquiry', supportEnquirySchema);
