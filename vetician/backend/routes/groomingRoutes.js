const express = require('express');
const {
  getGroomingPricing,
  createGroomingPricing,
  updateGroomingPricing,
  deleteGroomingPricing,
  createGroomingBooking,
  getUserGroomingBookings,
  getAllGroomingBookings,
  getGroomerBookings,
  updateBookingStatus,
  addBookingReview
} = require('../controllers/groomingController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Pricing routes
router.get('/pricing', getGroomingPricing);
router.post('/pricing', auth, createGroomingPricing);
router.patch('/pricing/:id', auth, updateGroomingPricing);
router.delete('/pricing/:id', auth, deleteGroomingPricing);

// Booking routes
router.post('/bookings', createGroomingBooking);
router.get('/bookings/all', getAllGroomingBookings);
router.get('/bookings/user/:userId', getUserGroomingBookings);
router.get('/bookings/groomer/:groomerId', getGroomerBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.patch('/bookings/:id/review', addBookingReview);

module.exports = router;
