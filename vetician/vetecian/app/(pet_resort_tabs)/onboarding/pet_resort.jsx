import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { Camera, X, Plus } from 'lucide-react-native';
import { petResortDetail } from '../../../store/slices/authSlice';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResortOnboarding() {
  const router = useRouter();
  const dispatch = useDispatch();

  const serviceOptions = [
    { id: 'cafe', label: 'Cafe' },
    { id: 'grooming', label: 'Grooming' },
    { id: 'swimming', label: 'Swimming' },
    { id: 'boarding_indoor', label: 'Boarding (Indoor)' },
    { id: 'boarding_outdoor', label: 'Boarding (Outdoor)' },
    { id: 'playground', label: 'Playground' },
    { id: 'veterinary', label: 'Veterinary on Premises' },
  ];

  const facilityOptions = [
    { id: 'ac_rooms', label: 'AC Rooms' },
    { id: 'cctv', label: 'CCTV Monitoring' },
    { id: 'outdoor_play', label: 'Outdoor Play Area' },
    { id: 'staff_24x7', label: '24x7 Staff' },
    { id: 'training_area', label: 'Pet Training Area' },
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [formData, setFormData] = useState({
    resortName: '',
    brandName: '',
    description: '',
    address: '',
    resortPhone: '',
    ownerPhone: '',
    email: '',
    holidays: '',
    rules: '',
  });

  const [logo, setLogo] = useState(null);
  const [services, setServices] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [openingHours, setOpeningHours] = useState(
    daysOfWeek.map(day => ({ day, open: '09:00', close: '18:00', closed: false }))
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleLogoUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'We need access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setLogo(result.assets[0]);
        setErrors(prev => ({ ...prev, logo: null }));
      }
    } catch (error) {
      console.error('Logo upload error:', error);
    }
  };

  const handleGalleryUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'We need access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setGalleryImages(prev => [...prev, ...result.assets]);
      }
    } catch (error) {
      console.error('Gallery upload error:', error);
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleService = (serviceId) => {
    setServices(prev =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const toggleFacility = (facilityId) => {
    setFacilities(prev =>
      prev.includes(facilityId) ? prev.filter(id => id !== facilityId) : [...prev, facilityId]
    );
  };

  const updateOpeningHours = (index, field, value) => {
    const updatedHours = [...openingHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setOpeningHours(updatedHours);
  };

  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      
      // Handle base64 data URI (from web)
      if (file.uri.startsWith('data:')) {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        formData.append('file', blob, file.name || `resort_${Date.now()}.jpg`);
      } else {
        // For React Native mobile
        const fileToUpload = {
          uri: file.uri,
          type: file.type || file.mimeType || 'image/jpeg',
          name: file.fileName || file.name || `resort_${Date.now()}.jpg`
        };
        formData.append('file', fileToUpload);
      }
      
      formData.append('documentType', 'resort');

      const token = await AsyncStorage.getItem('token');
      const API_URL = __DEV__ 
        ? 'http://localhost:3000/api'
        : (process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api');

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }
      return data.url || data.fileUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload image');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.resortName.trim()) newErrors.resortName = 'Resort name is required';
    if (!formData.brandName.trim()) newErrors.brandName = 'Brand name is required';
    if (!logo) newErrors.logo = 'Logo is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.resortPhone.trim()) newErrors.resortPhone = 'Resort phone is required';
    if (!formData.ownerPhone.trim()) newErrors.ownerPhone = 'Owner phone is required';
    if (services.length === 0) newErrors.services = 'Select at least one service';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const logoUrl = await uploadToCloudinary(logo);
      const galleryUrls = await Promise.all(galleryImages.map(img => uploadToCloudinary(img)));

      const resortData = {
        ...formData,
        logo: logoUrl,
        services,
        facilities,
        openingHours,
        gallery: galleryUrls,
      };

      const result = await dispatch(petResortDetail(resortData)).unwrap();

      if (result.success) {
        Alert.alert('Success', 'Pet resort created successfully!', [
          { text: 'OK', onPress: () => router.replace('/(pet_resort_tabs)/(tabs)/profile') }
        ]);
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message || error || 'Failed to create resort');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Your Pet Resort</Text>
          <Text style={styles.headerSubtitle}>Complete your resort profile</Text>
        </View>

        {/* Resort Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Resort Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Resort Logo*</Text>
            <TouchableOpacity style={[styles.photoUpload, errors.logo && styles.uploadError]} onPress={handleLogoUpload}>
              {logo ? (
                <>
                  <Image source={{ uri: logo.uri }} style={styles.uploadedImage} />
                  <TouchableOpacity style={styles.removeButton} onPress={() => setLogo(null)}>
                    <X size={16} color="#fff" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Camera size={24} color="#4B5563" />
                  <Text style={styles.photoUploadText}>Upload Logo</Text>
                </>
              )}
            </TouchableOpacity>
            {errors.logo && <Text style={styles.errorText}>{errors.logo}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Resort Name*</Text>
            <TextInput
              style={[styles.input, errors.resortName && styles.inputError]}
              placeholder="Paws Paradise Resort"
              value={formData.resortName}
              onChangeText={(text) => handleInputChange('resortName', text)}
            />
            {errors.resortName && <Text style={styles.errorText}>{errors.resortName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Brand Name*</Text>
            <TextInput
              style={[styles.input, errors.brandName && styles.inputError]}
              placeholder="Paws Paradise"
              value={formData.brandName}
              onChangeText={(text) => handleInputChange('brandName', text)}
            />
            {errors.brandName && <Text style={styles.errorText}>{errors.brandName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your resort..."
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address*</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.address && styles.inputError]}
              placeholder="123 Pet Street, City, State, PIN"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              multiline
              numberOfLines={3}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Resort Phone*</Text>
            <TextInput
              style={[styles.input, errors.resortPhone && styles.inputError]}
              placeholder="+91 1234567890"
              value={formData.resortPhone}
              onChangeText={(text) => handleInputChange('resortPhone', text)}
              keyboardType="phone-pad"
            />
            {errors.resortPhone && <Text style={styles.errorText}>{errors.resortPhone}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Owner Phone*</Text>
            <TextInput
              style={[styles.input, errors.ownerPhone && styles.inputError]}
              placeholder="+91 9876543210"
              value={formData.ownerPhone}
              onChangeText={(text) => handleInputChange('ownerPhone', text)}
              keyboardType="phone-pad"
            />
            {errors.ownerPhone && <Text style={styles.errorText}>{errors.ownerPhone}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="resort@example.com"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Services Offered */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Services Offered*</Text>
          <View style={styles.checkboxGrid}>
            {serviceOptions.map(service => (
              <TouchableOpacity
                key={service.id}
                style={[styles.checkbox, services.includes(service.id) && styles.checkboxActive]}
                onPress={() => toggleService(service.id)}
              >
                <Text style={[styles.checkboxText, services.includes(service.id) && styles.checkboxTextActive]}>
                  {service.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.services && <Text style={styles.errorText}>{errors.services}</Text>}
        </View>

        {/* Facilities */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Facilities</Text>
          <View style={styles.checkboxGrid}>
            {facilityOptions.map(facility => (
              <TouchableOpacity
                key={facility.id}
                style={[styles.checkbox, facilities.includes(facility.id) && styles.checkboxActive]}
                onPress={() => toggleFacility(facility.id)}
              >
                <Text style={[styles.checkboxText, facilities.includes(facility.id) && styles.checkboxTextActive]}>
                  {facility.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Opening Hours */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Opening Hours</Text>
          {openingHours.map((day, index) => (
            <View key={day.day} style={styles.dayRow}>
              <Text style={styles.dayLabel}>{day.day}</Text>
              <View style={styles.dayControls}>
                <Switch
                  value={!day.closed}
                  onValueChange={(value) => updateOpeningHours(index, 'closed', !value)}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#fff"
                />
                {!day.closed && (
                  <>
                    <TextInput
                      style={styles.timeInput}
                      value={day.open}
                      onChangeText={(text) => updateOpeningHours(index, 'open', text)}
                      placeholder="09:00"
                    />
                    <Text style={styles.timeSeparator}>-</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={day.close}
                      onChangeText={(text) => updateOpeningHours(index, 'close', text)}
                      placeholder="18:00"
                    />
                  </>
                )}
                {day.closed && <Text style={styles.closedText}>Closed</Text>}
              </View>
            </View>
          ))}
        </View>

        {/* Special Notice */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Special Notice</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Holidays</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., Closed on Diwali, Holi"
              value={formData.holidays}
              onChangeText={(text) => handleInputChange('holidays', text)}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Important Rules</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., Vaccination certificate required"
              value={formData.rules}
              onChangeText={(text) => handleInputChange('rules', text)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Gallery */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <Text style={styles.label}>Resort & Facility Images</Text>
          
          <View style={styles.galleryGrid}>
            {galleryImages.map((img, index) => (
              <View key={index} style={styles.galleryItem}>
                <Image source={{ uri: img.uri }} style={styles.galleryImage} />
                <TouchableOpacity
                  style={styles.galleryRemoveButton}
                  onPress={() => removeGalleryImage(index)}
                >
                  <X size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.galleryAddButton} onPress={handleGalleryUpload}>
              <Plus size={24} color="#6B7280" />
              <Text style={styles.galleryAddText}>Add Images</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Creating Resort...' : 'Create Resort'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: '#6B7280' },
  formSection: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 16, color: '#111827', backgroundColor: '#fff' },
  inputError: { borderColor: '#EF4444' },
  textArea: { height: 80, textAlignVertical: 'top' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  photoUpload: { height: 120, borderWidth: 2, borderStyle: 'dashed', borderColor: '#D1D5DB', borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  uploadError: { borderColor: '#EF4444' },
  photoUploadText: { marginTop: 8, fontSize: 14, color: '#6B7280' },
  uploadedImage: { width: '100%', height: '100%', borderRadius: 8 },
  removeButton: { position: 'absolute', top: 8, right: 8, backgroundColor: '#EF4444', borderRadius: 12, padding: 4 },
  checkboxGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  checkbox: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#fff' },
  checkboxActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  checkboxText: { fontSize: 14, color: '#374151' },
  checkboxTextActive: { color: '#fff', fontWeight: '600' },
  dayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dayLabel: { fontSize: 14, fontWeight: '500', color: '#374151', width: 80 },
  dayControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeInput: { width: 60, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, padding: 6, textAlign: 'center', fontSize: 14 },
  timeSeparator: { fontSize: 14, color: '#6B7280' },
  closedText: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic' },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  galleryItem: { width: 100, height: 100, borderRadius: 8, position: 'relative' },
  galleryImage: { width: '100%', height: '100%', borderRadius: 8 },
  galleryRemoveButton: { position: 'absolute', top: 4, right: 4, backgroundColor: '#EF4444', borderRadius: 10, padding: 4 },
  galleryAddButton: { width: 100, height: 100, borderWidth: 2, borderStyle: 'dashed', borderColor: '#D1D5DB', borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  galleryAddText: { marginTop: 4, fontSize: 12, color: '#6B7280' },
  submitButton: { backgroundColor: '#10B981', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  submitButtonDisabled: { backgroundColor: '#9CA3AF' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
