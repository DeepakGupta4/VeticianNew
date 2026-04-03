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
  return process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';
};

// Fetch with timeout
const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
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
    const token = await AsyncStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
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
      
      const res = await fetchWithTimeout(`${BASE_URL}/auth/login`, {
        method: 'POST',
        mode: 'cors',
        headers,
        body: JSON.stringify({ email, password, loginType }),
      }, 8000); // Reduced from 15000 to 8000ms
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Login failed' }));
        return rejectWithValue(errorData.message || 'Invalid credentials');
      }
      
      const data = await res.json();
      
      // Store credentials in parallel
      if (data.user?._id && data.token) {
        await Promise.all([
          AsyncStorage.setItem('userId', data.user._id),
          AsyncStorage.setItem('token', data.token)
        ]);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async ({ name, email, phone, password, loginType }, { rejectWithValue }) => {
    try {
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(false);
      
      console.log('📤 SignUp Request:', { name, email, phone, loginType });
      
      const res = await fetchWithTimeout(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, email, phone, password, loginType }),
      }, 8000);
      
      console.log('📡 SignUp Response Status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Registration failed' }));
        console.log('❌ SignUp Error:', errorData);
        return rejectWithValue(errorData.message || 'Unable to create account');
      }
      
      const data = await res.json();
      console.log('✅ SignUp Success Response:', data);
      
      // Store credentials
      if (data.user?._id && data.token) {
        console.log('💾 Storing credentials:', { userId: data.user._id, hasToken: !!data.token });
        await Promise.all([
          AsyncStorage.setItem('userId', data.user._id),
          AsyncStorage.setItem('token', data.token)
        ]);
        console.log('✅ Credentials stored successfully');
      } else {
        console.log('⚠️ Missing user ID or token in response:', { hasUser: !!data.user, hasUserId: !!data.user?._id, hasToken: !!data.token });
      }
      
      return data;
    } catch (error) {
      console.log('❌ SignUp Exception:', error);
      return rejectWithValue(error.message || 'Network error');
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
      
      console.log('📋 Final clinic data being sent:', JSON.stringify(clinicData, null, 2));
      
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true);
      const res = await fetch(`${BASE_URL}/auth/register-clinic`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...clinicData, userId }),
      });
      
      const responseText = await res.text();
      console.log('📡 Backend response:', responseText);
      
      if (!res.ok) {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || 'Registration failed';
          console.log('❌ Parsed error:', errorData);
        } catch (e) {
          errorMessage = parseErrorMessage(responseText);
        }
        return rejectWithValue({ error: { message: errorMessage } });
      }
      
      return JSON.parse(responseText);
    } catch (error) {
      console.log('❌ Network error:', error);
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
    Pet Resort Thunks
========================= */
export const petResortDetail = createAsyncThunk(
  'auth/petResortDetail',
  async (resortData, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');
      
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true);
      const res = await fetch(`${BASE_URL}/resorts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...resortData, userId }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create pet resort');
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
      })
      .addCase(getParent.pending, (state) => {
        state.parentData.loading = true;
        state.parentData.error = null;
      })
      .addCase(getParent.fulfilled, (state, action) => {
        state.parentData.loading = false;
        state.parentData.data = action.payload;
      })
      .addCase(getParent.rejected, (state, action) => {
        state.parentData.loading = false;
        state.parentData.error = action.payload;
      })
      .addCase(updateParent.pending, (state) => {
        state.parentData.loading = true;
        state.parentData.error = null;
      })
      .addCase(updateParent.fulfilled, (state, action) => {
        state.parentData.loading = false;
        state.parentData.data = action.payload;
      })
      .addCase(updateParent.rejected, (state, action) => {
        state.parentData.loading = false;
        state.parentData.error = action.payload;
      });
  },
});

export const { clearError, clearLoading, setCredentials, clearUserPets, addBooking } = authSlice.actions;
export { signOutUser as signOut }; // Export signOutUser as signOut for backend integration
export default authSlice.reducer;