import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* =========================
    Helper Functions
========================= */
// Helper to extract error message from HTML or JSON response
const parseErrorMessage = (responseText) => {
  // Try to parse as JSON first
  try {
    const json = JSON.parse(responseText);
    return json.message || json.error || 'An error occurred';
  } catch (e) {
    // If HTML, extract error message
    if (responseText.includes('<pre>')) {
      const match = responseText.match(/<pre>([^<]+)<\/pre>/);
      if (match && match[1]) {
        // Extract just the error message, not the stack trace
        const errorLine = match[1].split('<br>')[0].replace('Error: ', '');
        return errorLine.trim();
      }
    }
    // Return original text if can't parse
    return responseText.substring(0, 100);
  }
};

const getApiBaseUrl = () => {
  // Priority: app.json extra config > .env > fallback
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
  console.log('🚀 API URL:', apiUrl);
  console.log('🔧 __DEV__:', __DEV__);
  return apiUrl;
};

// Debug helper function
export const debugAuthState = createAsyncThunk(
  'auth/debugAuthState',
  async (_, { getState }) => {
    const state = getState();
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');
    
    console.log('🔍=== AUTH DEBUG STATE ===');
    console.log('Redux State:', {
      isAuthenticated: state.auth.isAuthenticated,
      hasUser: !!state.auth.user,
      hasToken: !!state.auth.token,
      userId: state.auth.user?._id
    });
    console.log('AsyncStorage:', {
      userId: userId || 'Not found',
      token: token ? 'Found' : 'Not found'
    });
    console.log('🔍=== END DEBUG ===');
    
    return { userId, token, reduxState: state.auth };
  }
);

const getCommonHeaders = async (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (includeAuth) {
    // Try to get token from AsyncStorage first
    let token = await AsyncStorage.getItem('token');
    console.log('🔍 Token from AsyncStorage:', token ? 'Found' : 'Not found');
    
    // If no token in AsyncStorage, try to get from Redux store (fallback)
    if (!token) {
      try {
        // This is a fallback - ideally token should be in AsyncStorage
        const storedState = await AsyncStorage.getItem('persist:auth');
        if (storedState) {
          const parsedState = JSON.parse(storedState);
          token = parsedState.token ? JSON.parse(parsedState.token) : null;
          console.log('🔍 Token from Redux persist:', token ? 'Found' : 'Not found');
        }
      } catch (e) {
        console.log('❌ Error getting token from Redux persist:', e.message);
      }
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header added');
    } else {
      console.log('❌ No token found anywhere - user might not be logged in');
    }
  }
  
  return headers;
};

function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false;
  const d = new Date(dateString);
  return d instanceof Date && !isNaN(d);
}

/* =========================
    Authentication Thunks
========================= */

// Sign out thunk to handle async operations
export const signOutUser = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const BASE_URL = getApiBaseUrl();
      
      if (token) {
        const headers = await getCommonHeaders(true);
        await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ refreshToken: token })
        });
      }
      
      await AsyncStorage.multiRemove(['userId', 'token']);
      return true;
    } catch (error) {
      await AsyncStorage.multiRemove(['userId', 'token']);
      return true;
    }
  }
);

export const signInUser = createAsyncThunk(
  'auth/signIn',
  async ({ email, password, loginType }, { rejectWithValue }) => {
    try {
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(false);
      
      const requestBody = { email, password, loginType };
      
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        mode: 'cors',
        headers,
        body: JSON.stringify(requestBody),
      });
      
      const responseText = await res.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        return rejectWithValue('Server error. Please check your internet connection and try again.');
      }
      
      if (!res.ok) {
        const errorMessage = parseErrorMessage(responseText);
        return rejectWithValue(errorMessage);
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        return rejectWithValue('Unable to process server response');
      }
      
      if (data.user?._id) await AsyncStorage.setItem('userId', data.user._id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error. Please check your connection.');
    }
  }
);

export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async ({ name, email, phone, password, loginType }, { rejectWithValue }) => {
    try {
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(false);
      
      const requestBody = { name, email, phone, password, loginType };
      
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });
      
      const responseText = await res.text();
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        return rejectWithValue('Server error. Please try again later.');
      }
      
      if (!res.ok) {
        const errorMessage = parseErrorMessage(responseText);
        return rejectWithValue(errorMessage);
      }
      
      const data = JSON.parse(responseText);
      
      if (data.user?._id) await AsyncStorage.setItem('userId', data.user._id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error. Please check your connection.');
    }
  }
);

/* =========================
    Parent Thunks
========================= */
export const parentUser = createAsyncThunk(
  'auth/parentUser',
  async (parentData, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');
      
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true);
      const res = await fetch(`${BASE_URL}/auth/parent-register`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...parentData, userId }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save parent data');
    }
  }
);

export const getParent = createAsyncThunk(
  'auth/getParent',
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      if (!userId) throw new Error('User ID is required');
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true);
      const res = await fetch(`${BASE_URL}/auth/parents/${userId}`, {
        headers,
      });
      
      if (res.status === 401) {
        const data = await res.json();
        if (data.code === 'TOKEN_EXPIRED') {
          await AsyncStorage.multiRemove(['token', 'userId']);
          dispatch({ type: 'auth/signOut' });
          throw new Error('Session expired. Please login again.');
        }
      }
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load parent data');
    }
  }
);

export const updateParent = createAsyncThunk(
  'auth/updateParent',
  async (parentData, { rejectWithValue, dispatch }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return rejectWithValue('User not authenticated');
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true);
      const res = await fetch(`${BASE_URL}/auth/parent/${userId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(parentData),
      });
      
      if (res.status === 401) {
        const data = await res.json();
        if (data.code === 'TOKEN_EXPIRED') {
          await AsyncStorage.multiRemove(['token', 'userId']);
          dispatch({ type: 'auth/signOut' });
          throw new Error('Session expired. Please login again.');
        }
      }
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update parent profile');
    }
  }
);

/* =========================
    Veterinarian Thunks
========================= */
export const veterinarianUser = createAsyncThunk(
  'auth/veterinarianUser',
  async (vetData, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');
      
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true);
      const res = await fetch(`${BASE_URL}/auth/veterinarian-register`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...vetData, userId }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save veterinarian data');
    }
  }
);

export const updateVeterinarianUser = createAsyncThunk(
  'auth/updateVeterinarianUser',
  async (vetData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth.user?._id || await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');
      
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true);
      const res = await fetch(`${BASE_URL}/auth/veterinarian-update`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ...vetData, userId }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update veterinarian data');
    }
  }
);

export const veterinarianProfileData = createAsyncThunk(
  'auth/veterinarianProfileData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth.user?._id || await AsyncStorage.getItem('userId');
      
      if (!userId) throw new Error('User not authenticated');
      
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true);
      const res = await fetch(`${BASE_URL}/auth/veterinarian/${userId}`, {
        method: 'GET',
        headers,
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch veterinarian data');
    }
  }
);

/* =========================
    Clinic Thunks
========================= */
export const registerClinic = createAsyncThunk(
  'auth/registerClinic',
  async (clinicData, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');
      
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true);
      const res = await fetch(`${BASE_URL}/auth/register-clinic`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...clinicData, userId }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        const errorMessage = parseErrorMessage(errorText);
        return rejectWithValue({ error: { message: errorMessage } });
      }
      
      return await res.json();
    } catch (error) {
      return rejectWithValue({ error: { message: error.message || 'Failed to register clinic' } });
    }
  }
);

export const getAllVerifiedClinics = createAsyncThunk(
  'auth/getAllVerifiedClinics',
  async (locationParams = {}, { rejectWithValue }) => {
    try {
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(false);
      
      console.log('🚀 Redux: getAllVerifiedClinics called with params:', locationParams);
      
      // Build query string for location parameters
      let queryString = '';
      if (locationParams.userLat && locationParams.userLon) {
        queryString = `?userLat=${locationParams.userLat}&userLon=${locationParams.userLon}`;
        console.log('📍 Redux: Query string built:', queryString);
      }
      
      const apiUrl = `${BASE_URL}/clinics/all${queryString}`;
      console.log('🌐 Redux: Making API call to:', apiUrl);
      
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers,
      });
      
      console.log('📡 Redux: API response status:', res.status);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const response = await res.json();
      console.log('✅ Clinics API Response:', response);
      console.log('✅ Clinics Data Array:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('❌ Redux: getAllVerifiedClinics error:', error);
      return rejectWithValue(error.message || 'Failed to load clinics');
    }
  }
);

/* =========================
    Pet Thunks
========================= */
export const registerPet = createAsyncThunk(
  'auth/pet',
  async (petData, { rejectWithValue, getState }) => {
    try {
      if (!petData.name || !petData.species || !petData.gender)
        throw new Error('Missing required information');
      
      const userId = await AsyncStorage.getItem('userId');
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true);
      
      const res = await fetch(`${BASE_URL}/parents/pets`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...petData, userId }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      const result = await res.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Pet registration failed');
    }
  }
);

export const getPetsByUserId = createAsyncThunk(
  'auth/getPetsByUserId',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true); // ✅ Include auth token
      const res = await fetch(`${BASE_URL}/parents/pets/${userId}`, {
        headers,
      });
      
      if (res.status === 401) {
        console.log('❌ Token expired - clearing auth');
        await AsyncStorage.multiRemove(['token', 'userId']);
        dispatch({ type: 'auth/signOut' });
        return [];
      }
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.pets || [];
    } catch (error) {
      console.log('❌ getPetsByUserId error:', error.message);
      return rejectWithValue(error.message || 'Failed to load pets');
    }
  }
);

export const updatePet = createAsyncThunk(
  'auth/updatePet',
  async ({ petId, petData }, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true);
      const res = await fetch(`${BASE_URL}/auth/users/${userId}/pets/${petId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(petData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update pet');
    }
  }
);

/* =========================
    Slice & Reducers (Same as before)
========================= */
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  signUpSuccess: false,
  userPets: { loading: false, error: null, data: [] },
  parentData: { loading: false, error: null, data: null },
  clinics: { loading: false, error: null, data: [] },
  verifiedClinics: { loading: false, error: null, data: [] },
  bookings: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      AsyncStorage.multiRemove(['token', 'userId', 'user', 'refreshToken']);
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.userPets = initialState.userPets;
      state.parentData = initialState.parentData;
      state.clinics = initialState.clinics;
      state.verifiedClinics = initialState.verifiedClinics;
    },
    clearError: state => { state.error = null; },
    clearLoading: state => { 
      state.isLoading = false;
    },
    clearUserPets: state => {
      state.userPets = initialState.userPets;
    },
    addBooking: (state, action) => {
      if (!state.bookings) {
        state.bookings = [];
      }
      state.bookings.push(action.payload);
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signInUser.pending, state => { state.isLoading = true; state.error = null; })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        if (action.payload.token) {
          AsyncStorage.setItem('token', action.payload.token);
        }
        if (action.payload.user?._id) {
          AsyncStorage.setItem('userId', action.payload.user._id);
        }
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (action.payload.token) {
          AsyncStorage.setItem('token', action.payload.token);
        }
        if (action.payload.user?._id) {
          AsyncStorage.setItem('userId', action.payload.user._id);
        }
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.userPets = initialState.userPets;
        state.parentData = initialState.parentData;
        state.clinics = initialState.clinics;
        state.verifiedClinics = initialState.verifiedClinics;
      })
      .addCase(getPetsByUserId.pending, (state) => {
        state.userPets.loading = true;
        state.userPets.error = null;
      })
      .addCase(getPetsByUserId.fulfilled, (state, action) => {
        state.userPets.loading = false;
        state.userPets.data = action.payload;
      })
      .addCase(getPetsByUserId.rejected, (state, action) => {
        state.userPets.loading = false;
        state.userPets.error = action.payload;
        state.userPets.data = [];
      })
      .addCase(updatePet.pending, (state) => {
        state.userPets.loading = true;
        state.userPets.error = null;
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        state.userPets.loading = false;
        // Update the specific pet in the array
        const updatedPet = action.payload.data?.pet || action.payload.pet;
        if (updatedPet) {
          const index = state.userPets.data.findIndex(pet => pet._id === updatedPet._id);
          if (index !== -1) {
            state.userPets.data[index] = updatedPet;
          }
        }
      })
      .addCase(updatePet.rejected, (state, action) => {
        state.userPets.loading = false;
        state.userPets.error = action.payload;
      })
      .addCase(getAllVerifiedClinics.pending, (state) => {
        if (!state.verifiedClinics) {
          state.verifiedClinics = { loading: false, error: null, data: [] };
        }
        state.verifiedClinics.loading = true;
        state.verifiedClinics.error = null;
      })
      .addCase(getAllVerifiedClinics.fulfilled, (state, action) => {
        if (!state.verifiedClinics) {
          state.verifiedClinics = { loading: false, error: null, data: [] };
        }
        state.verifiedClinics.loading = false;
        state.verifiedClinics.data = action.payload;
      })
      .addCase(getAllVerifiedClinics.rejected, (state, action) => {
        if (!state.verifiedClinics) {
          state.verifiedClinics = { loading: false, error: null, data: [] };
        }
        state.verifiedClinics.loading = false;
        state.verifiedClinics.error = action.payload;
      })
      .addCase(parentUser.pending, (state) => {
        state.parentData.loading = true;
        state.parentData.error = null;
      })
      .addCase(parentUser.fulfilled, (state, action) => {
        state.parentData.loading = false;
        state.parentData.data = action.payload;
      })
      .addCase(parentUser.rejected, (state, action) => {
        state.parentData.loading = false;
        state.parentData.error = action.payload;
      });
  },
});

export const { clearError, clearLoading, setCredentials, clearUserPets, addBooking } = authSlice.actions;
export { signOutUser as signOut }; // Export signOutUser as signOut for backend integration
export default authSlice.reducer;