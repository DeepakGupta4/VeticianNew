# BACKEND ROUTE NEEDED - 404 Error Fix

## Problem
The endpoint `POST /api/paravet/onboarding/:userId` doesn't exist on your backend.

## Solution: Add This Route to Your Backend

### 1. Create/Update routes/paravetRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Import controller (create if doesn't exist)
const paravetController = require('../controllers/paravetController');

// POST - Submit onboarding
router.post('/paravet/onboarding/:userId', 
  authenticateToken, 
  paravetController.submitOnboarding
);

// PATCH - Update profile
router.patch('/paravet/profile/:userId', 
  authenticateToken, 
  paravetController.updateProfile
);

// GET - Dashboard
router.get('/paravet/dashboard/:userId', 
  authenticateToken, 
  paravetController.getDashboard
);

module.exports = router;
```

### 2. Create controllers/paravetController.js

```javascript
const Paravet = require('../models/Paravet');

// Submit onboarding
exports.submitOnboarding = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;
    
    console.log('Received onboarding for user:', userId);
    console.log('Data:', data);
    
    // Build $set object for nested fields
    const setObject = {};
    
    Object.keys(data).forEach(key => {
      if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
        Object.keys(data[key]).forEach(nestedKey => {
          setObject[`${key}.${nestedKey}`] = data[key][nestedKey];
        });
      } else {
        setObject[key] = data[key];
      }
    });
    
    setObject['onboardingStatus'] = 'pending';
    setObject['onboardingSubmittedAt'] = new Date();
    
    const paravet = await Paravet.findByIdAndUpdate(
      userId,
      { $set: setObject },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json({ 
      success: true, 
      message: 'Onboarding submitted successfully',
      data: paravet 
    });
    
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to submit onboarding' 
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;
    
    const setObject = {};
    
    Object.keys(data).forEach(key => {
      if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
        Object.keys(data[key]).forEach(nestedKey => {
          setObject[`${key}.${nestedKey}`] = data[key][nestedKey];
        });
      } else {
        setObject[key] = data[key];
      }
    });
    
    const paravet = await Paravet.findByIdAndUpdate(
      userId,
      { $set: setObject },
      { new: true, runValidators: true }
    );
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: paravet 
    });
    
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get dashboard
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
    
    res.json({
      totalPatients: 0,
      upcomingAppointments: 0,
      completedVaccinations: 0,
      totalEarnings: 0,
      onboardingStatus: paravet.onboardingStatus || 'pending',
      recentActivities: []
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
```

### 3. Register Routes in server.js/app.js

```javascript
const express = require('express');
const app = express();

// Body parser with increased limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import routes
const paravetRoutes = require('./routes/paravetRoutes');

// Register routes
app.use('/api', paravetRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 4. Create models/Paravet.js (if doesn't exist)

Use the schema from `BACKEND_SCHEMA_EXAMPLE.js` file I created earlier.

## Quick Test

After adding the route, test with:

```bash
curl -X POST http://localhost:5000/api/paravet/onboarding/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"fullName": {"value": "Test"}}'
```

Should return:
```json
{
  "success": true,
  "message": "Onboarding submitted successfully"
}
```

## Status
❌ Backend route missing - needs to be implemented
✅ Frontend ready and waiting
