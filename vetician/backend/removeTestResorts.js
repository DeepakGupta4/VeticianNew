const mongoose = require('mongoose');
require('dotenv').config();

const PetResort = require('./models/PetResort');

const TEST_RESORT_NAMES = [
  'Green Paw Hostel',
  'Happy Tails Haven',
  'Paws & Relax Premium'
];

async function removeTestResorts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find test resorts
    const testResorts = await PetResort.find({ 
      resortName: { $in: TEST_RESORT_NAMES } 
    });

    console.log(`📋 Found ${testResorts.length} test resorts to remove:`);
    testResorts.forEach(resort => {
      console.log(`   - ${resort.resortName} (${resort.brandName})`);
    });

    // Delete test resorts
    const result = await PetResort.deleteMany({ 
      resortName: { $in: TEST_RESORT_NAMES } 
    });

    console.log(`\n🗑️  Removed ${result.deletedCount} test resorts`);

    // Show remaining resorts
    const remainingResorts = await PetResort.find();
    console.log(`\n📊 Remaining resorts in database: ${remainingResorts.length}`);
    
    if (remainingResorts.length > 0) {
      console.log('\nRemaining resorts:');
      remainingResorts.forEach(resort => {
        console.log(`   - ${resort.resortName} (Verified: ${resort.isVerified})`);
      });
    } else {
      console.log('   (No resorts remaining)');
    }

    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

removeTestResorts();
