// models/Paravet.js
const mongoose = require('mongoose');

const paravetSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Personal Information (Nested)
  fullName: {
    value: { type: String, default: '' },
    verified: { type: Boolean, default: false }
  },
  
  mobileNumber: {
    value: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    otpVerified: { type: Boolean, default: false }
  },
  
  email: {
    value: { type: String, default: '' },
    verified: { type: Boolean, default: false }
  },
  
  city: {
    value: { type: String, default: '' }
  },
  
  serviceArea: {
    value: { type: String, default: '' }
  },
  
  emergencyContactName: {
    value: { type: String, default: '' }
  },
  
  emergencyContactNumber: {
    value: { type: String, default: '' }
  },
  
  // Documents (Nested)
  governmentIdUrl: {
    value: { type: String, default: '' }
  },
  
  certificationProofUrl: {
    value: { type: String, default: '' }
  },
  
  vetRecommendationUrl: {
    value: { type: String, default: '' }
  },
  
  profilePhotoUrl: {
    value: { type: String, default: '' }
  },
  
  // Experience & Skills (Nested)
  yearsOfExperience: {
    value: { type: String, default: '' }
  },
  
  areasOfExpertise: {
    value: [{ type: String }],
    default: []
  },
  
  languagesSpoken: {
    value: [{ type: String }],
    default: []
  },
  
  availabilityDays: {
    value: [{ type: String }],
    default: []
  },
  
  availabilityStartTime: {
    value: { type: String, default: '' }
  },
  
  availabilityEndTime: {
    value: { type: String, default: '' }
  },
  
  // Payment Details (Nested)
  paymentMethod: {
    value: { type: String, default: '' }
  },
  
  paymentValue: {
    value: { type: String, default: '' }
  },
  
  accountHolderName: {
    value: { type: String, default: '' }
  },
  
  pan: {
    value: { type: String, default: '' }
  },
  
  // Onboarding Status
  agreedToCodeOfConduct: {
    type: Boolean,
    default: false
  },
  
  trainingCompleted: {
    type: Boolean,
    default: false
  },
  
  quizPassed: {
    type: Boolean,
    default: false
  },
  
  onboardingStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  onboardingSubmittedAt: {
    type: Date
  },
  
  approvedAt: {
    type: Date
  },
  
  rejectedAt: {
    type: Date
  },
  
  rejectionReason: {
    type: String
  }
  
}, { 
  timestamps: true 
});

// Indexes for better query performance
paravetSchema.index({ userId: 1 });
paravetSchema.index({ 'mobileNumber.value': 1 });
paravetSchema.index({ 'email.value': 1 });
paravetSchema.index({ onboardingStatus: 1 });

module.exports = mongoose.model('Paravet', paravetSchema);
