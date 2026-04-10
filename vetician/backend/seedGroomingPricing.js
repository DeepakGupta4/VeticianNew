const mongoose = require('mongoose');
require('dotenv').config();

const GroomingPricing = require('./models/GroomingPricing');

const groomingData = [
  {
    weightCategory: '0-10kg',
    shortHair: 700,
    longHair: 900,
    withHairTrim: {
      min: 1700,
      max: 1900
    },
    includesNailTrimming: true,
    includesEarCleaning: true,
    isActive: true
  },
  {
    weightCategory: '10-30kg',
    shortHair: 800,
    longHair: 1000,
    withHairTrim: {
      min: 1800,
      max: 2000
    },
    includesNailTrimming: true,
    includesEarCleaning: true,
    isActive: true
  },
  {
    weightCategory: '30+kg',
    shortHair: 900,
    longHair: 1100,
    withHairTrim: {
      min: 1900,
      max: 2100
    },
    includesNailTrimming: true,
    includesEarCleaning: true,
    isActive: true
  }
];

async function seedGroomingPricing() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing grooming pricing...');
    await GroomingPricing.deleteMany({});

    // Insert new data
    console.log('📝 Inserting grooming pricing data...');
    const result = await GroomingPricing.insertMany(groomingData);
    
    console.log('✅ Successfully added grooming pricing:');
    result.forEach(item => {
      console.log(`   - ${item.weightCategory}: Short Hair ₹${item.shortHair}, Long Hair ₹${item.longHair}, With Trim ₹${item.withHairTrim.min}-${item.withHairTrim.max}`);
    });

    console.log('\n✨ Grooming pricing data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding grooming pricing:', error);
    process.exit(1);
  }
}

seedGroomingPricing();
