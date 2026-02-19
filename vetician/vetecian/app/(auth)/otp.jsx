import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials } from '../../store/slices/authSlice';
import OTPInput from '../../components/auth/OTPInput';
import { CheckCircle, RefreshCw } from 'lucide-react-native';

export default function OTPScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { phoneNumber, email, verificationId, otp: testOtp, otpMethod } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleOTPSubmit = async () => {
    if (!enteredOtp || enteredOtp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      const BASE_URL = 'http://localhost:3000/api';
      console.log('🔵 Verifying OTP:', enteredOtp);
      console.log('🔵 Phone:', phoneNumber);
      console.log('🔵 Email:', email);
      console.log('🔵 Verification ID:', verificationId);
      
      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: phoneNumber || undefined,
          email: email || undefined,
          otp: enteredOtp, 
          verificationId 
        }),
      });
      
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('🔵 Non-JSON response:', text.substring(0, 200));
        data = { message: 'Server error. Please try again.' };
      }
      
      console.log('🔵 Verify response:', data);
      
      if (response.ok) {
        // Save credentials using Redux
        dispatch(setCredentials({
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken
        }));
        
        // Also save to AsyncStorage for persistence
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        if (data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', data.refreshToken);
        }
        
        console.log('✅ Credentials saved successfully');
        
        // Show success notification
        Alert.alert(
          'Login Successful! 🎉', 
          `Welcome back! You're now signed in to your account.`,
          [{ 
            text: 'Continue', 
            onPress: () => handlePostLoginRouting(data.user?.role || 'vetician')
          }]
        );
      } else {
        // Handle specific error cases
        if (response.status === 400 && data.message && data.message.includes('verification ID')) {
          Alert.alert(
            'OTP Expired', 
            'Your OTP has expired. Please request a new one.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Get New OTP', 
                onPress: () => router.back()
              }
            ]
          );
        } else {
          Alert.alert(
            'Verification Failed', 
            data.message || 'The OTP you entered is incorrect. Please try again.',
            [{ text: 'Try Again' }]
          );
        }
      }
    } catch (error) {
      console.log('Error verifying OTP:', error);
      Alert.alert(
        'Network Error', 
        'Unable to verify OTP. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    }
    
    setLoading(false);
  };

  const handlePostLoginRouting = async (userRole) => {
    console.log('🔵 Routing user with role:', userRole);
    
    switch(userRole) {
      case 'veterinarian':
        console.log('🏥 Routing to veterinarian dashboard');
        router.replace('/(doc_tabs)');
        break;
      case 'pet_resort':
        console.log('🏨 Routing to pet resort dashboard');
        router.replace('/(pet_resort_tabs)');
        break;
      case 'paravet':
        console.log('🐕 Routing to paravet dashboard');
        router.replace('/(peravet_tabs)/(tabs)');
        break;
      default: // vetician (pet parent)
        console.log('👤 Routing to pet parent dashboard');
        // Check if tour has been completed for pet parents
        const tourCompleted = await AsyncStorage.getItem('tourCompleted');
        if (!tourCompleted) {
          router.replace('/(vetician_tabs)/pages/QuickTour');
        } else {
          router.replace('/(vetician_tabs)');
        }
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    
    try {
      const BASE_URL = 'http://localhost:3000/api';
      const requestBody = otpMethod === 'phone' 
        ? { phoneNumber }
        : { email };
      
      const response = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update verification ID with new one
        router.setParams({ 
          verificationId: data.verificationId,
          otp: data.otp // For testing
        });
        
        Alert.alert(
          'New OTP Sent!', 
          `A fresh OTP has been sent to your ${otpMethod === 'phone' ? 'phone number' : 'email address'}.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Unable to resend OTP. Please check your connection.');
    }
    
    setResendLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CheckCircle size={60} color="#4A90E2" style={styles.icon} />
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{' '}
          <Text style={styles.contactInfo}>
            {otpMethod === 'email' ? email : phoneNumber}
          </Text>
        </Text>
      </View>
      
      {testOtp && process.env.NODE_ENV === 'development' && (
        <View style={styles.otpDisplay}>
          <Text style={styles.otpLabel}>Dev OTP: </Text>
          <Text style={styles.otpValue}>{testOtp}</Text>
        </View>
      )}
      
      <View style={styles.otpContainer}>
        <OTPInput onComplete={(otp) => setEnteredOtp(otp)} />
      </View>
      
      <TouchableOpacity 
        style={[styles.verifyButton, loading && styles.buttonDisabled]}
        onPress={handleOTPSubmit}
        disabled={loading}
      >
        <Text style={styles.verifyButtonText}>
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <TouchableOpacity 
          style={styles.resendButton}
          onPress={handleResendOTP}
          disabled={resendLoading}
        >
          <RefreshCw size={16} color="#4A90E2" style={styles.resendIcon} />
          <Text style={styles.resendButtonText}>
            {resendLoading ? 'Resending...' : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.changeButton}
        onPress={() => router.back()}
      >
        <Text style={styles.changeText}>
          Change {otpMethod === 'phone' ? 'Phone Number' : 'Email Address'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  contactInfo: {
    fontWeight: '600',
    color: '#4A90E2',
  },
  otpDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  otpValue: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  otpContainer: {
    marginBottom: 30,
  },
  verifyButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
    shadowColor: '#a0a0a0',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  resendIcon: {
    marginRight: 4,
  },
  resendButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  changeButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  changeText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
});
