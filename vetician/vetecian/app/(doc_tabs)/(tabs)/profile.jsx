import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Modal, TouchableWithoutFeedback, TextInput, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { signOut, veterinarianProfileData } from '../../../store/slices/authSlice';
import { User, Mail, Calendar, MapPin, Phone, LogOut, X, Stethoscope, Award, Briefcase, Edit, ArrowLeft, Camera, Check } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function VeterinarianProfile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = user?._id;
        const token = await AsyncStorage.getItem('token');
        console.log('🔍 Profile Debug - userId from Redux:', userId);
        console.log('🔍 Profile Debug - token:', token ? 'Found' : 'Not found');
        
        if (!userId) {
          console.log('❌ No userId found');
          setLoading(false);
          return;
        }
        
        const result = await dispatch(veterinarianProfileData()).unwrap();
        if (result.success) {
          setProfileData(result.data);
          const nameParts = result.data?.profile?.name?.split(' ') || [];
          setEditedName(nameParts.slice(1).join(' ') || '');
          setEditedPhone(user?.phone || '');
        } else {
          setProfileData(null);
        }
      } catch (error) {
        console.error('Error fetching veterinarian profile:', error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [dispatch, user]);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'userId', 'user', 'refreshToken']);
      dispatch({ type: 'auth/signOut' });
      router.replace('/(auth)/signin');
    } catch (error) {
      console.error('Logout error:', error);
      router.replace('/(auth)/signin');
    }
  };

  const handlePhotoChange = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setSaving(true);
        const token = await AsyncStorage.getItem('token');
        const API_URL = process.env.EXPO_PUBLIC_API_URL;
        
        const photoFormData = new FormData();
        
        if (Platform.OS === 'web') {
          const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();
          photoFormData.append('file', blob, 'photo.jpg');
        } else {
          photoFormData.append('file', {
            uri: result.assets[0].uri,
            name: 'photo.jpg',
            type: 'image/jpeg'
          });
        }
        
        const photoRes = await fetch(`${API_URL}/upload/image`, {
          method: 'POST',
          body: photoFormData,
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const photoData = await photoRes.json();
        
        if (photoRes.ok) {
          const updateRes = await fetch(`${API_URL}/auth/veterinarian-update`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: user._id,
              profilePhotoUrl: photoData.secure_url
            })
          });
          
          if (updateRes.ok) {
            Alert.alert('Success', 'Profile photo updated');
            const result = await dispatch(veterinarianProfileData()).unwrap();
            if (result.success) setProfileData(result.data);
          }
        }
        setSaving(false);
      }
    } catch (error) {
      console.error('Photo update error:', error);
      Alert.alert('Error', 'Failed to update photo');
      setSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      
      const updateData = {
        userId: user._id,
        name: editedName.trim()
      };
      
      const res = await fetch(`${API_URL}/auth/veterinarian-update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (res.ok) {
        const userRes = await fetch(`${API_URL}/users/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ phone: editedPhone.trim() })
        });
        
        Alert.alert('Success', 'Profile updated successfully');
        setEditMode(false);
        const result = await dispatch(veterinarianProfileData()).unwrap();
        if (result.success) setProfileData(result.data);
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const profileInfo = [
    { 
      icon: User, 
      label: 'Name', 
      value: editMode ? null : (profileData?.profile?.name?.split(' ').slice(1).join(' ') || 'Not provided'),
      editable: true
    },
    { icon: Mail, label: 'Email', value: user?.email || 'Not provided', editable: false },
    { 
      icon: Phone, 
      label: 'Phone', 
      value: editMode ? null : (user?.phone || 'Not provided'),
      editable: true
    },
    { icon: Stethoscope, label: 'Specialization', value: profileData?.profile?.specialization || 'Not provided', editable: false },
    { icon: Award, label: 'Qualification', value: profileData?.profile?.qualification || 'Not provided', editable: false },
    { icon: Briefcase, label: 'Experience', value: profileData?.profile?.experience || 'Not provided', editable: false },
    { icon: Calendar, label: 'Registration', value: profileData?.profile?.registration || 'Not registered yet', editable: false },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4E8D7C" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/(doc_tabs)/(tabs)')} style={styles.iconButton}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Profile</Text>
        {!editMode && profileData?.profile && (
          <TouchableOpacity 
            onPress={() => setEditMode(true)} 
            style={styles.iconButton}
          >
            <Edit size={24} color="#4E8D7C" />
          </TouchableOpacity>
        )}
        {editMode && (
          <TouchableOpacity 
            onPress={handleSaveChanges} 
            style={styles.iconButton}
            disabled={saving}
          >
            {saving ? <ActivityIndicator size="small" color="#4E8D7C" /> : <Check size={24} color="#4E8D7C" />}
          </TouchableOpacity>
        )}
        {!profileData?.profile && <View style={styles.iconButton} />}
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Status Banner - Only show if profile exists but isn't verified */}
        {profileData?.profile && !profileData.profile.isVerified && (
          <View style={styles.reviewBanner}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.reviewBannerText}>{profileData.status || 'Profile under review'}</Text>
              <Text style={styles.reviewBannerSubtext}>
                {profileData.message || 'Your profile is being reviewed by our team'}
              </Text>
            </View>
          </View>
        )}

        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {profileData?.profile?.profilePhotoUrl ? (
              <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                <Image
                  source={{ uri: profileData.profile.profilePhotoUrl }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
                {editMode && (
                  <TouchableOpacity style={styles.changePhotoBtn} onPress={handlePhotoChange} disabled={saving}>
                    <Camera size={16} color="#fff" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.avatar}>
                <User size={40} color="#4E8D7C" />
              </View>
            )}
          </View>
          <Text style={styles.name}>
            {profileData?.profile?.name || user?.name || 'Veterinarian'}
          </Text>
          {profileData?.profile?.specialization && (
            <Text style={styles.specialization}>{profileData.profile.specialization}</Text>
          )}
        </View>

        {/* Profile Information */}
        <View style={styles.content}>
          {/* Complete Profile Button if no profile data exists */}
          {!profileData?.profile && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.completeProfileButton}
                onPress={() => router.push('onboarding/veterinarian_detail')}
              >
                <Edit size={20} color="#4E8D7C" />
                <Text style={styles.completeProfileButtonText}>Complete Your Profile</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
            <View style={styles.infoContainer}>
              {profileInfo.map((info, index) => (
                <View key={index} style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <info.icon size={20} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{info.label}</Text>
                    {editMode && info.editable ? (
                      <TextInput
                        style={styles.infoInput}
                        value={info.label === 'Name' ? editedName : editedPhone}
                        onChangeText={info.label === 'Name' ? setEditedName : setEditedPhone}
                        placeholder={info.label}
                      />
                    ) : (
                      <Text style={styles.infoValue}>{info.value}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Clinics Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Associated Clinics</Text>
              <TouchableOpacity onPress={() => router.push('onboarding/clinic')}>
                <Text style={styles.addButtonText}>+ Add Clinic</Text>
              </TouchableOpacity>
            </View>

            {profileData?.clinics && profileData.clinics.length > 0 ? (
              <View style={styles.clinicsContainer}>
                {profileData.clinics.map((clinic, index) => (
                  <View key={index} style={styles.clinicCard}>
                    <View style={styles.clinicHeader}>
                      <Text style={styles.clinicName}>{clinic.clinicName}</Text>
                      {clinic.verified ? (
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedText}>✓ Verified</Text>
                        </View>
                      ) : (
                        <View style={styles.pendingBadge}>
                          <Text style={styles.pendingText}>⏳ Pending</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.clinicAddressContainer}>
                      <MapPin size={16} color="#666" />
                      <Text style={styles.clinicAddress}>{clinic.address}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyClinicsContainer}>
                <Text style={styles.emptyClinicsText}>No clinics registered yet</Text>
                <Text style={styles.emptyClinicsSubtext}>Add your clinic to start receiving appointments</Text>
                <TouchableOpacity
                  style={styles.addClinicButton}
                  onPress={() => router.push('onboarding/clinic')}
                >
                  <Text style={styles.addClinicButtonText}>Register Your Clinic</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.signOutButton]}
                onPress={handleSignOut}
              >
                <LogOut size={20} color="#ff3b30" />
                <Text style={[styles.actionText, styles.signOutText]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Image View Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setImageModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <Image 
              source={{ uri: profileData?.profile?.profilePhotoUrl }} 
              style={styles.fullImage} 
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.closeImageButton}
              onPress={() => setImageModalVisible(false)}
            >
              <X size={30} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  iconButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  loadingText: {
    marginTop: 20,
    color: '#4E8D7C',
    fontSize: 16
  },
  reviewBanner: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#E67C00',
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  reviewBannerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E67C00',
    marginBottom: 4,
  },
  reviewBannerSubtext: {
    fontSize: 14,
    color: '#E67C00',
    opacity: 0.8,
    lineHeight: 20
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4E8D7C20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4E8D7C',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4E8D7C',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 16,
    color: '#4E8D7C',
    fontWeight: '600',
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  addButtonText: {
    fontSize: 14,
    color: '#4E8D7C',
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  infoInput: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#4E8D7C',
    paddingVertical: 4,
  },
  changePhotoBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4E8D7C',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  completeProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4E8D7C20',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4E8D7C',
    gap: 10
  },
  completeProfileButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4E8D7C',
  },
  clinicsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  clinicCard: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  clinicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4E8D7C',
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingText: {
    fontSize: 12,
    color: '#E67C00',
    fontWeight: '600',
  },
  clinicAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  emptyClinicsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  emptyClinicsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  emptyClinicsSubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  addClinicButton: {
    backgroundColor: '#4E8D7C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addClinicButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  signOutButton: {
    borderColor: '#ff3b30',
    backgroundColor: '#ff3b3010',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4E8D7C',
    marginLeft: 12,
  },
  signOutText: {
    color: '#ff3b30',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  closeImageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
});