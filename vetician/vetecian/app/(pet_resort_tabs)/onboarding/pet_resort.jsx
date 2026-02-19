import { React, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { Camera, ChevronDown, Clock, X } from 'lucide-react-native';
import { petResortDetail } from '../../../store/slices/authSlice'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


export default function ResortOnboarding() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Available services
  const serviceOptions = [
    { id: 'cafe', label: 'Cafe' },
    { id: 'grooming', label: 'Grooming' },
    { id: 'swimming', label: 'Swimming' },
    { id: 'boarding_indoor', label: 'Boarding (Indoor)' },
    { id: 'boarding_outdoor', label: 'Boarding (Outdoor)' },
    { id: 'playground', label: 'Playground' },
    { id: 'veterinary', label: 'Veterinary on Premises' },
  ];

  // Days of the week
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Form state
  const [formData, setFormData] = useState({
    resortName: '',
    brandName: '',
    address: '',
    resortPhone: '',
    ownerPhone: '',
    notice: '',
  });

  const [logo, setLogo] = useState(null);
  const [services, setServices] = useState([]);
  const [openingHours, setOpeningHours] = useState(
    daysOfWeek.map(day => ({
      day,
      open: '09:00',
      close: '18:00',
      closed: false,
    }))
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle text input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  // Handle logo upload
  const handleLogoUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'We need access to your photos to upload a logo');
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

  // Handle service selection
  const toggleService = (serviceId) => {
    setServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Update opening hours
  const updateOpeningHours = (index, field, value) => {
    const updatedHours = [...openingHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setOpeningHours(updatedHours);
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      if (!fileInfo.exists) throw new Error('File not found');

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: `logo_${Date.now()}.jpg`,
        type: 'image/jpeg'
      });
      formData.append('upload_preset', 'vetician');
      formData.append('cloud_name', 'dmtadfogc');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dmtadfogc/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw new Error('Failed to upload logo');
    }
  };

  // Validate form
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

  // Submit form
  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload logo to Cloudinary
      const logoUrl = await uploadToCloudinary(logo);

      // Prepare final data
      const resortData = {
        ...formData,
        logo: logoUrl,
        services,
        openingHours,
        notice: formData.notice.trim(),
      };

      const result = await dispatch(petResortDetail(resortData)).unwrap();

      if (result.success) {
        Alert.alert(
          'Success',
          'Pet resort created successfully!',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      }

      
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create resort');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Your Pet Resort</Text>
          <Text style={styles.headerSubtitle}>Complete your resort profile to get started</Text>
        </View>

        {/* Resort Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Resort Information</Text>

          {/* Logo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Resort Logo*</Text>
            <TouchableOpacity
              style={[
                styles.photoUpload,
                errors.logo && styles.uploadError
              ]}
              onPress={handleLogoUpload}
            >
              {logo ? (
                <>
                  <Image
                    source={{ uri: logo.uri }}
                    style={styles.uploadedImage}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => setLogo(null)}
                  >
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

          {/* Resort Name */}
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

          {/* Brand Name */}
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
        </View>

        {/* Contact Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address*</Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              placeholder="123 Pet Street, Animal City"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              multiline
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>

          {/* Resort Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Resort Phone*</Text>
            <TextInput
              style={[styles.input, errors.resortPhone && styles.inputError]}
              placeholder="(123) 456-7890"
              value={formData.resortPhone}
              onChangeText={(text) => handleInputChange('resortPhone', text)}
              keyboardType="phone-pad"
            />
            {errors.resortPhone && <Text style={styles.errorText}>{errors.resortPhone}</Text>}
          </View>

          {/* Owner Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Owner Phone*</Text>
            <TextInput
              style={[styles.input, errors.ownerPhone && styles.inputError]}
              placeholder="(987) 654-3210"
              value={formData.ownerPhone}
              onChangeText={(text) => handleInputChange('ownerPhone', text)}
              keyboardType="phone-pad"
            />
            {errors.ownerPhone && <Text style={styles.errorText}>{errors.ownerPhone}</Text>}
          </View>
        </View>

        {/* Services */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Services Offered*</Text>
          {errors.services && (
            <Text style={[styles.errorText, { marginBottom: 12 }]}>{errors.services}</Text>
          )}

          <View style={styles.servicesContainer}>
            {serviceOptions.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceButton,
                  services.includes(service.id) && styles.serviceButtonActive
                ]}
                onPress={() => toggleService(service.id)}
              >
                <Text style={[
                  styles.serviceText,
                  services.includes(service.id) && styles.serviceTextActive
                ]}>
                  {service.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Opening Hours */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Opening Hours</Text>

          {openingHours.map((day, index) => (
            <View key={day.day} style={styles.hourRow}>
              <Text style={styles.dayLabel}>{day.day}</Text>

              <TouchableOpacity
                style={styles.closedButton}
                onPress={() => updateOpeningHours(index, 'closed', !day.closed)}
              >
                <View style={styles.checkbox}>
                  {day.closed && <View style={styles.checkboxInner} />}
                </View>
                <Text style={styles.closedText}>Closed</Text>
              </TouchableOpacity>

              {!day.closed && (
                <View style={styles.timeInputs}>
                  <TextInput
                    style={styles.timeInput}
                    value={day.open}
                    onChangeText={(text) => updateOpeningHours(index, 'open', text)}
                    placeholder="09:00"
                  />
                  <Text style={styles.timeSeparator}>to</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={day.close}
                    onChangeText={(text) => updateOpeningHours(index, 'close', text)}
                    placeholder="18:00"
                  />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Notice */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Special Notice</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="E.g., Closed on national holidays"
            value={formData.notice}
            onChangeText={(text) => handleInputChange('notice', text)}
            multiline
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Creating Resort...' : 'Create Pet Resort'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 35
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#111827',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  photoUpload: {
    height: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  uploadError: {
    borderColor: '#EF4444',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoUploadText: {
    color: '#4B5563',
    marginTop: 8,
    fontSize: 14,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  serviceButtonActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#38BDF8',
  },
  serviceText: {
    color: '#4B5563',
    fontSize: 14,
  },
  serviceTextActive: {
    color: '#0284C7',
    fontWeight: '500',
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dayLabel: {
    width: 100,
    fontSize: 14,
    color: '#374151',
  },
  closedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  closedText: {
    fontSize: 14,
    color: '#4B5563',
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  timeInput: {
    width: 70,
    height: 36,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 8,
    textAlign: 'center',
  },
  timeSeparator: {
    marginHorizontal: 8,
    color: '#6B7280',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButtonDisabled: {
    opacity: 0.7,
    backgroundColor: '#9CA3AF',
  }
});