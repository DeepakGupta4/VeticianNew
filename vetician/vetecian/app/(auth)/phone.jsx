import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, PawPrint, User } from 'lucide-react-native';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

const ROLES = [
  { key: 'vetician', label: 'Pet Parent' },
  { key: 'veterinarian', label: 'Veterinarian' },
  { key: 'paravet', label: 'Paravet' },
  { key: 'pet_resort', label: 'Pet Resort' },
];

export default function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('vetician');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
    if (isNewUser && !name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    const formattedPhone = `+91${phone}`;
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          name: isNewUser ? name.trim() : undefined,
          loginType: isNewUser ? role : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLoading(false);
        if (data.otp) {
          Alert.alert('OTP Sent', `Test OTP: ${data.otp}`, [{ text: 'OK' }]);
        }
        router.push({
          pathname: '/(auth)/otp',
          params: {
            phoneNumber: formattedPhone,
            verificationId: data.verificationId,
            otp: data.otp,
            otpMethod: 'phone',
          },
        });
      } else if (res.status === 500 && data.errorCode === 'SMS_SERVICE_ERROR') {
        setLoading(false);
        Alert.alert(
          'SMS Unavailable',
          data.otp ? `Test OTP: ${data.otp}` : 'SMS service unavailable.',
          [{
            text: 'OK', onPress: () => {
              if (data.otp && data.verificationId) {
                router.push({
                  pathname: '/(auth)/otp',
                  params: {
                    phoneNumber: formattedPhone,
                    verificationId: data.verificationId,
                    otp: data.otp,
                    otpMethod: 'phone',
                  },
                });
              }
            }
          }]
        );
      } else {
        setLoading(false);
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch {
      setLoading(false);
      Alert.alert('Network Error', 'Please check your internet connection.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <PawPrint size={48} color="#4A90E2" />
          <Text style={styles.appName}>Vetician</Text>
          <Text style={styles.title}>{isNewUser ? 'Create Account' : 'Welcome Back'}</Text>
          <Text style={styles.subtitle}>
            {isNewUser ? 'Enter your details to get started' : 'Sign in or sign up with your phone'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Phone Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.countryCode}>+91</Text>
            <Phone size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              placeholderTextColor="#aaa"
              value={phone}
              onChangeText={(v) => { setPhone(v); if (isNewUser && v.length !== 10) setIsNewUser(false); }}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* Name Input — shown only for new users */}
          {isNewUser && (
            <>
              <View style={[styles.inputWrapper, { marginTop: 16 }]}>
                <User size={20} color="#888" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#aaa"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              {/* Role Selection */}
              <Text style={styles.roleLabel}>I am a:</Text>
              <View style={styles.roleGrid}>
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r.key}
                    style={[styles.roleBtn, role === r.key && styles.roleBtnActive]}
                    onPress={() => setRole(r.key)}
                  >
                    <PawPrint size={14} color={role === r.key ? '#fff' : '#666'} />
                    <Text style={[styles.roleText, role === r.key && styles.roleTextActive]}>
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSendOTP}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? 'Sending OTP...' : 'Send OTP'}</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            {isNewUser
              ? 'Already have an account? Enter your phone above.'
              : "New here? We'll create your account automatically."}
          </Text>

          {!isNewUser && (
            <TouchableOpacity onPress={() => setIsNewUser(true)} style={styles.newUserBtn}>
              <Text style={styles.newUserText}>New user? Set your name & role</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 40 },
  header: { alignItems: 'center', marginBottom: 36 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#4A90E2', marginTop: 10, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#222', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#888', textAlign: 'center' },
  form: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8f9fa', borderRadius: 12,
    borderWidth: 1, borderColor: '#eaeaea',
    paddingHorizontal: 14, height: 56,
  },
  countryCode: { fontSize: 16, color: '#333', fontWeight: '600', marginRight: 6 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  roleLabel: { fontSize: 15, color: '#666', fontWeight: '500', marginTop: 20, marginBottom: 10 },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  roleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 10, borderWidth: 1, borderColor: '#eaeaea',
    backgroundColor: '#f8f9fa', minWidth: '45%', justifyContent: 'center',
  },
  roleBtnActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  roleText: { fontSize: 14, color: '#666', fontWeight: '500' },
  roleTextActive: { color: '#fff', fontWeight: '600' },
  btn: {
    backgroundColor: '#4A90E2', borderRadius: 12, height: 54,
    justifyContent: 'center', alignItems: 'center', marginTop: 24,
    shadowColor: '#4A90E2', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  btnDisabled: { backgroundColor: '#a0a0a0', shadowColor: '#a0a0a0' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  hint: { fontSize: 13, color: '#aaa', textAlign: 'center', marginTop: 16 },
  newUserBtn: { alignItems: 'center', marginTop: 10, paddingVertical: 8 },
  newUserText: { fontSize: 14, color: '#4A90E2', fontWeight: '500' },
});
