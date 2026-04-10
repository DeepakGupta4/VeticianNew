const GroomingPricing = require('../models/GroomingPricing');
const GroomingBooking = require('../models/GroomingBooking');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

// Get all grooming pricing
const getGroomingPricing = catchAsync(async (req, res, next) => {
  const pricing = await GroomingPricing.find({ isActive: true }).sort({ weightCategory: 1 });

  res.status(200).json({
    success: true,
    count: pricing.length,
    pricing
  });
});

// Create grooming pricing (admin)
const createGroomingPricing = catchAsync(async (req, res, next) => {
  const { weightCategory, shortHair, longHair, withHairTrim } = req.body;

  // Check if pricing already exists for this weight category
  const existingPricing = await GroomingPricing.findOne({ weightCategory });
  if (existingPricing) {
    return next(new AppError('Pricing for this weight category already exists', 400));
  }

  const pricing = await GroomingPricing.create({
    weightCategory,
    shortHair,
    longHair,
    withHairTrim,
    includesNailTrimming: true,
    includesEarCleaning: true
  });

  res.status(201).json({
    success: true,
    message: 'Grooming pricing created successfully',
    pricing
  });
});

// Update grooming pricing (admin)
const updateGroomingPricing = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { shortHair, longHair, withHairTrim } = req.body;

  const pricing = await GroomingPricing.findByIdAndUpdate(
    id,
    { shortHair, longHair, withHairTrim },
    { new: true, runValidators: true }
  );

  if (!pricing) {
    return next(new AppError('Pricing not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Grooming pricing updated successfully',
    pricing
  });
});

// Delete grooming pricing (admin)
const deleteGroomingPricing = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const pricing = await GroomingPricing.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!pricing) {
    return next(new AppError('Pricing not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Grooming pricing deleted successfully'
  });
});

const createGroomingBooking = catchAsync(async (req, res, next) => {
  const { 
    userId, 
    petId, 
    groomerId,
    appointmentDate, 
    appointmentTime, 
    serviceType,
    services,
    addons,
    totalAmount,
    address,
    specialInstructions
  } = req.body;

  console.log('📥 Received booking request:', req.body);

  if (!userId || !petId || !appointmentDate || !appointmentTime) {
    console.log('❌ Missing required fields');
    return next(new AppError('User ID, Pet ID, appointment date and time are required', 400));
  }

  const booking = await GroomingBooking.create({
    userId,
    petId,
    groomerId,
    appointmentDate,
    appointmentTime,
    serviceType: serviceType || 'salon',
    services: services || [],
    addons: addons || [],
    totalAmount: totalAmount || 0,
    address,
    specialInstructions,
    status: 'pending'
  });

  console.log('✅ Booking created:', booking._id);

  await booking.populate('petId', 'name species breed');
  await booking.populate('userId', 'name email phone');
  if (groomerId) {
    await booking.populate('groomerId');
  }

  res.status(201).json({
    success: true,
    message: 'Grooming appointment booked successfully',
    booking
  });
});

// Get user's grooming bookings
const getUserGroomingBookings = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  console.log('📥 getUserGroomingBookings called for userId:', userId);

  const bookings = await GroomingBooking.find({ userId })
    .populate('petId', 'name species breed profilePic')
    .populate('groomerId')
    .sort('-appointmentDate');

  console.log('✅ Found', bookings.length, 'bookings for user', userId);
  if (bookings.length > 0) {
    console.log('📋 First booking:', bookings[0]._id, bookings[0].status);
  }

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings
  });
});

// Get all grooming bookings (Admin)
const getAllGroomingBookings = catchAsync(async (req, res, next) => {
  const bookings = await GroomingBooking.find({})
    .populate('petId', 'name species breed profilePic')
    .populate('userId', 'name email phone')
    .populate('groomerId')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings
  });
});

// Get groomer's bookings
const getGroomerBookings = catchAsync(async (req, res, next) => {
  const { groomerId } = req.params;

  const bookings = await GroomingBooking.find({ groomerId })
    .populate('petId', 'name species breed profilePic')
    .populate('userId', 'name phone')
    .sort('-appointmentDate');

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings
  });
});

// Update booking status
const updateBookingStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, cancellationReason, cancelledBy } = req.body;

  const updateData = { status };

  if (status === 'cancelled') {
    updateData.cancelledAt = new Date();
    updateData.cancellationReason = cancellationReason;
    updateData.cancelledBy = cancelledBy;
  }

  if (status === 'completed') {
    updateData.completedAt = new Date();
  }

  const booking = await GroomingBooking.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  )
    .populate('petId', 'name species breed')
    .populate('userId', 'name email phone');

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Booking status updated successfully',
    booking
  });
});

// Add rating and review
const addBookingReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { rating, review } = req.body;

  const booking = await GroomingBooking.findByIdAndUpdate(
    id,
    { rating, review },
    { new: true, runValidators: true }
  );

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Review added successfully',
    booking
  });
});

module.exports = {
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
};
