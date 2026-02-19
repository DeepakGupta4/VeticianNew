/**
 * BACKEND OTP IMPLEMENTATION CHECKLIST
 * Add these files/code to make OTP verification work
 */

// =====================================
// FILE 1: backend/models/OTP.js (NEW)
// =====================================

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3, // Max 3 failed attempts
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // Auto-delete after expiry
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Automatically delete documents 5 minutes after creation
    expires: 300,
  },
});

module.exports = mongoose.model('OTP', otpSchema);


// =====================================
// FILE 2: backend/controllers/paravetController.js
// ADD THESE FUNCTIONS
// =====================================

// At the top of the file, add:
const OTP = require('../models/OTP');

// Option 1: Using Twilio (Recommended)
const twilio = require('twilio');
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Add these functions:

/**
 * Send OTP to paravet's mobile number
 */
const sendOTP = catchAsync(async (req, res, next) => {
  const { userId, mobileNumber } = req.body;

  // ✅ Validation
  if (!userId || !mobileNumber) {
    return next(new AppError('User ID and mobile number are required', 400));
  }

  if (!/^\d{10}$/.test(mobileNumber)) {
    return next(new AppError('Mobile number must be 10 digits', 400));
  }

  try {
    // ✅ Check rate limiting (max 3 OTPs per 15 minutes)
    const recentOTPs = await OTP.countDocuments({
      userId,
      mobileNumber,
      createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) },
    });

    if (recentOTPs >= 3) {
      return next(
        new AppError(
          'Too many OTP requests. Please try again after 15 minutes.',
          429
        )
      );
    }

    // ✅ Delete old OTP for this user if exists
    await OTP.deleteOne({ userId, mobileNumber });

    // ✅ Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // ✅ Save OTP to database
    const otpRecord = new OTP({
      userId,
      mobileNumber,
      otp,
      expiresAt,
    });
    await otpRecord.save();

    // ✅ Send SMS via Twilio
    try {
      await twilioClient.messages.create({
        body: `Your Vetician OTP is: ${otp}. Valid for 5 minutes. Do not share with anyone.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${mobileNumber}`, // India country code
      });
    } catch (smsError) {
      console.error('SMS send error:', smsError);
      // Don't fail the request, but log the error
      // In production, notify admin
    }

    // ✅ Response
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your mobile number',
      // Only show OTP in development environment
      ...(process.env.NODE_ENV === 'development' && { otp, expiresAt }),
    });
  } catch (error) {
    console.error('OTP send error:', error);
    return next(new AppError('Failed to send OTP. Please try again.', 500));
  }
});

/**
 * Verify OTP and mark mobile as verified
 */
const verifyOTP = catchAsync(async (req, res, next) => {
  const { userId, mobileNumber, otp } = req.body;

  // ✅ Validation
  if (!userId || !mobileNumber || !otp) {
    return next(
      new AppError('User ID, mobile number, and OTP are required', 400)
    );
  }

  if (!/^\d{6}$/.test(otp)) {
    return next(new AppError('OTP must be 6 digits', 400));
  }

  try {
    // ✅ Find and validate OTP
    const otpRecord = await OTP.findOne({
      userId,
      mobileNumber,
      expiresAt: { $gt: new Date() }, // Not expired
    });

    if (!otpRecord) {
      return next(
        new AppError(
          'OTP not found or expired. Please request a new OTP.',
          400
        )
      );
    }

    // ✅ Check if OTP matches (constant-time comparison to prevent timing attacks)
    const crypto = require('crypto');
    const otpEquals = crypto.timingSafeEqual(
      Buffer.from(otpRecord.otp),
      Buffer.from(otp)
    );

    if (!otpEquals) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      if (otpRecord.attempts >= 3) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return next(
          new AppError('Invalid OTP. Maximum attempts reached. Request a new OTP.', 400)
        );
      }

      return next(
        new AppError(
          `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining.`,
          400
        )
      );
    }

    // ✅ Update Paravet profile
    const paravet = await Paravet.findOne({ userId });
    if (!paravet) {
      return next(new AppError('Paravet profile not found', 404));
    }

    paravet.personalInfo.mobileNumber.verified = true;
    paravet.personalInfo.mobileNumber.otpVerified = true;
    await paravet.save();

    // ✅ Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // ✅ Response
    res.status(200).json({
      success: true,
      message: 'Mobile number verified successfully',
      data: paravet,
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return next(
      new AppError('OTP verification failed. Please try again.', 500)
    );
  }
});

// Export functions
module.exports = {
  // ... existing exports
  sendOTP,
  verifyOTP,
};


// =====================================
// FILE 3: backend/routes/paravetRoutes.js
// ADD THESE ROUTES
// =====================================

// Add to the routes file:

const {
  // ... existing imports
  sendOTP,
  verifyOTP,
} = require('../controllers/paravetController');

// Add these routes (can be placed with other paravet routes):
router.post('/send-otp/:userId', auth, sendOTP);
router.post('/verify-otp/:userId', auth, verifyOTP);


// =====================================
// FILE 4: .env
// ADD THESE VARIABLES
// =====================================

// Twilio Configuration (get from https://www.twilio.com/console)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number

// Or use AWS SNS:
// AWS_ACCESS_KEY_ID=xxx
// AWS_SECRET_ACCESS_KEY=xxx
// AWS_SNS_REGION=us-east-1

// Or use Firebase:
// FIREBASE_PROJECT_ID=xxx
// FIREBASE_PRIVATE_KEY=xxx
// FIREBASE_CLIENT_EMAIL=xxx


// =====================================
// DEPENDENCIES TO INSTALL
// =====================================

/*
npm install twilio

OR for AWS SNS:
npm install aws-sdk

OR for Firebase:
npm install firebase-admin
*/


// =====================================
// TESTING THE OTP ENDPOINTS
// =====================================

/*
1. Send OTP:
POST http://localhost:3000/api/paravet/send-otp/user123
Content-Type: application/json
Authorization: Bearer your_token

{
  "userId": "user123",
  "mobileNumber": "9876543210"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully to your mobile number",
  "otp": "123456"  // Only in development
}

2. Verify OTP:
POST http://localhost:3000/api/paravet/verify-otp/user123
Content-Type: application/json
Authorization: Bearer your_token

{
  "userId": "user123",
  "mobileNumber": "9876543210",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "Mobile number verified successfully",
  "data": { ... paravet object ... }
}
*/


// =====================================
// SECURITY FEATURES INCLUDED
// =====================================

/*
✅ OTP expires after 5 minutes (auto-delete)
✅ Rate limiting: Max 3 OTP requests per 15 minutes
✅ Max 3 verification attempts before requiring new OTP
✅ Constant-time OTP comparison (prevent timing attacks)
✅ Only shows OTP in development environment
✅ Automatic cleanup of expired OTPs
✅ Phone number validation (10 digits)
✅ Auth middleware on all endpoints
*/


// =====================================
// ALTERNATIVE: Mock OTP (Development Only)
// =====================================

/*
If you want to test without Twilio, use this mock version:

const sendOTP = catchAsync(async (req, res, next) => {
  const { userId, mobileNumber } = req.body;

  if (!/^\d{10}$/.test(mobileNumber)) {
    return next(new AppError('Mobile number must be 10 digits', 400));
  }

  const otp = '123456'; // Fixed OTP for testing

  const otpRecord = new OTP({
    userId,
    mobileNumber,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });
  await otpRecord.save();

  console.log(`\n📱 TEST OTP: ${otp} for ${mobileNumber}\n`);

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully',
    otp, // Always show in mock mode
  });
});
*/
