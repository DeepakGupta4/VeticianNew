

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Modal, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { signOut, getParent, updateParent } from '../../../store/slices/authSlice';
import { User, Mail, MapPin, Phone, LogOut, X, Star, HelpCircle, PawPrint, Heart, Stethoscope, Calendar as CalendarIcon, Package, Users, BookOpen, Bell, Settings, Gift } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PetDetailModal from '../../../components/petparent/home/PetDetailModal';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { validateEmail } from '../../../utils/validation';

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [parentData, setParentData] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petModalVisible, setPetModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: 'male',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useSelector(state => state.auth);
  const pets = useSelector(state => state.auth?.userPets?.data || []);

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const result = await dispatch(getParent(userId)).unwrap();
          setParentData(result.parent[0]);
          if (result.parent[0]) {
            setFormData({
              name: result.parent[0].name || '',
              email: result.parent[0].email || user?.email || '',
              phone: result.parent[0].phone || '',
              address: result.parent[0].address || '',
              gender: result.parent[0].gender || 'male',
              image: result.parent[0].image ? { uri: result.parent[0].image } : null
            });
          }
        }
      } catch (error) {
        console.error('Error fetching parent data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, [dispatch, user]);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.multiRemove(['userId', 'token']);
      await dispatch(signOut()).unwrap();
      router.replace('/(auth)/signin');
    } catch (error) {
      console.log('❌ Sign out error:', error);
      await AsyncStorage.multiRemove(['userId', 'token']);
      router.replace('/(auth)/signin');
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const uploadToCloudinary = async (file) => {
    const fileExtension = file.uri.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
    const type = isImage ? 'image' : 'raw';

    try {
      const fileInfo = await FileSystem.getInfoAsync(file.uri, { size: true });
      if (!fileInfo.exists) throw new Error(`File not found: ${file.uri}`);
      if (fileInfo.size === 0) throw new Error('Empty file');

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name || `parent_upload_${Date.now()}.${fileExtension}`,
        type: isImage ? `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`
          : file.type || 'application/octet-stream'
      });
      formData.append('upload_preset', 'vetician');
      formData.append('cloud_name', 'dqwzfs4ox');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dqwzfs4ox/${type}/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[Cloudinary] UPLOAD FAILED:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need camera roll permissions to upload images');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setFormData(prev => ({
          ...prev,
          image: {
            uri: selectedAsset.uri,
            name: selectedAsset.fileName || `image_${Date.now()}.jpg`,
            type: 'image/jpeg'
          }
        }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async () => {
    setErrors({});
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Parent name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsUploading(true);
      let imageUrl = parentData?.image || null;

      if (formData.image && formData.image.uri !== parentData?.image) {
        const cloudinaryResponse = await uploadToCloudinary(formData.image);
        imageUrl = cloudinaryResponse.secure_url;
      }

      const result = await dispatch(updateParent({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        image: imageUrl
      })).unwrap();

      if (result.success) {
        Alert.alert(
          'Success',
          'Profile updated successfully!',
          [{ text: 'OK', onPress: () => {
            setEditModalVisible(false);
            const userId = AsyncStorage.getItem('userId');
            if (userId) {
              dispatch(getParent(userId));
            }
          }}]
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.message || 'An error occurred while updating profile');
    } finally {
      setIsUploading(false);
    }
  };

  const averageRating = 4.68;

  const menuItems = [
    {
      id: 'my-pets',
      icon: PawPrint,
      title: 'My Pets',
      subtitle: `${pets.length} registered`,
      onPress: () => router.push('/pets'),
      color: '#6366F1'
    },
    {
      id: 'appointments',
      icon: CalendarIcon,
      title: 'Appointments',
      onPress: () => router.push('/appointments'),
      color: '#EC4899'
    },
    {
      id: 'medical-records',
      icon: Stethoscope,
      title: 'Medical Records',
      onPress: () => router.push('/medical-records'),
      color: '#10B981'
    },
    {
      id: 'favorites',
      icon: Heart,
      title: 'Favorite Vets',
      onPress: () => router.push('/favorites'),
      color: '#EF4444'
    },
    {
      id: 'pet-care',
      icon: BookOpen,
      title: 'Pet Care Tips',
      onPress: () => router.push('/pet-care'),
      color: '#F59E0B'
    },
    {
      id: 'orders',
      icon: Package,
      title: 'Orders & Purchases',
      onPress: () => router.push('/orders'),
      color: '#8B5CF6'
    },
    {
      id: 'community',
      icon: Users,
      title: 'Pet Community',
      onPress: () => router.push('/community'),
      color: '#14B8A6'
    },
    {
      id: 'rewards',
      icon: Gift,
      title: 'Rewards & Points',
      subtitle: 'Get special offers',
      onPress: () => router.push('/rewards'),
      color: '#F59E0B'
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      onPress: () => router.push('/notifications'),
      color: '#6366F1'
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: 'Help & Support',
      onPress: () => router.push('/help'),
      color: '#64748B'
    },
    {
      id: 'settings',
      icon: Settings,
      title: 'Settings',
      onPress: () => router.push('/settings'),
      color: '#64748B'
    },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card - Click to open Profile Details */}
        <View style={styles.profileCard}>
          <TouchableOpacity 
            style={styles.profileHeader}
            onPress={() => router.push('ProfileDetails')}
          >
            <View style={styles.profileLeft}>
              {parentData?.image ? (
                <Image
                  source={{ uri: parentData.image }}
                  style={styles.profileAvatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profileAvatarPlaceholder}>
                  <User size={32} color="#64748B" />
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{parentData?.name || user?.name || 'Pet Parent'}</Text>
                <Text style={styles.profilePhone}>{parentData?.phone || 'Not provided'}</Text>
              </View>
            </View>
            <View style={styles.chevronButton}>
              <Text style={styles.chevronIcon}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Rating Section */}
          <TouchableOpacity style={styles.ratingSection}>
            <Star size={24} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{averageRating.toFixed(2)} My Rating</Text>
            <View style={styles.chevronButton}>
              <Text style={styles.chevronIcon}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                  <item.icon size={22} color={item.color} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
              <View style={styles.chevronButton}>
                <Text style={styles.chevronIcon}>›</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Sign Out Button */}
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={handleSignOut}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FEE2E2' }]}>
                <LogOut size={22} color="#EF4444" />
              </View>
              <Text style={styles.menuTitle}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <PetDetailModal
        pet={selectedPet}
        visible={petModalVisible}
        onClose={() => setPetModalVisible(false)}
      />

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setEditModalVisible(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Profile Picture</Text>
                <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
                  {formData.image ? (
                    <Image source={{ uri: formData.image.uri || formData.image }} style={styles.modalProfileImage} />
                  ) : (
                    <View style={styles.modalProfileImagePlaceholder}>
                      <User size={40} color="#666" />
                    </View>
                  )}
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Personal Information</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <User size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, errors.name && styles.inputError]}
                      placeholder="Enter your name"
                      value={formData.name}
                      onChangeText={(value) => handleInputChange('name', value)}
                    />
                  </View>
                  {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                    />
                  </View>
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <Phone size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, errors.phone && styles.inputError]}
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChangeText={(value) => handleInputChange('phone', value)}
                      keyboardType="phone-pad"
                    />
                  </View>
                  {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Address</Text>
                  <View style={styles.inputWrapper}>
                    <MapPin size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, errors.address && styles.inputError]}
                      placeholder="Enter your address"
                      value={formData.address}
                      onChangeText={(value) => handleInputChange('address', value)}
                      multiline
                    />
                  </View>
                  {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
                </View>

                <View style={styles.genderContainer}>
                  <Text style={styles.inputLabel}>Gender</Text>
                  <View style={styles.genderOptions}>
                    <TouchableOpacity
                      style={[
                        styles.genderOption,
                        formData.gender === 'male' && styles.genderOptionSelected
                      ]}
                      onPress={() => handleInputChange('gender', 'male')}
                    >
                      <Text style={[
                        styles.genderOptionText,
                        formData.gender === 'male' && styles.genderOptionTextSelected
                      ]}>
                        Male
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.genderOption,
                        formData.gender === 'female' && styles.genderOptionSelected
                      ]}
                      onPress={() => handleInputChange('gender', 'female')}
                    >
                      <Text style={[
                        styles.genderOptionText,
                        formData.gender === 'female' && styles.genderOptionTextSelected
                      ]}>
                        Female
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.genderOption,
                        formData.gender === 'other' && styles.genderOptionSelected
                      ]}
                      onPress={() => handleInputChange('gender', 'other')}
                    >
                      <Text style={[
                        styles.genderOptionText,
                        formData.gender === 'other' && styles.genderOptionTextSelected
                      ]}>
                        Other
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.submitButton, (isUploading) && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isUploading}
              >
                <Text style={styles.submitButtonText}>
                  {isUploading ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#64748B',
  },
  chevronButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronIcon: {
    fontSize: 24,
    color: '#94A3B8',
    fontWeight: '300',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    flex: 1,
  },
  menuContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  bottomSpacing: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalSection: {
    marginTop: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  imageUploadContainer: {
    alignItems: 'center',
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modalProfileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    marginTop: 12,
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  genderContainer: {
    marginTop: 8,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  genderOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#475569',
  },
  genderOptionTextSelected: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

