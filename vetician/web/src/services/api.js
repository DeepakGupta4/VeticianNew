// ✅ EXPO SAFE ENV
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend.onrender.com/api';

console.log('API_BASE_URL:', API_BASE_URL);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null;

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
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error.message);
      throw error;
    }
  }

  /* =========================
     VETERINARIAN
  ========================= */

  getVerifiedVeterinarians(filters = {}) {
    return this.request('/admin/verified', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  getUnverifiedVeterinarians() {
    return this.request('/admin/unverified', {
      method: 'POST',
    });
  }

  verifyVeterinarianField(veterinarianId, fieldName) {
    return this.request(`/verify/${veterinarianId}/${fieldName}`, {
      method: 'PATCH',
    });
  }

  /* =========================
     CLINIC
  ========================= */

  getVerifiedClinics(filters = {}) {
    return this.request('/admin/verified/clinic', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  getUnverifiedClinics() {
    return this.request('/admin/unverified/clinic', {
      method: 'POST',
    });
  }

  verifyClinic(clinicId) {
    return this.request(`/admin/clinic/verify/${clinicId}`, {
      method: 'POST',
    });
  }

  /* =========================
     PET RESORT
  ========================= */

  getVerifiedPetResorts(filters = {}) {
    return this.request('/admin/verified/petresort', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  getUnverifiedPetResorts() {
    return this.request('/admin/unverified/petresort', {
      method: 'POST',
    });
  }

  verifyPetResort(resortId) {
    return this.request(`/admin/petresort/verify/${resortId}`, {
      method: 'POST',
    });
  }

  unverifyPetResort(resortId) {
    return this.request(`/admin/petresort/unverify/${resortId}`, {
      method: 'POST',
    });
  }
}

export default new ApiService();
