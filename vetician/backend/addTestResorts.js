const mongoose = require('mongoose');
require('dotenv').config();

const PetResort = require('./models/PetResort');

const TEST_RESORTS = [
  {
    userId: new mongoose.Types.ObjectId(), // Dummy user ID
    resortName: 'Green Paw Hostel',
    brandName: 'Green Paw',
    description: 'Premium pet boarding facility with 24/7 care and monitoring',
    logo: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&q=80',
    address: '123 Pet Street, Sector 15, Lucknow, UP 226001',
    resortPhone: '+91 9876543210',
    ownerPhone: '+91 9876543210',
    email: 'greenpaw@example.com',
    services: ['boarding_indoor', 'grooming', 'playground', 'veterinary'],
    facilities: ['ac_rooms', 'cctv', 'staff_24x7', 'outdoor_play'],
    openingHours: [
      { day: 'Monday', open: '08:00', close: '20:00', closed: false },
      { day: 'Tuesday', open: '08:00', close: '20:00', closed: false },
      { day: 'Wednesday', open: '08:00', close: '20:00', closed: false },
      { day: 'Thursday', open: '08:00', close: '20:00', closed: false },
      { day: 'Friday', open: '08:00', close: '20:00', closed: false },
      { day: 'Saturday', open: '08:00', close: '20:00', closed: false },
      { day: 'Sunday', open: '08:00', close: '20:00', closed: false }
    ],
    holidays: 'Closed on Diwali and Holi',
    rules: 'Vaccination certificate required. Pets must be well-behaved.',
    gallery: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80'
    ],
    isVerified: true
  },
  {
    userId: new mongoose.Types.ObjectId(),
    resortName: 'Happy Tails Haven',
    brandName: 'Happy Tails',
    description: 'Cozy pet resort with spacious play areas and loving care',
    logo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
    address: '456 Animal Avenue, Gomti Nagar, Lucknow, UP 226010',
    resortPhone: '+91 9876543211',
    ownerPhone: '+91 9876543211',
    email: 'happytails@example.com',
    services: ['boarding_indoor', 'boarding_outdoor', 'swimming', 'cafe'],
    facilities: ['cctv', 'outdoor_play', 'training_area'],
    openingHours: [
      { day: 'Monday', open: '07:00', close: '21:00', closed: false },
      { day: 'Tuesday', open: '07:00', close: '21:00', closed: false },
      { day: 'Wednesday', open: '07:00', close: '21:00', closed: false },
      { day: 'Thursday', open: '07:00', close: '21:00', closed: false },
      { day: 'Friday', open: '07:00', close: '21:00', closed: false },
      { day: 'Saturday', open: '07:00', close: '21:00', closed: false },
      { day: 'Sunday', open: '07:00', close: '21:00', closed: false }
    ],
    holidays: 'Open all year round',
    rules: 'All pets welcome. Vaccination records must be shown.',
    gallery: [
      'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&q=80'
    ],
    isVerified: true
  },
  {
    userId: new mongoose.Types.ObjectId(),
    resortName: 'Paws & Relax Premium',
    brandName: 'Paws & Relax',
    description: 'Luxury pet resort with premium amenities and personalized care',
    logo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80',
    address: '789 Luxury Lane, Hazratganj, Lucknow, UP 226001',
    resortPhone: '+91 9876543212',
    ownerPhone: '+91 9876543212',
    email: 'pawsrelax@example.com',
    services: ['boarding_indoor', 'grooming', 'swimming', 'veterinary', 'cafe'],
    facilities: ['ac_rooms', 'cctv', 'staff_24x7', 'outdoor_play', 'training_area'],
    openingHours: [
      { day: 'Monday', open: '06:00', close: '22:00', closed: false },
      { day: 'Tuesday', open: '06:00', close: '22:00', closed: false },
      { day: 'Wednesday', open: '06:00', close: '22:00', closed: false },
      { day: 'Thursday', open: '06:00', close: '22:00', closed: false },
      { day: 'Friday', open: '06:00', close: '22:00', closed: false },
      { day: 'Saturday', open: '06:00', close: '22:00', closed: false },
      { day: 'Sunday', open: '06:00', close: '22:00', closed: false }
    ],
    holidays: 'None',
    rules: 'Premium service. All pets must have up-to-date vaccinations.',
    gallery: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80',
      'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&q=80'
    ],
    isVerified: true
  }
];

async function addTestResorts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing test resorts (optional)
    await PetResort.deleteMany({ resortName: { $in: TEST_RESORTS.map(r => r.resortName) } });
    console.log('🗑️  Cleared existing test resorts');

    // Insert test resorts
    const resorts = await PetResort.insertMany(TEST_RESORTS);
    console.log('✅ Test resorts added successfully:');
    
    resorts.forEach(resort => {
      console.log(`   - ${resort.resortName} (${resort.brandName})`);
      console.log(`     Address: ${resort.address}`);
      console.log(`     Services: ${resort.services.join(', ')}`);
      console.log(`     Verified: ${resort.isVerified}`);
      console.log('');
    });

    console.log(`✅ Total: ${resorts.length} pet resorts added`);

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addTestResorts();
