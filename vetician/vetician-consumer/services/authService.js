import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_BASE_URL = "https://192.168.1.46:3000/api";

// const API_BASE_URL = "http://192.168.101.10:3000/api";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.46:3000/api';
// Helper function to handle API responses
const handleResponse = async (response) => {
  console.log('🌐 FRONTEND - API Response status:', response.status, response.statusText);
  console.log('🌐 FRONTEND - API Response headers:', Object.fromEntries(response.headers.entries()));
  
  let data;
  try {
    data = await response.json();
    console.log('📄 FRONTEND - API Response data:', data);
  } catch (jsonError) {
    console.log('❌ FRONTEND - Failed to parse JSON response:', jsonError);
    console.log('📄 FRONTEND - Raw response:', await response.text());
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    console.log('❌ FRONTEND - API Request failed with status:', response.status);
    console.log('❌ FRONTEND - Error message:', data.message || 'An error occurred');
    throw new Error(data.message || 'An error occurred');
  }

  console.log('✅ FRONTEND - API Request successful');
  return data;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🚀 FRONTEND - Making API request to:', url);
  console.log('📋 FRONTEND - Request options:', {
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body ? 'BODY_PROVIDED' : 'NO_BODY'
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (options.body) {
    try {
      const bodyData = JSON.parse(options.body);
      console.log('📤 FRONTEND - Request body data:', {
        ...bodyData,
        password: bodyData.password ? '***HIDDEN***' : undefined
      });
    } catch (e) {
      console.log('📤 FRONTEND - Request body (raw):', options.body);
    }
  }

  try {
    console.log('⏳ FRONTEND - Sending request...');
    const response = await fetch(url, config);
    console.log('📨 FRONTEND - Response received');
    return await handleResponse(response);
  } catch (error) {
    console.log('❌ FRONTEND - API Request error:', error);
    console.log('❌ FRONTEND - Error name:', error.name);
    console.log('❌ FRONTEND - Error message:', error.message);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.log('🌐 FRONTEND - Network error detected');
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

export const authAPI = {
  // Sign In
  signIn: async (email, password, loginType) => {
    console.log('🔐 FRONTEND - signIn called with params:', {
      email: email,
      password: password ? '***PROVIDED***' : 'MISSING',
      loginType: loginType
    });
    
    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, loginType }),
      });
      
      console.log('✅ FRONTEND - signIn successful:', {
        success: result.success,
        message: result.message,
        hasUser: !!result.user,
        hasToken: !!result.token,
        userRole: result.user?.role
      });
      
      return result;
    } catch (error) {
      console.log('❌ FRONTEND - signIn error:', error.message);
      throw error;
    }
  },

  // Sign Up
  signUp: async (name, email, password, role = 'user') => {
    console.log('📝 FRONTEND - signUp called with params:', {
      name: name,
      email: email,
      password: password ? '***PROVIDED***' : 'MISSING',
      role: role
    });
    
    try {
      const result = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
      
      console.log('✅ FRONTEND - signUp successful:', {
        success: result.success,
        message: result.message,
        hasUser: !!result.user,
        hasToken: !!result.token,
        userRole: result.user?.role
      });
      
      return result;
    } catch (error) {
      console.log('❌ FRONTEND - signUp error:', error.message);
      throw error;
    }
  },

  // Parent register
  parent: async (name, email, phone, address, gender, image, userId) => {
    return await apiRequest('/auth/parent-register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, address, gender, image, userId }),
    });
  },

  // Get parent data
  getParent: async (userId) => {
    return await apiRequest(`/auth/parents/${userId}`, {
      method: 'GET'
    });
  },

  // Update parent data
  updateParent: async (userId, parentData) => {
    return await apiRequest(`/auth/updateParent/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(parentData),
    });
  },

  // Veterinarian register
  veterinarian: async (
    title,
    name,
    gender,
    city,
    experience,
    specialization,
    profilePhotoUrl,
    qualification,
    qualificationUrl,
    registration,
    registrationUrl,
    identityProof,
    identityProofUrl
  ) => {
    try {
      // Get the userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        throw new Error('User not authenticated');
      }

      return await apiRequest('/auth/veterinarian-register', {
        method: 'POST',
        body: JSON.stringify({
          title,
          name,
          gender,
          city,
          experience,
          specialization,
          profilePhotoUrl,
          qualification,
          qualificationUrl,
          registration,
          registrationUrl,
          identityProof,
          identityProofUrl,
          userId: userId
        }),
      });
    } catch (error) {
      console.error('Error in veterinarian registration:', error);
      throw error; // Re-throw the error for handling in the calling function
    }
  },

  // Clinic register
  clinic: async (clinicData) => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error('User not authenticated');

    return await apiRequest('/auth/register-clinic', {
      method: 'POST',
      body: JSON.stringify({
        ...clinicData,
        userId
      }),
    });
  },

  // profile veterinarian
  profileVeterinarian: async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error('User not authenticated');

    return await apiRequest('/auth/veterinarian/profile-screen', {
      method: 'POST',
      body: JSON.stringify({
        userId
      }),
    });
  },

  // veterinarian check
  veterinarianCheck: async (userId) => {
    try {
      return await apiRequest('/auth/veterinarian/profile-screen', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error('Error checking verification:', error);
      throw error;
    }
  },

  // pet resort detail
  petResort: async (resortdetail) => {
    try {
      const userId = await AsyncStorage.getItem('userId')
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return await apiRequest('/auth/petresort/register', {
        method: 'POST',
        body: JSON.stringify({ ...resortdetail, userId }),
      });
    } catch (error) {
      console.error('Error checking verification:', error);
      throw error;
    }
  },

  // Pet register
  pet: async (petData) => {
    try {
      return await apiRequest('/auth/pet-register', {
        method: 'POST',
        body: JSON.stringify({
          ...petData
        }),
      });
    } catch (error) {
      console.error('Error in pet registration:', error);
      throw error; // Re-throw the error for handling in the calling function
    }
  },

  // Update Pet
  updatePet: async (petId, petData) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');

      return await apiRequest(`/auth/users/${userId}/pets/${petId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...petData
        }),
      });
    } catch (error) {
      console.error('Error updating pet:', error);
      throw error;
    }
  },

  // Add to authAPI object in authService.js
  getPetsByUserId: async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');

      return await apiRequest(`/auth/pets/user/${userId}`, {
        method: 'POST',  // Changed from POST to GET since you're fetching data
      });
    } catch (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }
  },

  // Verified clinics for pet parents
  getAllVerifiedClinics: async () => {
    return await apiRequest('/auth/petparent/verified/all-clinic', {
      method: 'POST',
    });
  },

  // Appointment Booking
  bookAppointment: async (bookingData) => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error('User not authenticated');

    return await authService.apiRequest('/auth/petparent/appointments/book', {
      method: 'POST',
      body: JSON.stringify({
        ...bookingData,
        userId
      }),
    });
  },

  // Refresh Token
  refreshToken: async (refreshToken) => {
    return await apiRequest('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  // Logout
  logout: async (token, refreshToken) => {
    return await apiRequest('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ refreshToken }),
    });
  },

  // Logout from all devices
  logoutAll: async (token) => {
    return await apiRequest('/auth/logout-all', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Get User Profile
  getProfile: async (token) => {
    return await apiRequest('/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Update Profile
  updateProfile: async (token, userData) => {
    return await apiRequest('/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  },

  // Change Password
  changePassword: async (token, currentPassword, newPassword) => {
    return await apiRequest('/user/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Delete Account
  deleteAccount: async (token) => {
    return await apiRequest('/user/account', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Health Check
  healthCheck: async () => {
    return await apiRequest('/health', {
      method: 'GET',
    });
  },

};

// Export API base URL for use in other parts of the app
export { API_BASE_URL };