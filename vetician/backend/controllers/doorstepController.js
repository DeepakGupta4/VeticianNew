const DoorstepService = require('../models/DoorstepService');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Create doorstep service booking
exports.createBooking = catchAsync(async (req, res, next) => {
  const {
    userId,
    serviceType,
    petIds,
    paravetId,
    paravetName,
    appointmentDate,
    timeSlot,
    address,
    isEmergency,
    repeatBooking,
    specialInstructions,
    paymentMethod,
    couponCode,
    basePrice,
    emergencyCharge,
    discount,
    totalAmount,
    status
  } = req.body;

  if (!req.user || !req.user._id) {
    return next(new AppError('User not authenticated', 401));
  }

  console.log('📦 Creating booking for paravet:', paravetId);

  const booking = await DoorstepService.create({
    userId: req.user._id,
    serviceType,
    petIds,
    servicePartnerId: paravetId,
    servicePartnerName: paravetName,
    appointmentDate,
    timeSlot,
    address,
    isEmergency,
    repeatBooking,
    specialInstructions,
    paymentMethod,
    couponCode,
    basePrice,
    emergencyCharge,
    discount,
    totalAmount,
    status: status || 'pending'
  });

  const populatedBooking = await DoorstepService.findById(booking._id)
    .populate('petIds')
    .populate('userId', 'name email phone');

  const io = req.app.get('io');
  if (io) {
    io.to(`paravet-${paravetId}`).emit('booking:new', {
      booking: populatedBooking,
      message: 'New booking request received'
    });
    console.log('✅ Notification sent to paravet-' + paravetId);
  }

  res.status(201).json({
    success: true,
    data: populatedBooking
  });
});

// Get all bookings for a user
exports.getUserBookings = catchAsync(async (req, res, next) => {
  console.log('📝 Fetching bookings for user:', req.user._id);
  
  const bookings = await DoorstepService.find({ userId: req.user._id })
    .populate('petIds')
    .sort('-createdAt');

  console.log('✅ Found', bookings.length, 'bookings');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// Get all bookings for a paravet
exports.getParavetBookings = catchAsync(async (req, res, next) => {
  const { paravetId } = req.params;
  
  const bookings = await DoorstepService.find({ servicePartnerId: paravetId })
    .populate('petIds')
    .populate('userId', 'name email phone')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// Get single booking
exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await DoorstepService.findById(req.params.id)
    .populate('petIds')
    .populate('userId', 'name email phone');

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// Update booking status (accept/reject by paravet)
exports.updateBookingStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const booking = await DoorstepService.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate('petIds').populate('userId', 'name email phone');

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  const io = req.app.get('io');
  if (io) {
    io.to(`user-${booking.userId._id}`).emit('booking:statusUpdated', {
      bookingId: booking._id,
      status: booking.status,
      serviceType: booking.serviceType,
      paravetName: booking.servicePartnerName,
      message: status === 'accepted' ? 'Booking accepted' : 'Booking rejected'
    });
    console.log(`✅ Status update sent to user-${booking.userId._id}`);
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// Cancel booking
exports.cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await DoorstepService.findById(req.params.id);

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  if (booking.userId.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to cancel this booking', 403));
  }

  booking.status = 'cancelled';
  await booking.save();

  res.status(200).json({
    success: true,
    data: booking
  });
});
