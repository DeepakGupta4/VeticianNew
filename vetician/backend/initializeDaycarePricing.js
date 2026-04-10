const mongoose = require('mongoose');
require('dotenv').config();

const DaycarePricing = require('./models/DaycarePricing');

const PRICING_PLANS = [
  {
    name: 'Boarding',
    duration: '24 hours',
    price: 900,
    description: 'Full day and night boarding with meals and care',
    order: 1,
    isActive: true
  },
  {
    name: 'Day Boarding',
    duration: '8 to 10 hours',
    price: 600,
    description: 'Daytime boarding with supervised activities',
    order: 2,
    isActive: true
  },
  {
    name: 'Day Park',
    duration: '1.5 to 2 hours',
    price: 400,
    description: 'Short playtime session at our park',
    order: 3,
    isActive: true
  },
  {
    name: 'Day School',
    duration: '26 days, 8 hours per day',
    price: 13650,
    description: 'Monthly package with full day training and care',
    order: 4,
    isActive: true
  },
  {
    name: 'Play School',
    duration: '26 days, 3 hours per day',
    price: 8650,
    description: 'Monthly package with half day activities',
    order: 5,
    isActive: true
  }
];

async function initializePricing() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing plans
    await DaycarePricing.deleteMany({});
    console.log('🗑️  Cleared existing pricing plans');

    // Insert new plans
    const plans = await DaycarePricing.insertMany(PRICING_PLANS);
    console.log('✅ Pricing plans initialized successfully:');
    
    plans.forEach(plan => {
      console.log(`   - ${plan.name}: ₹${plan.price} (${plan.duration})`);
    });

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initializePricing();
