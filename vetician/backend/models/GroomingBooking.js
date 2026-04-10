const mongoose = require('mongoose');

const groomingBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  groomerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paravet',
    default: null
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    enum: ['home', 'salon'],
    default: 'salon'
  },
  services: [{
    type: String
  }],
  addons: [{
    name: String,
    price: Number
  }],
  totalAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  address: {
    type: String
  },
  specialInstructions: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online', 'upi'],
    default: 'cash'
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'groomer', 'admin']
  },
  cancellationReason: {
    type: String
  },
  completedAt: {
    type: Date
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
groomingBookingSchema.index({ userId: 1, appointmentDate: 1 });
groomingBookingSchema.index({ groomerId: 1, appointmentDate: 1 });
groomingBookingSchema.index({ status: 1 });

module.exports = mongoose.model('GroomingBooking', groomingBookingSchema);
