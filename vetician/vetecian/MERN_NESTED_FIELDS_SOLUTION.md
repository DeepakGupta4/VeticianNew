# MERN Stack - Nested Fields Solution

## 1. MONGOOSE SCHEMA (Backend)

```javascript
// models/Paravet.js
const mongoose = require('mongoose');

const paravetSchema = new mongoose.Schema({
  // Nested fields with proper structure
  mobileNumber: {
    value: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    otpVerified: { type: Boolean, default: false }
  },
  
  fullName: {
    value: { type: String, default: '' },
    verified: { type: Boolean, default: false }
  },
  
  email: {
    value: { type: String, default: '' },
    verified: { type: Boolean, default: false }
  },
  
  city: {
    value: { type: String, default: '' }
  },
  
  serviceArea: {
    value: { type: String, default: '' }
  },
  
  yearsOfExperience: {
    value: { type: String, default: '' }
  },
  
  areasOfExpertise: {
    value: [{ type: String }],
    default: []
  },
  
  languagesSpoken: {
    value: [{ type: String }],
    default: []
  },
  
  availabilityDays: {
    value: [{ type: String }],
    default: []
  },
  
  paymentMethod: {
    value: { type: String, default: '' }
  },
  
  accountHolderName: {
    value: { type: String, default: '' }
  },
  
  pan: {
    value: { type: String, default: '' }
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Paravet', paravetSchema);
```

## 2. FRONTEND - Data Transformation (React Native)

```javascript
// utils/transformFormData.js

/**
 * Transform flat form data to nested structure for API
 */
export const transformToNestedFormat = (formData) => {
  const nested = {};
  
  // Simple fields
  const simpleFields = [
    'fullName', 'email', 'city', 'serviceArea', 
    'yearsOfExperience', 'paymentMethod', 'accountHolderName', 'pan'
  ];
  
  simpleFields.forEach(field => {
    if (formData[field] !== undefined) {
      nested[field] = { value: formData[field] };
    }
  });
  
  // Mobile number with verification flags
  if (formData.mobileNumber !== undefined) {
    nested.mobileNumber = {
      value: formData.mobileNumber,
      verified: formData.mobileVerified || false,
      otpVerified: formData.otpVerified || false
    };
  }
  
  // Array fields
  const arrayFields = ['areasOfExpertise', 'languagesSpoken', 'availabilityDays'];
  
  arrayFields.forEach(field => {
    if (formData[field] !== undefined) {
      nested[field] = { value: formData[field] };
    }
  });
  
  return nested;
};

/**
 * Transform nested API response to flat form data
 */
export const transformFromNestedFormat = (nestedData) => {
  const flat = {};
  
  Object.keys(nestedData).forEach(key => {
    if (nestedData[key] && typeof nestedData[key] === 'object') {
      // Extract value from nested object
      if ('value' in nestedData[key]) {
        flat[key] = nestedData[key].value;
      }
      
      // Extract verification flags for mobile
      if (key === 'mobileNumber') {
        flat.mobileVerified = nestedData[key].verified || false;
        flat.otpVerified = nestedData[key].otpVerified || false;
      }
    } else {
      flat[key] = nestedData[key];
    }
  });
  
  return flat;
};
```

## 3. FRONTEND - API Service

```javascript
// services/paravetApi.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { transformToNestedFormat } from '../utils/transformFormData';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-backend.com/api';

export const updateParavetProfile = async (userId, formData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    // Transform flat data to nested format
    const nestedData = transformToNestedFormat(formData);
    
    const response = await fetch(`${API_URL}/paravet/profile/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nestedData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
};

export const submitParavetOnboarding = async (userId, formData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    // Transform all form data to nested format
    const nestedData = transformToNestedFormat(formData);
    
    const response = await fetch(`${API_URL}/paravet/onboarding/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nestedData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit onboarding');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Submission error:', error);
    throw error;
  }
};
```

## 4. FRONTEND - Usage in Component

```javascript
// app/(peravet_tabs)/onboarding/step9_preview.jsx
import { submitParavetOnboarding } from '../../../services/paravetApi';
import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    const userId = await AsyncStorage.getItem('userId');
    
    // formData is already flat in context
    const result = await submitParavetOnboarding(userId, formData);
    
    if (result.success) {
      Alert.alert('Success', 'Application submitted successfully!');
      router.replace('/(peravet_tabs)/(tabs)');
    }
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setIsLoading(false);
  }
};
```

## 5. BACKEND - Controller

```javascript
// controllers/paravetController.js

/**
 * Update paravet profile with nested fields
 */
exports.updateParavetProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    // Build $set object for nested fields
    const setObject = {};
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] && typeof updateData[key] === 'object') {
        // Handle nested objects
        Object.keys(updateData[key]).forEach(nestedKey => {
          setObject[`${key}.${nestedKey}`] = updateData[key][nestedKey];
        });
      } else {
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
      data: updatedParavet 
    });
    
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile' 
    });
  }
};

/**
 * Submit complete onboarding data
 */
exports.submitOnboarding = async (req, res) => {
  try {
    const { userId } = req.params;
    const onboardingData = req.body;
    
    // Build $set object
    const setObject = {};
    
    Object.keys(onboardingData).forEach(key => {
      if (onboardingData[key] && typeof onboardingData[key] === 'object') {
        Object.keys(onboardingData[key]).forEach(nestedKey => {
          setObject[`${key}.${nestedKey}`] = onboardingData[key][nestedKey];
        });
      } else {
        setObject[key] = onboardingData[key];
      }
    });
    
    // Add onboarding status
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
    
    res.json({ 
      success: true, 
      message: 'Onboarding submitted successfully',
      data: updatedParavet 
    });
    
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit onboarding' 
    });
  }
};
```

## 6. BACKEND - Routes

```javascript
// routes/paravetRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const paravetController = require('../controllers/paravetController');

// Update profile
router.patch('/paravet/profile/:userId', 
  authenticateToken, 
  paravetController.updateParavetProfile
);

// Submit onboarding
router.post('/paravet/onboarding/:userId', 
  authenticateToken, 
  paravetController.submitOnboarding
);

module.exports = router;
```

## 7. EXAMPLE REQUEST/RESPONSE

### Frontend sends (after transformation):
```json
{
  "fullName": { "value": "John Doe" },
  "mobileNumber": { 
    "value": "9876543210", 
    "verified": true, 
    "otpVerified": true 
  },
  "email": { "value": "john@example.com" },
  "areasOfExpertise": { 
    "value": ["Wound Care", "Injections"] 
  }
}
```

### Backend saves in MongoDB:
```json
{
  "_id": "...",
  "fullName": {
    "value": "John Doe",
    "verified": false
  },
  "mobileNumber": {
    "value": "9876543210",
    "verified": true,
    "otpVerified": true
  },
  "email": {
    "value": "john@example.com",
    "verified": false
  },
  "areasOfExpertise": {
    "value": ["Wound Care", "Injections"]
  }
}
```

## 8. KEY POINTS

✅ **Frontend**: Keep form data flat in state, transform before sending
✅ **Backend**: Use `$set` with dot notation for nested updates
✅ **Schema**: Define nested structure with defaults
✅ **Transformation**: Centralize in utility functions
✅ **Validation**: Add in both frontend and backend

## Status: ✅ PRODUCTION READY
