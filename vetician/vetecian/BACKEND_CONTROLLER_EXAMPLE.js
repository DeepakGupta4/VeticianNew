// controllers/paravetController.js
const Paravet = require('../models/Paravet');

/**
 * Update paravet profile with nested fields
 * PATCH /api/paravet/profile/:userId
 */
exports.updateParavetProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    // Build $set object for nested fields using dot notation
    const setObject = {};
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] && typeof updateData[key] === 'object' && !Array.isArray(updateData[key])) {
        // Handle nested objects (e.g., mobileNumber: { value: "123", verified: true })
        Object.keys(updateData[key]).forEach(nestedKey => {
          setObject[`${key}.${nestedKey}`] = updateData[key][nestedKey];
        });
      } else {
        // Handle simple fields
        setObject[key] = updateData[key];
      }
    });
    
    const updatedParavet = await Paravet.findByIdAndUpdate(
      userId,
      { $set: setObject },
      { new: true, runValidators: true }
    );
    
    if (!updatedParavet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Paravet not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: updatedParavet 
    });
    
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update profile' 
    });
  }
};

/**
 * Submit complete onboarding data
 * POST /api/paravet/onboarding/:userId
 */
exports.submitOnboarding = async (req, res) => {
  try {
    const { userId } = req.params;
    const onboardingData = req.body;
    
    // Build $set object for nested fields
    const setObject = {};
    
    Object.keys(onboardingData).forEach(key => {
      if (onboardingData[key] && typeof onboardingData[key] === 'object' && !Array.isArray(onboardingData[key])) {
        // Handle nested objects
        Object.keys(onboardingData[key]).forEach(nestedKey => {
          setObject[`${key}.${nestedKey}`] = onboardingData[key][nestedKey];
        });
      } else {
        // Handle simple fields
        setObject[key] = onboardingData[key];
      }
    });
    
    // Add onboarding metadata
    setObject['onboardingStatus'] = 'pending';
    setObject['onboardingSubmittedAt'] = new Date();
    
    const updatedParavet = await Paravet.findByIdAndUpdate(
      userId,
      { $set: setObject },
      { new: true, runValidators: true }
    );
    
    if (!updatedParavet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Paravet not found' 
      });
    }
    
    // TODO: Send notification email/SMS
    // await sendOnboardingNotification(updatedParavet);
    
    res.json({ 
      success: true, 
      message: 'Onboarding submitted successfully',
      data: updatedParavet 
    });
    
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to submit onboarding' 
    });
  }
};

/**
 * Get paravet dashboard data
 * GET /api/paravet/dashboard/:userId
 */
exports.getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const paravet = await Paravet.findById(userId);
    
    if (!paravet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Paravet not found' 
      });
    }
    
    // TODO: Fetch actual stats from database
    const dashboardData = {
      totalPatients: 0,
      upcomingAppointments: 0,
      completedVaccinations: 0,
      totalEarnings: 0,
      onboardingStatus: paravet.onboardingStatus || 'pending',
      recentActivities: []
    };
    
    res.json(dashboardData);
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard data' 
    });
  }
};

module.exports = {
  updateParavetProfile,
  submitOnboarding,
  getDashboard
};
