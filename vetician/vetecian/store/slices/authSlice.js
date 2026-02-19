import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* =========================
    Helper Functions
========================= */
const getApiBaseUrl = () => {
  // ✅ Use local backend for faster response
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
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
    console.log('🔴 signOutUser thunk called');
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('🔍 Token before logout:', token ? 'Found' : 'Not found');
      
      const BASE_URL = getApiBaseUrl();
      
      if (token) {
        console.log('🔍 Calling backend logout API...');
        // Call backend logout API
        const headers = await getCommonHeaders(true);
        const response = await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ refreshToken: token })
        });
        console.log('🔍 Backend logout response:', response.status);
      }
      
      // Clear AsyncStorage
      console.log('🔍 Clearing AsyncStorage...');
      await AsyncStorage.multiRemove(['userId', 'token']);
      console.log('✅ AsyncStorage cleared');
      
      return true;
    } catch (error) {
      console.log('❌ Logout API error:', error);
      // Even if API fails, clear local storage
      await AsyncStorage.multiRemove(['userId', 'token']);
      console.log('✅ AsyncStorage cleared (fallback)');
      return true;
    }
  }
);

export const signInUser = createAsyncThunk(
  'auth/signIn',
  async ({ email, password, loginType }, { rejectWithValue }) => {
    try {
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(false); // No auth needed for login
      
      console.log('🔍 Making request to:', `${BASE_URL}/auth/login`);
      console.log('🔍 Request headers:', headers);
      
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        mode: 'cors',
        headers,
        body: JSON.stringify({ email, password, loginType }),
      });
      
      console.log('🔍 Response status:', res.status);
      console.log('🔍 Response headers:', Object.fromEntries(res.headers.entries()));
      
      const responseText = await res.text();
      console.log('🔍 Raw response:', responseText.substring(0, 200));
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${responseText}`);
      }
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.log('❌ JSON parse error:', parseError);
        throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}`);
      }
      
      if (data.user?._id) await AsyncStorage.setItem('userId', data.user._id);
      return data;
    } catch (error) {
      console.log('❌ Full error:', error);
      return rejectWithValue(error.message || 'Sign in failed');
    }
  }
);

export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async ({ name, email, password, role = 'vetician' }, { rejectWithValue }) => {
    try {
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(false); // No auth needed for signup
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const data = await res.json();
      if (data.user?._id) await AsyncStorage.setItem('userId', data.user._id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Sign up failed');
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
    Clinic Thunks
========================= */
export const getAllVerifiedClinics = createAsyncThunk(
  'auth/getAllVerifiedClinics',
  async (_, { rejectWithValue }) => {
    try {
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(false);
      const res = await fetch(`${BASE_URL}/auth/petparent/verified/all-clinic`, {
        method: 'POST',
        headers,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.data || [];
    } catch (error) {
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
      console.log('🔍 registerPet - userId:', userId);
      
      // Debug: Check current auth state
      const state = getState();
      console.log('🔍 registerPet - Auth state:', {
        isAuthenticated: state.auth.isAuthenticated,
        hasUser: !!state.auth.user,
        hasToken: !!state.auth.token
      });
      
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true); // ✅ Include auth token
      
      console.log('🔍 registerPet - Request headers:', Object.keys(headers));
      console.log('🔍 registerPet - Has Authorization header:', !!headers.Authorization);
      
      const res = await fetch(`${BASE_URL}/parents/pets`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...petData, userId }),
      });
      
      console.log('🔍 registerPet - Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log('❌ registerPet - Error response:', errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      const result = await res.json();
      console.log('✅ registerPet - Success:', result);
      return result;
    } catch (error) {
      console.log('❌ registerPet - Error:', error.message);
      return rejectWithValue(error.message || 'Pet registration failed');
    }
  }
);

export const getPetsByUserId = createAsyncThunk(
  'auth/getPetsByUserId',
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const BASE_URL = getApiBaseUrl();
      const headers = await getCommonHeaders(true); // ✅ Include auth token
      const res = await fetch(`${BASE_URL}/parents/pets/${userId}`, {
        headers,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.pets || [];
    } catch (error) {
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
  isLoading: false, // Make sure this starts as false
  error: null,
  signUpSuccess: false,
  userPets: { loading: false, error: null, data: [] },
  parentData: { loading: false, error: null, data: null },
  clinics: { loading: false, error: null, data: [] },
  verifiedClinics: { loading: false, error: null, data: [] },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      // Clear all auth state immediately
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.userPets = initialState.userPets;
      state.parentData = initialState.parentData;
      state.clinics = initialState.clinics;
      state.verifiedClinics = initialState.verifiedClinics;
      console.log('✅ Redux state cleared by synchronous signOut');
    },
    clearError: state => { state.error = null; },
    clearLoading: state => { 
      state.isLoading = false; 
      console.log('✅ Loading state cleared');
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      console.log('✅ Credentials set in Redux state');
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
        // ✅ Store token in AsyncStorage for API calls
        console.log('🔍 Login response token:', action.payload.token ? 'Present' : 'Missing');
        if (action.payload.token) {
          // Store token immediately and synchronously
          AsyncStorage.setItem('token', action.payload.token).then(() => {
            console.log('✅ Token stored in AsyncStorage successfully');
          }).catch(err => {
            console.log('❌ Failed to store token:', err);
          });
        } else {
          console.log('❌ No token in login response');
        }
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        // ✅ Store token in AsyncStorage for API calls
        console.log('🔍 Signup response token:', action.payload.token ? 'Present' : 'Missing');
        if (action.payload.token) {
          // Store token immediately and synchronously
          AsyncStorage.setItem('token', action.payload.token).then(() => {
            console.log('✅ Token stored in AsyncStorage successfully');
          }).catch(err => {
            console.log('❌ Failed to store token:', err);
          });
        } else {
          console.log('❌ No token in signup response');
        }
      })
      .addCase(signOutUser.fulfilled, (state) => {
        // Clear all auth state
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.userPets = initialState.userPets;
        state.parentData = initialState.parentData;
        state.clinics = initialState.clinics;
        state.verifiedClinics = initialState.verifiedClinics;
        console.log('✅ User signed out and backend notified');
      })
      .addCase(getPetsByUserId.fulfilled, (state, action) => {
        state.userPets.loading = false;
        state.userPets.data = action.payload;
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

export const { clearError, clearLoading, setCredentials } = authSlice.actions;
export { signOutUser as signOut }; // Export signOutUser as signOut for backend integration
export default authSlice.reducer;