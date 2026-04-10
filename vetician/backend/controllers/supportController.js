const SupportEnquiry = require('../models/SupportEnquiry');
const SupportContact = require('../models/SupportContact');

// Get support contact details
exports.getContactDetails = async (req, res) => {
  try {
    let contact = await SupportContact.findOne({ isActive: true });
    
    // If no contact exists, create default one
    if (!contact) {
      contact = await SupportContact.create({
        phone: '+91 84484 61071',
        email: 'help@doggosheaven.org',
        address: 'Block J, VATIKA INDIA NEXT, Plot 11, near Vatika V\'lante, Sector 83, Gurugram, Haryana 122004',
        whatsappNumber: '+91 84484 61071',
        isActive: true
      });
    }

    res.json({
      success: true,
      contact: {
        phone: contact.phone,
        email: contact.email,
        address: contact.address,
        whatsappNumber: contact.whatsappNumber || contact.phone
      }
    });
  } catch (error) {
    console.error('Error fetching contact details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact details',
      error: error.message
    });
  }
};

// Update support contact details (Admin only)
exports.updateContactDetails = async (req, res) => {
  try {
    const { phone, email, address, whatsappNumber } = req.body;
    
    let contact = await SupportContact.findOne({ isActive: true });
    
    if (!contact) {
      contact = new SupportContact({ phone, email, address, whatsappNumber, isActive: true });
    } else {
      contact.phone = phone || contact.phone;
      contact.email = email || contact.email;
      contact.address = address || contact.address;
      contact.whatsappNumber = whatsappNumber || contact.whatsappNumber;
    }
    
    await contact.save();

    res.json({
      success: true,
      message: 'Contact details updated successfully',
      contact
    });
  } catch (error) {
    console.error('Error updating contact details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact details',
      error: error.message
    });
  }
};

// Create new support enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = new SupportEnquiry(req.body);
    await enquiry.save();

    // Emit real-time event to admin
    const io = req.app.get('io');
    if (io) {
      io.to('support-admin').emit('new-support-enquiry', enquiry);
      console.log('📢 New support enquiry emitted to admins');
    }

    res.status(201).json({
      success: true,
      message: 'Support enquiry submitted successfully',
      enquiry
    });
  } catch (error) {
    console.error('Error creating support enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit support enquiry',
      error: error.message
    });
  }
};

// Get all enquiries (Admin)
exports.getAllEnquiries = async (req, res) => {
  try {
    const { status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const enquiries = await SupportEnquiry.find(filter)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .populate('userId', 'name email phone');

    const stats = {
      total: await SupportEnquiry.countDocuments(),
      open: await SupportEnquiry.countDocuments({ status: 'open' }),
      inProgress: await SupportEnquiry.countDocuments({ status: 'in-progress' }),
      resolved: await SupportEnquiry.countDocuments({ status: 'resolved' }),
      closed: await SupportEnquiry.countDocuments({ status: 'closed' })
    };

    res.json({
      success: true,
      enquiries,
      stats
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries',
      error: error.message
    });
  }
};

// Get user's enquiries
exports.getUserEnquiries = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const enquiries = await SupportEnquiry.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      enquiries
    });
  } catch (error) {
    console.error('Error fetching user enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user enquiries',
      error: error.message
    });
  }
};

// Update enquiry status
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updateData = { status };
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (status === 'resolved' || status === 'closed') {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = req.user?._id;
    }

    const enquiry = await SupportEnquiry.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('support-admin').emit('enquiry-status-updated', enquiry);
      console.log('📢 Enquiry status update emitted to admins');
    }

    res.json({
      success: true,
      message: 'Enquiry updated successfully',
      enquiry
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update enquiry',
      error: error.message
    });
  }
};

// Delete enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await SupportEnquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete enquiry',
      error: error.message
    });
  }
};
