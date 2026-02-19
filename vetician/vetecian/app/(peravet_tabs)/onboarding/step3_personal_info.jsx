import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronDown, CheckCircle } from 'lucide-react-native';
import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';
import { useSelector } from 'react-redux';
import OTPModal from '../../../components/peravet/OTPModal';

export default function Step3PersonalInfo() {
  const router = useRouter();
  const { formData, updateFormData, errors, nextStep, otpState, setOtpState, sendOTP, verifyOTP, resendOTP } = useParavetOnboarding();
  const { user } = useSelector(state => state.auth);
  const [serviceAreaExpanded, setServiceAreaExpanded] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const serviceAreas = ['1-5 km', '5-10 km', '10-20 km', '20+ km'];

  const handleSendOTP = async () => {
    if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
      Alert.alert('Invalid Mobile', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setOtpLoading(true);
      await sendOTP(formData.mobileNumber, user?.id);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      await verifyOTP(otp, formData.mobileNumber, user?.id);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(formData.mobileNumber, user?.id);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const handleNext = () => {
    // Check if required fields are filled
    const isFormValid = formData.fullName && 
                       formData.mobileNumber && 
                       formData.email && 
                       formData.city && 
                       formData.serviceArea;

    if (!isFormValid) {
      Alert.alert('Missing Information', 'Please fill all required fields to proceed');
      return;
    }

    // Set userId & token into formData before going to Step 4
    if (user?.id && user?.token) {
      updateFormData('userId', user.id);
      updateFormData('token', user.token);
    }

    // Navigate directly to Step 4
    router.push('./step4_documents');
  };


  const handleBack = () => {
    router.push('./step2_eligibility');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Step 3 of 9</Text>
        <Text style={styles.heading}>Personal & Contact Info</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '33%' }]} />
      </View>

      {/* Form */}
      <View style={styles.contentContainer}>
        {/* Full Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={[styles.input, errors.fullName && styles.inputError]}
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(value) => updateFormData('fullName', value)}
            placeholderTextColor="#999"
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
        </View>

        {/* Mobile Number */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mobile Number *</Text>
          <View style={styles.mobileInputContainer}>
            <TextInput
              style={[
                styles.input,
                styles.mobileInput,
                errors.mobileNumber && styles.inputError,
                otpState.mobileVerified && styles.inputSuccess,
              ]}
              placeholder="10-digit mobile number"
              value={formData.mobileNumber}
              onChangeText={(value) => updateFormData('mobileNumber', value)}
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor="#999"
              editable={!otpState.mobileVerified}
            />
            {otpState.mobileVerified ? (
              <View style={styles.verificationBadge}>
                <CheckCircle size={20} color="#34C759" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.sendOTPButton,
                  (formData.mobileNumber.length !== 10 || otpLoading) && styles.sendOTPButtonDisabled,
                ]}
                onPress={handleSendOTP}
                disabled={formData.mobileNumber.length !== 10 || otpLoading}
              >
                {otpLoading ? (
                  <ActivityIndicator size="small" color="#00B0FF" />
                ) : (
                  <Text style={styles.sendOTPButtonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber}</Text>}
          <Text style={styles.helperText}>We'll send OTP for verification</Text>
        </View>

        {/* Email */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email ID *</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* City */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={[styles.input, errors.city && styles.inputError]}
            placeholder="Enter your city"
            value={formData.city}
            onChangeText={(value) => updateFormData('city', value)}
            placeholderTextColor="#999"
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>

        {/* Service Area */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Service Radius (Area) *</Text>
          <TouchableOpacity
            style={[styles.dropdownButton, errors.serviceArea && styles.inputError]}
            onPress={() => setServiceAreaExpanded(!serviceAreaExpanded)}
          >
            <Text style={[styles.dropdownText, !formData.serviceArea && styles.placeholderText]}>
              {formData.serviceArea || 'Select service area'}
            </Text>
            <ChevronDown size={20} color="#666" />
          </TouchableOpacity>
          {serviceAreaExpanded && (
            <View style={styles.dropdownMenu}>
              {serviceAreas.map((area) => (
                <TouchableOpacity
                  key={area}
                  style={styles.dropdownItem}
                  onPress={() => {
                    updateFormData('serviceArea', area);
                    setServiceAreaExpanded(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{area}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {errors.serviceArea && <Text style={styles.errorText}>{errors.serviceArea}</Text>}
        </View>

        {/* Emergency Contact (Optional) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Emergency Contact (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Emergency contact name"
            value={formData.emergencyContactName}
            onChangeText={(value) => updateFormData('emergencyContactName', value)}
            placeholderTextColor="#999"
          />
          <TextInput
            style={[styles.input, styles.inputMarginTop]}
            placeholder="Emergency contact number"
            value={formData.emergencyContactNumber}
            onChangeText={(value) => updateFormData('emergencyContactNumber', value)}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>BACK</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.nextButton, 
              (!formData.fullName || !formData.mobileNumber || !formData.email || !formData.city || !formData.serviceArea) && styles.nextButtonDisabled
            ]} 
            onPress={handleNext}
            disabled={!formData.fullName || !formData.mobileNumber || !formData.email || !formData.city || !formData.serviceArea}
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* OTP Modal */}
      <OTPModal
        visible={otpState.showOTPModal}
        mobileNumber={formData.mobileNumber}
        onVerifyOTP={handleVerifyOTP}
        onResendOTP={handleResendOTP}
        loading={otpState.otpLoading}
        onClose={() => setOtpState(prev => ({ ...prev, showOTPModal: false }))}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e1e5e9',
    width: '100%',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#00B0FF',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d0d5dc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a1a1a',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  inputMarginTop: {
    marginTop: 10,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d0d5dc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d0d5dc',
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#00B0FF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  nextButtonDisabled: {
    backgroundColor: '#d0d5dc',
    opacity: 0.6,
  },
  // Mobile number with OTP
  mobileInputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  mobileInput: {
    flex: 1,
  },
  sendOTPButton: {
    backgroundColor: '#00B0FF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  sendOTPButtonDisabled: {
    backgroundColor: '#d0d5dc',
    opacity: 0.6,
  },
  sendOTPButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#34C759',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 90,
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34C759',
  },
  inputSuccess: {
    borderColor: '#34C759',
    backgroundColor: '#f0fdf4',
  },
});
