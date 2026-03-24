import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ EXPO SAFE ENV
const API_BASE_URL = __DEV__
  ? (process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api')
  : (process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api');

console.log('API_BASE_URL:', API_BASE_URL);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // ✅ Get token from AsyncStorage
  async getToken() {
    try {
      return await AsyncStorage.getItem('token');
    } catch {
      return null;
    }
  }

  // ✅ Generic request
  async request(endpoint, options = {}) {
    const token = await this.getToken();
    console.log('🔑 Token for request:', token ? 'Token exists' : 'No token found');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401 && data.code === 'TOKEN_EXPIRED') {
          console.error('❌ Token expired, clearing storage');
          await AsyncStorage.multiRemove(['token', 'userId']);
          throw new Error('Session expired. Please login again.');
        }
        console.error('❌ API Response not OK:', response.status, data);
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error.message);
      throw error;
    }
  }

  // ✅ AXIOS-LIKE HELPERS
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /* =========================
     AUTH
  ========================= */

  login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  logout() {
    return AsyncStorage.removeItem('token');
  }

  /* =========================
     USER
  ========================= */

  getProfile() {
    return this.get('/users/profile');
  }

  updateProfile(data) {
    return this.patch('/users/profile', data);
  }

  changePassword(currentPassword, newPassword) {
    return this.patch('/users/change-password', { currentPassword, newPassword });
  }

  deleteAccount() {
    return this.delete('/users/account');
  }

  getDashboardStats() {
    return this.get('/users/dashboard-stats');
  }

  /* =========================
     PETS
  ========================= */

  createPet(data) {
    return this.post('/parents/pets', data);
  }

  getPets() {
    return this.get('/pets');
  }

  getPetsByUserId(userId) {
    return this.get(`/parents/pets/${userId}`);
  }

  /* =========================
     PARENTS
  ========================= */

  getParentById(userId) {
    return this.get(`/parents/${userId}`);
  }

  /* =========================
     DOORSTEP SERVICE
  ========================= */

  getDoorstepServices() {
    return this.get('/doorstep/services');
  }

  createDoorstepBooking(data) {
    return this.post('/doorstep', data);
  }

  getDoorstepBookings() {
    return this.get('/doorstep');
  }

  getParavetBookings(paravetId) {
    return this.get(`/doorstep/paravet/${paravetId}`);
  }

  getDoorstepBooking(id) {
    return this.get(`/doorstep/${id}`);
  }

  cancelDoorstepBooking(id) {
    return this.patch(`/doorstep/${id}/cancel`);
  }

  updateBookingStatus(id, status) {
    return this.put(`/doorstep/${id}/status`, { status });
  }

  getVerifiedParavets() {
    return this.get('/paravet/verified');
  }

  /* =========================
     PET WATCHING / SITTERS
  ========================= */

  getVerifiedSitters() {
    return this.get('/paravet/verified');
  }

  createPetWatchingBooking(data) {
    return this.post('/doorstep', data);
  }

  getPetWatchingBookings() {
    return this.get('/doorstep');
  }

  cancelPetWatchingBooking(id) {
    return this.patch(`/doorstep/${id}/cancel`);
  }

  /* =========================
     PARAVET PROFILE
  ========================= */

  updateParavetProfile(userId, data) {
    return this.patch(`/paravet/personal-info/${userId}`, data);
  }

  getParavetProfile(userId) {
    return this.get(`/paravet/profile/${userId}`);
  }

  /* =========================
     FILE UPLOAD
  ========================= */

  async uploadFile(file, documentType) {
    const token = await this.getToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  /* =========================
     APPOINTMENTS
  ========================= */

  getAppointments(filters = {}) {
    return this.post('/appointments', filters); // Adjust endpoint if needed
  }

  createAppointment(data) {
    return this.post('/appointments/create', data); // Adjust endpoint if needed
  }

  /* =========================
     PATIENTS
  ========================= */

  getPatients(filters = {}) {
    return this.post('/patients', filters); // Adjust endpoint
  }

  createPatient(data) {
    return this.post('/patients/create', data);
  }

  /* =========================
     VETERINARIAN / CLINIC / PET RESORT
     (Existing functions kept)
  ========================= */

  getVerifiedVeterinarians(filters = {}) {
    return this.post('/admin/verified', filters);
  }

  getUnverifiedVeterinarians() {
    return this.post('/admin/unverified');
  }

  verifyVeterinarianField(veterinarianId, fieldName) {
    return this.patch(`/verify/${veterinarianId}/${fieldName}`);
  }

  getVerifiedClinics(filters = {}) {
    return this.post('/admin/verified/clinic', filters);
  }

  getUnverifiedClinics() {
    return this.post('/admin/unverified/clinic');
  }

  verifyClinic(clinicId) {
    return this.post(`/admin/clinic/verify/${clinicId}`);
  }

  getAllVerifiedClinics(locationParams = {}) {
    // Build query string for location parameters
    let queryString = '';
    if (locationParams.userLat && locationParams.userLon) {
      queryString = `?userLat=${locationParams.userLat}&userLon=${locationParams.userLon}`;
    }
    
    return this.get(`/clinics/all${queryString}`);
  }

  getVerifiedPetResorts(filters = {}) {
    return this.post('/admin/verified/petresort', filters);
  }

  getUnverifiedPetResorts() {
    return this.post('/admin/unverified/petresort');
  }

  verifyPetResort(resortId) {
    return this.post(`/admin/petresort/verify/${resortId}`);
  }

  unverifyPetResort(resortId) {
    return this.post(`/admin/petresort/unverify/${resortId}`);
  }
}

export default new ApiService();
