import api from './api';

export const saveParavetProfile = async (userId, profileData) => {
  try {
    const payload = {
      fullName: profileData.personal?.name || profileData.name,
      email: profileData.personal?.email || profileData.email,
      phone: profileData.personal?.phone || profileData.phone,
      gender: profileData.personal?.gender,
      dateOfBirth: profileData.personal?.dateOfBirth,
      address: profileData.personal?.address,
      pinCode: profileData.personal?.pinCode,
      serviceArea: profileData.personal?.serviceArea,
      emergencyContact: profileData.personal?.emergencyContact
    };

    const response = await api.updateParavetProfile(userId, payload);
    return response;
  } catch (error) {
    console.error('Error saving paravet profile:', error);
    throw error;
  }
};

export const loadParavetProfile = async (userId) => {
  try {
    const response = await api.getParavetProfile(userId);
    return response.data;
  } catch (error) {
    console.error('Error loading paravet profile:', error);
    throw error;
  }
};
