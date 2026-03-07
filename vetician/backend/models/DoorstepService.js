const mongoose = require('mongoose');

const doorstepServiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: [
      // Clinical Care
      'Wound Care & Dressing',
      'Injection Administration (IV/IM/SC)',
      'Vaccination Support',
      'IV Fluid Therapy',
      'Catheter Placement',
      'Vital Signs Monitoring',
      'Emergency First Aid',
      'Medication Administration',
      // Diagnostic Support
      'Blood Collection',
      'Urine Sample Collection',
      'Lab Sample Handling',
      'X-ray Assistance',
      'Ultrasound Assistance',
      'ECG Assistance',
      'Basic Diagnostics',
      // Surgical Assistance
      'Pre-operative Preparation',
      'OT Assistance',
      'Post-operative Care',
      'Anesthesia Monitoring Support',
      'Sterilization & Instrument Handling',
      // Pet Care Services
      'Pet Grooming',
      'Nail Trimming',
      'Ear Cleaning',
      'Oral Hygiene Support',
      'Tick & Flea Treatment',
      'Deworming Support',
      // Home Visit Services
      'Home Vaccination',
      'Home Wound Dressing',
      'Home IV Therapy',
      'Elderly Pet Care Support',
      // Legacy services
      'Vet Home Visit',
      'Vaccination at Home',
      'Pet Training Session',
      'Physiotherapy',
      'Pet Walking'
    ]
  },
  petIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  }],
  servicePartnerId: {
    type: String,
    required: true
  },
  servicePartnerName: String,
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  repeatBooking: {
    type: Boolean,
    default: false
  },
  specialInstructions: String,
  paymentMethod: {
    type: String,
    enum: ['online', 'cash', 'card'],
    default: 'online'
  },
  couponCode: String,
  basePrice: {
    type: Number,
    required: true
  },
  emergencyCharge: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DoorstepService', doorstepServiceSchema);
