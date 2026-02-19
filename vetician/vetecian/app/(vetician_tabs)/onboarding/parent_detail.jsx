import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, Home, Menu, Camera, UserCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { parentUser } from '../../../store/slices/authSlice';
import { validateEmail } from '../../../utils/validation';

export default function PetDetail() {
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
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
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

    console.log('[Cloudinary] Starting upload:', {
      name: file.name || 'unnamed',
      type,
      uri: file.uri.substring(0, 50) + '...'
    });

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name || `pet_upload_${Date.now()}.${fileExtension}`,
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
      console.log('[Cloudinary] Upload success!', {
        public_id: data.public_id,
        type
      });
      return data;
    } catch (error) {
      console.error('[Cloudinary] UPLOAD FAILED:', {
        error: error.message,
        file: file.name,
        type
      });
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

  const handleSubmit = async () => {
    // Reset errors
    setErrors({});

    // Validation
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
      let imageUrl = null;

      // Upload image to Cloudinary if exists
      if (formData.image) {
        const cloudinaryResponse = await uploadToCloudinary(formData.image);
        imageUrl = cloudinaryResponse.secure_url;
      }

      // Dispatch the form data with image URL
      const result = await dispatch(parentUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        image: imageUrl
      })).unwrap();
      console.log(result)

      if (result.success) {
        Alert.alert(
          'Success',
          'Parent information has been saved successfully!',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.message || 'An error occurred while saving parent information');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Pet Parent Information</Text>
            <Text style={styles.subtitle}>Fill the parent information</Text>
          </View>

          <View style={styles.form}>
            {/* Profile Image Upload */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile Picture</Text>
              <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
                {formData.image ? (
                  <Image source={{ uri: formData.image.uri }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <UserCircle size={40} color="#666" />
                  </View>
                )}
                {/* <View style={styles.cameraIcon}>
                  <Camera size={20} color="#fff" />
                </View> */}
              </TouchableOpacity>
            </View>

            {/* parent name, email and gender */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Parent Information</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <User size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Enter parent's full name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Enter email address"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.genderContainer}>
                <Text style={styles.genderLabel}>Gender:</Text>
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

            {/* phone number */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Phone size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.phone && styles.inputError]}
                    placeholder="Phone number"
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    keyboardType="phone-pad"
                  />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>
            </View>

            {/* Address */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Home size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.address && styles.inputError]}
                    placeholder="Enter complete address including city, state, and postal code"
                    value={formData.address}
                    onChangeText={(value) => handleInputChange('address', value)}
                    multiline
                  />
                </View>
                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (isLoading || isUploading) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading || isUploading}
            >
              <Text style={styles.submitButtonText}>
                {(isLoading || isUploading) ? 'Saving Information...' : 'Save Parent Information'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 15,
    paddingLeft: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    paddingRight: 20
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 5,
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 30,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderContainer: {
    marginTop: 15,
  },
  genderLabel: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genderOptionText: {
    color: '#333',
  },
  genderOptionTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#A0C4FF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});