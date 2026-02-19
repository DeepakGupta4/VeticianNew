import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, Mail } from 'lucide-react-native';

export default function PhoneScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otpMethod, setOtpMethod] = useState('phone');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (otpMethod === 'phone' && !phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }
    if (otpMethod === 'email' && !email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    // Basic validation
    if (otpMethod === 'phone' && phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (otpMethod === 'email' && !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    setLoading(true);
    
    try {
      const BASE_URL = 'http://localhost:3000/api';
      console.log('🔵 API URL:', BASE_URL);
      console.log('🔵 OTP Method:', otpMethod);
      console.log('🔵 Sending OTP to:', otpMethod === 'phone' ? formattedPhone : email);
      
      const requestBody = otpMethod === 'phone' 
        ? { phoneNumber: formattedPhone }
        : { email: email.trim().toLowerCase() };
      
      const response = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('🔵 Response status:', response.status);
      console.log('🔵 Response ok:', response.ok);
      
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('🔵 Non-JSON response:', text.substring(0, 200));
        data = { message: 'Server error. Please try again.' };
      }
      
      console.log('🔵 Response data:', data);
      
      if (response.ok) {
        setLoading(false);
        
        // Show success notification
        Alert.alert(
          'OTP Sent Successfully!', 
          `We've sent a 6-digit OTP to your ${otpMethod === 'phone' ? 'phone number' : 'email address'}. Please check and enter it on the next screen.`,
          [{ text: 'OK' }]
        );
        
        router.push({
          pathname: '/(auth)/otp',
          params: { 
            phoneNumber: otpMethod === 'phone' ? formattedPhone : '',
            email: otpMethod === 'email' ? email.trim().toLowerCase() : '',
            verificationId: data.verificationId,
            otp: data.otp, // For testing purposes
            otpMethod: otpMethod
          }
        });
      } else {
        setLoading(false);
        if (response.status === 404) {
          const message = `No account exists with this ${otpMethod === 'phone' ? 'phone number' : 'email address'}. Please sign up first.`;
          
          Alert.alert(
            'Account Not Found',
            message,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Sign Up', 
                onPress: () => router.push('/(auth)/signup')
              }
            ]
          );
        } else if (response.status === 402 && data.errorCode === 'SMS_PAYMENT_REQUIRED') {
          // Handle SMS payment requirement specifically
          Alert.alert(
            'SMS Service Unavailable',
            'Phone OTP service requires payment activation. Please use Email OTP instead for free verification.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Use Email OTP', 
                onPress: () => setOtpMethod('email')
              }
            ]
          );
        } else if (data.errorCode === 'SMS_SERVICE_ERROR') {
          // Handle other SMS errors
          Alert.alert(
            'SMS Service Error',
            'Phone OTP service is temporarily unavailable. Please use Email OTP instead.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Use Email OTP', 
                onPress: () => setOtpMethod('email')
              }
            ]
          );
        } else {
          Alert.alert('Error', data.message || 'Failed to send OTP');
        }
      }
    } catch (error) {
      setLoading(false);
      console.log('Error sending OTP:', error);
      Alert.alert('Network Error', 'Please check your internet connection and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Continue with OTP</Text>
        <Text style={styles.subtitle}>We'll send you a verification code</Text>
      </View>
      
      <View style={styles.methodSelector}>
        <TouchableOpacity 
          style={[styles.methodButton, otpMethod === 'phone' && styles.methodButtonActive]}
          onPress={() => setOtpMethod('phone')}
        >
          <Phone size={20} color={otpMethod === 'phone' ? '#fff' : '#666'} />
          <Text style={[styles.methodText, otpMethod === 'phone' && styles.methodTextActive]}>
            Phone
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.methodButton, otpMethod === 'email' && styles.methodButtonActive]}
          onPress={() => setOtpMethod('email')}
        >
          <Mail size={20} color={otpMethod === 'email' ? '#fff' : '#666'} />
          <Text style={[styles.methodText, otpMethod === 'email' && styles.methodTextActive]}>
            Email
          </Text>
        </TouchableOpacity>
      </View>
      
      {otpMethod === 'phone' ? (
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Phone size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit mobile number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          <Text style={styles.inputHint}>We'll send OTP to this number</Text>
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <Text style={styles.inputHint}>We'll send OTP to this email</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSendOTP}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>Back to Sign In</Text>
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  methodSelector: {
    flexDirection: 'row',
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  methodButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  methodButtonActive: {
    backgroundColor: '#4A90E2',
  },
  methodText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  methodTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eaeaea',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  inputHint: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 12,
  },
  backText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
});
