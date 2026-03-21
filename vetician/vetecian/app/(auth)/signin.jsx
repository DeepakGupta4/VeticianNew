import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials } from '../../store/slices/authSlice';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constant/theme';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

const ROLES = [
  { key: 'vetician',     label: 'Pet Parent',   emoji: '🐾' },
  { key: 'veterinarian', label: 'Veterinarian', emoji: '🩺' },
  { key: 'paravet',      label: 'Paravet',       emoji: '💉' },
  { key: 'pet_resort',   label: 'Pet Resort',    emoji: '🏡' },
];

const ROLE_ROUTES = {
  veterinarian: '/(doc_tabs)',
  pet_resort:   '/(pet_resort_tabs)',
  paravet:      '/(peravet_tabs)/(tabs)',
  vetician:     null,
};

export default function SignIn() {
  const router   = useRouter();
  const dispatch = useDispatch();

  const [step,           setStep]           = useState(1);
  const [phone,          setPhone]          = useState('');
  const [otp,            setOtp]            = useState(['', '', '', '', '', '']);
  const [verificationId, setVerificationId] = useState('');
  const [loading,        setLoading]        = useState(false);
  const [timer,          setTimer]          = useState(0);
  const [isNewUser,      setIsNewUser]      = useState(false);
  const [name,           setName]           = useState('');
  const [role,           setRole]           = useState('vetician');

  const otpRefs = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleSendOTP = async () => {
    if (!/^\d{10}$/.test(phone.trim())) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (isNewUser && !name.trim()) {
      Alert.alert('Name Required', 'Please enter your full name.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: `+91${phone.trim()}`,
          name:      isNewUser ? name.trim() : undefined,
          loginType: isNewUser ? role        : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setVerificationId(data.verificationId);
        setStep(2);
        setTimer(30);
        if (data.otp) Alert.alert('OTP (Dev Mode)', `Your OTP: ${data.otp}`);
      } else if (res.status === 500 && data.errorCode === 'SMS_SERVICE_ERROR') {
        if (data.otp && data.verificationId) {
          setVerificationId(data.verificationId);
          setStep(2);
          setTimer(30);
          Alert.alert('SMS Unavailable', `Test OTP: ${data.otp}`);
        } else {
          Alert.alert('SMS Error', 'SMS service unavailable. Please try again later.');
        }
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP. Try again.');
      }
    } catch {
      Alert.alert('Network Error', 'Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleVerifyOTP = async () => {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) {
      Alert.alert('Incomplete OTP', 'Please enter all 6 digits.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: `+91${phone}`, otp: otpStr, verificationId }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(setCredentials({ user: data.user, token: data.token, refreshToken: data.refreshToken }));
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('userId', data.user._id || data.user.id);
        if (data.refreshToken) await AsyncStorage.setItem('refreshToken', data.refreshToken);

        const userRole = data.user?.role || 'vetician';
        const route = ROLE_ROUTES[userRole];
        if (route) {
          router.replace(route);
        } else {
          const tourDone = await AsyncStorage.getItem('tourCompleted');
          router.replace(tourDone ? '/(vetician_tabs)' : '/(vetician_tabs)/pages/QuickTour');
        }
      } else {
        Alert.alert('Wrong OTP', data.message || 'Incorrect OTP. Please try again.');
      }
    } catch {
      Alert.alert('Network Error', 'Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: `+91${phone}` }),
      });
      const data = await res.json();
      if (res.ok) {
        setVerificationId(data.verificationId);
        setTimer(30);
        if (data.otp) Alert.alert('OTP (Dev Mode)', `New OTP: ${data.otp}`);
      } else {
        Alert.alert('Error', data.message || 'Failed to resend OTP.');
      }
    } catch {
      Alert.alert('Network Error', 'Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🐾</Text>
            </View>
            <Text style={styles.brand}>Vetician</Text>
            <Text style={styles.tagline}>Your pet's health, simplified</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {step === 1 ? (
              <>
                <Text style={styles.cardTitle}>
                  {isNewUser ? 'Create Account' : 'Welcome Back'}
                </Text>
                <Text style={styles.cardSub}>
                  {isNewUser
                    ? 'Fill in your details to get started'
                    : 'Enter your mobile number to continue'}
                </Text>

                <Text style={styles.fieldLabel}>Mobile Number</Text>
                <View style={styles.phoneRow}>
                  <View style={styles.flag}>
                    <Text style={styles.flagText}>🇮🇳 +91</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="10-digit number"
                    placeholderTextColor={COLORS.textMuted}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={10}
                    autoFocus
                  />
                </View>

                {isNewUser && (
                  <>
                    <Text style={styles.fieldLabel}>Full Name</Text>
                    <TextInput
                      style={styles.nameInput}
                      placeholder="Enter your full name"
                      placeholderTextColor={COLORS.textMuted}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />

                    <Text style={styles.fieldLabel}>I am a:</Text>
                    <View style={styles.roleGrid}>
                      {ROLES.map(r => (
                        <TouchableOpacity
                          key={r.key}
                          style={[styles.roleBtn, role === r.key && styles.roleBtnActive]}
                          onPress={() => setRole(r.key)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.roleEmoji}>{r.emoji}</Text>
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
                  activeOpacity={0.85}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.btnText}>Get OTP</Text>
                  }
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.toggleRow}
                  onPress={() => { setIsNewUser(v => !v); setName(''); setRole('vetician'); }}
                >
                  <Text style={styles.toggleText}>
                    {isNewUser ? 'Already have an account? ' : 'New to Vetician? '}
                    <Text style={styles.toggleLink}>
                      {isNewUser ? 'Sign in' : 'Create account'}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.cardTitle}>Enter OTP</Text>
                <Text style={styles.cardSub}>
                  Sent to <Text style={styles.highlight}>+91 {phone}</Text>
                </Text>

                <View style={styles.otpRow}>
                  {otp.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={r => (otpRefs.current[i] = r)}
                      style={[styles.otpBox, digit && styles.otpBoxFilled]}
                      value={digit}
                      onChangeText={v => handleOtpChange(v, i)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                      autoFocus={i === 0}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.btn, loading && styles.btnDisabled]}
                  onPress={handleVerifyOTP}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.btnText}>Verify & Continue</Text>
                  }
                </TouchableOpacity>

                <View style={styles.resendRow}>
                  <Text style={styles.resendLabel}>Didn't receive it? </Text>
                  <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                    <Text style={[styles.resendLink, timer > 0 && styles.resendDisabled]}>
                      {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.changeNum}
                  onPress={() => { setStep(1); setOtp(['', '', '', '', '', '']); }}
                >
                  <Text style={styles.changeNumText}>← Change number</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms</Text> &{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingTop: 60, paddingBottom: 40, justifyContent: 'center' },

  header:     { alignItems: 'center', marginBottom: SPACING.xl },
  logoCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.primaryPale, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm, ...SHADOWS.card },
  logoEmoji:  { fontSize: 40 },
  brand:      { fontSize: 32, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5 },
  tagline:    { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },

  card:      { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOWS.card, marginBottom: SPACING.lg },
  cardTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textDark, textAlign: 'center', marginBottom: 6 },
  cardSub:   { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.lg },
  highlight: { color: COLORS.primary, fontWeight: '600' },

  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8, marginTop: 4 },

  phoneRow:   { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, backgroundColor: COLORS.background, marginBottom: SPACING.md, overflow: 'hidden' },
  flag:       { paddingHorizontal: SPACING.md, paddingVertical: 16, borderRightWidth: 1.5, borderRightColor: COLORS.border, backgroundColor: COLORS.primaryPale },
  flagText:   { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  phoneInput: { flex: 1, fontSize: 18, color: COLORS.textPrimary, paddingHorizontal: SPACING.md, paddingVertical: 14, letterSpacing: 2 },

  nameInput: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, backgroundColor: COLORS.background, fontSize: 16, color: COLORS.textPrimary, paddingHorizontal: SPACING.md, paddingVertical: 14, marginBottom: SPACING.md },

  roleGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACING.lg },
  roleBtn:        { width: '47%', paddingVertical: 14, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.background, alignItems: 'center', gap: 4 },
  roleBtnActive:  { backgroundColor: COLORS.primaryPale, borderColor: COLORS.primary },
  roleEmoji:      { fontSize: 22 },
  roleText:       { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  roleTextActive: { color: COLORS.primary },

  otpRow:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.lg, gap: 8 },
  otpBox:       { flex: 1, height: 56, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.sm, fontSize: 24, fontWeight: '700', color: COLORS.textPrimary, backgroundColor: COLORS.background },
  otpBoxFilled: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryPale },

  btn:        { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, height: 56, justifyContent: 'center', alignItems: 'center', ...SHADOWS.card },
  btnDisabled:{ backgroundColor: COLORS.textMuted },
  btnText:    { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },

  resendRow:      { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.md },
  resendLabel:    { color: COLORS.textMuted, fontSize: 14 },
  resendLink:     { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  resendDisabled: { color: COLORS.textMuted },

  changeNum:     { alignItems: 'center', marginTop: SPACING.sm, paddingVertical: SPACING.xs },
  changeNumText: { color: COLORS.textMuted, fontSize: 14 },

  toggleRow:  { alignItems: 'center', marginTop: SPACING.md, paddingVertical: SPACING.xs },
  toggleText: { fontSize: 14, color: COLORS.textMuted },
  toggleLink: { color: COLORS.primary, fontWeight: '700' },

  terms:     { textAlign: 'center', fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
  termsLink: { color: COLORS.primary, fontWeight: '500' },
});
