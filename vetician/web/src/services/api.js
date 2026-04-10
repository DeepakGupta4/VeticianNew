const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

  getVerifiedVeterinarians() {
    return this.request('/auth/admin/verified', { method: 'POST' });
  }

  getUnverifiedVeterinarians() {
    return this.request('/auth/admin/unverified', { method: 'POST' });
  }

  verifyVeterinarianField(veterinarianId, fieldName) {
    return this.request(`/auth/verify/${veterinarianId}/${fieldName}`, { method: 'PATCH' });
  }

  /* =========================
     CLINIC
  ========================= */

  getVerifiedClinics() {
    return this.request('/auth/admin/verified/clinic', { method: 'POST' });
  }

  getUnverifiedClinics() {
    return this.request('/auth/admin/unverified/clinic', { method: 'POST' });
  }

  verifyClinic(clinicId) {
    return this.request(`/auth/admin/clinic/verify/${clinicId}`, { method: 'POST' });
  }

  /* =========================
     PET RESORT
  ========================= */

  getVerifiedPetResorts() {
    return this.request('/auth/admin/verified/petresort', { method: 'POST' });
  }

  getUnverifiedPetResorts() {
    return this.request('/auth/admin/unverified/petresort', { method: 'POST' });
  }

  verifyPetResort(resortId) {
    return this.request(`/auth/admin/petresort/verify/${resortId}`, { method: 'POST' });
  }

  unverifyPetResort(resortId) {
    return this.request(`/auth/admin/petresort/unverify/${resortId}`, { method: 'POST' });
  }

  /* =========================
     SUPPORT ENQUIRIES
  ========================= */

  getSupportEnquiries(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/support/enquiries${queryString ? `?${queryString}` : ''}`);
  }

  updateSupportEnquiryStatus(id, data) {
    return this.request(`/support/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  deleteSupportEnquiry(id) {
    return this.request(`/support/enquiries/${id}`, { method: 'DELETE' });
  }

  /* =========================
     GROOMING BOOKINGS
  ========================= */

  getAllGroomingBookings() {
    return this.request('/grooming/bookings/all');
  }

  updateGroomingBookingStatus(bookingId, status) {
    return this.request(`/grooming/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  /* =========================
     PARAVET VERIFICATION
  ========================= */

  getUnverifiedParavets() {
    return this.request('/paravet/admin/unverified');
  }

  verifyParavet(paravetId) {
    return this.request(`/paravet/admin/verify/${paravetId}`, {
      method: 'PATCH',
      body: JSON.stringify({ approvalStatus: 'approved' })
    });
  }

  rejectParavet(paravetId, reason) {
    return this.request(`/paravet/admin/verify/${paravetId}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        approvalStatus: 'rejected',
        rejectionReason: reason 
      })
    });
  }
}

export default new ApiService();
