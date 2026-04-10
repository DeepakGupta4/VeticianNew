const mongoose = require('mongoose');
require('dotenv').config();

const SupportContact = require('./models/SupportContact');

async function initializeSupportContact() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if contact already exists
    const existingContact = await SupportContact.findOne();
    
    if (existingContact) {
      console.log('ℹ️  Support contact already exists:');
      console.log('   Phone:', existingContact.phone);
      console.log('   Email:', existingContact.email);
      console.log('   Address:', existingContact.address);
    } else {
      // Create new contact
      const contact = await SupportContact.create({
        phone: '+91 84484 61071',
        email: 'help@doggosheaven.org',
        address: 'Block J, VATIKA INDIA NEXT, Plot 11, near Vatika V\'lante, Sector 83, Gurugram, Haryana 122004',
        whatsappNumber: '+91 84484 61071',
        isActive: true
      });

      console.log('✅ Support contact created successfully:');
      console.log('   Phone:', contact.phone);
      console.log('   Email:', contact.email);
      console.log('   Address:', contact.address);
    }

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initializeSupportContact();
