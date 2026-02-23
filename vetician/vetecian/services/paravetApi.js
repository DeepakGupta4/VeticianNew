import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Transform flat form data to nested structure for API
 */
const transformToNestedFormat = (formData) => {
  const nested = {};
  
  const simpleFields = [
    'fullName', 'email', 'city', 'serviceArea', 
    'yearsOfExperience', 'paymentMethod', 'paymentValue',
    'accountHolderName', 'pan', 'emergencyContactName', 
    'emergencyContactNumber', 'availabilityStartTime', 'availabilityEndTime'
  ];
  
  simpleFields.forEach(field => {
    if (formData[field] !== undefined && formData[field] !== '') {
      nested[field] = { value: formData[field] };
    }
  });
  
  if (formData.mobileNumber) {
    nested.mobileNumber = {
      value: formData.mobileNumber,
      verified: formData.mobileVerified || false,
      otpVerified: formData.otpVerified || false
    };
  }
  
  const arrayFields = ['areasOfExpertise', 'languagesSpoken', 'availabilityDays'];
  
  arrayFields.forEach(field => {
    if (formData[field] && Array.isArray(formData[field])) {
      nested[field] = { value: formData[field] };
    }
  });
  
  const docFields = ['governmentIdUrl', 'certificationProofUrl', 'vetRecommendationUrl', 'profilePhotoUrl'];
  
  docFields.forEach(field => {
    if (formData[field]) {
      // Check if it's a base64 string (too large for request)
      if (formData[field].startsWith('data:image')) {
        // Send placeholder instead of full base64
        nested[field] = { value: 'uploaded', uploaded: true };
      } else {
        nested[field] = { value: formData[field] };
      }
    }
  });
  
  if (formData.agreedToCodeOfConduct !== undefined) {
    nested.agreedToCodeOfConduct = formData.agreedToCodeOfConduct;
  }
  
  if (formData.trainingCompleted !== undefined) {
    nested.trainingCompleted = formData.trainingCompleted;
  }
  
  if (formData.quizPassed !== undefined) {
    nested.quizPassed = formData.quizPassed;
  }
  
  return nested;
};

/**
 * Submit complete onboarding data
 */
export const submitParavetOnboarding = async (userId, formData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const nestedData = transformToNestedFormat(formData);
    
    console.log('Attempting to submit to backend...');
    console.log('API URL:', `${API_URL}/paravet/onboarding/${userId}`);
    
    const response = await fetch(`${API_URL}/paravet/onboarding/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nestedData)
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        // Backend endpoint doesn't exist - save locally as fallback
        console.warn('Backend endpoint not found. Saving data locally...');
        await AsyncStorage.setItem(`paravet_onboarding_${userId}`, JSON.stringify(nestedData));
        return { 
          success: true, 
          message: 'Data saved locally. Backend endpoint pending.',
          savedLocally: true 
        };
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit onboarding');
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    // If network error, save locally
    if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      console.warn('Network error. Saving data locally...');
      const nestedData = transformToNestedFormat(formData);
      await AsyncStorage.setItem(`paravet_onboarding_${userId}`, JSON.stringify(nestedData));
      return { 
        success: true, 
        message: 'Data saved locally. Will sync when backend is available.',
        savedLocally: true 
      };
    }
    
    console.error('Submission error:', error);
    throw error;
  }
};

/**
 * Update paravet profile
 */
export const updateParavetProfile = async (userId, formData) => {
  try {
    const token = await AsyncStorage.getItem('token');
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
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
};

/**
 * Get paravet dashboard data
 */
export const getParavetDashboard = async (userId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/paravet/dashboard/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Dashboard error:', error);
    throw error;
  }
};
