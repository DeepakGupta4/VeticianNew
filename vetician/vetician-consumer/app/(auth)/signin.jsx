import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, SafeAreaView, Image, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials } from '../../store/slices/authSlice';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constant/theme';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
const { width } = Dimensions.get('window');

export default function SignIn() {
  const router   = useRouter();
  const dispatch = useDispatch();

  const [step,           setStep]           = useState(1);
  const [phone,          setPhone]          = useState('');
  const [otp,            setOtp]            = useState(['', '', '', '', '', '']);
  const [verificationId, setVerificationId] = useState('');
  const [loading,        setLoading]        = useState(false);
  const [timer,          setTimer]          = useState(0);

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
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: `+91${phone.trim()}` }),
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
          Alert.alert('Error', 'SMS service unavailable. Please try again later.');
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

        // Pehli baar aaya hai — name auto-generated hai ya onboarding complete nahi
        const isNewUser = !data.user.name || data.user.name === 'Pet Parent';
        if (isNewUser) {
          router.replace('/(vetician_tabs)/onboarding/parent_detail');
        } else {
          router.replace('/(vetician_tabs)/pages/VeticianWelcomeScreen');
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

  // ── STEP 1: Phone Entry ───────────────────────────────────────────────
  if (step === 1) {
    return (
      <SafeAreaView style={s.root}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

          {/* Top image — full width, no padding */}
          <Image
            source={require('../../assets/images/dog.jpg')}
            style={s.heroImage}
            resizeMode="cover"
          />

          {/* Bottom sheet */}
          <View style={s.sheet}>
            <Text style={s.brand}>Vetician</Text>
            <Text style={s.subtitle}>India's trusted pet care platform</Text>

            {/* Phone input */}
            <View style={s.phoneRow}>
              <View style={s.flag}>
                <Text style={s.flagText}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={s.phoneInput}
                placeholder="Enter mobile number"
                placeholderTextColor={COLORS.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {/* Terms message */}
            <Text style={s.terms}>
              By entering your mobile number, you agree to our{' '}
              <Text style={s.termsLink}>Terms & Conditions</Text>
              {' '}and{' '}
              <Text style={s.termsLink}>Privacy Policy</Text>
            </Text>

            {/* Big Get OTP button */}
            <TouchableOpacity
              style={[s.btn, loading && s.btnOff]}
              onPress={handleSendOTP}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" size="large" />
                : <Text style={s.btnText}>Get OTP</Text>
              }
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── STEP 2: OTP Entry ─────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.otpScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={s.otpHeader}>
            <View style={s.logoCircle}>
              <Text style={s.logoEmoji}>🐾</Text>
            </View>
            <Text style={s.brand}>Vetician</Text>
          </View>

          <View style={s.otpCard}>
            <Text style={s.otpTitle}>Enter OTP</Text>
            <Text style={s.otpSub}>
              We sent a 6-digit code to{' '}
              <Text style={s.hi}>+91 {phone}</Text>
            </Text>

            <View style={s.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={r => (otpRefs.current[i] = r)}
                  style={[s.otpBox, digit && s.otpBoxOn]}
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
              style={[s.btn, loading && s.btnOff]}
              onPress={handleVerifyOTP}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" size="large" />
                : <Text style={s.btnText}>Verify & Continue</Text>
              }
            </TouchableOpacity>

            <View style={s.resendRow}>
              <Text style={s.resendTxt}>Didn't receive it? </Text>
              <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                <Text style={[s.resendLink, timer > 0 && s.resendOff]}>
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={s.changeNum} onPress={() => { setStep(1); setOtp(['', '', '', '', '', '']); }}>
              <Text style={s.changeNumTxt}>← Change number</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  // ── Step 1 ──
  heroImage: {
    width,
    height: 340,
  },
  sheet: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 20,
    ...SHADOWS.card,
  },
  brand:    { fontSize: 26, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 28 },

  phoneRow:   { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, backgroundColor: COLORS.background, marginBottom: 16, overflow: 'hidden' },
  flag:       { paddingHorizontal: 14, paddingVertical: 16, borderRightWidth: 1.5, borderRightColor: COLORS.border, backgroundColor: COLORS.primaryPale },
  flagText:   { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  phoneInput: { flex: 1, fontSize: 18, color: COLORS.textPrimary, paddingHorizontal: 16, paddingVertical: 14, letterSpacing: 2, outlineStyle: 'none' },

  terms:     { fontSize: 12, color: COLORS.textMuted, lineHeight: 18, marginBottom: 24, textAlign: 'center' },
  termsLink: { color: COLORS.primary, fontWeight: '600' },

  btn:     { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, height: 60, justifyContent: 'center', alignItems: 'center', ...SHADOWS.card },
  btnOff:  { backgroundColor: COLORS.textMuted },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },

  // ── Step 2 ──
  otpScroll:  { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingTop: 60, paddingBottom: 40, justifyContent: 'center' },
  otpHeader:  { alignItems: 'center', marginBottom: SPACING.xl },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryPale, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm, ...SHADOWS.card },
  logoEmoji:  { fontSize: 36 },

  otpCard:  { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOWS.card },
  otpTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textDark, textAlign: 'center', marginBottom: 6 },
  otpSub:   { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.lg },
  hi:       { color: COLORS.primary, fontWeight: '600' },

  otpRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.lg },
  otpBox:   { width: 44, height: 52, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.sm, fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, backgroundColor: COLORS.background, outlineStyle: 'none' },
  otpBoxOn: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryPale },

  resendRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.md },
  resendTxt:  { color: COLORS.textMuted, fontSize: 14 },
  resendLink: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  resendOff:  { color: COLORS.textMuted },

  changeNum:    { alignItems: 'center', marginTop: SPACING.sm, paddingVertical: SPACING.xs },
  changeNumTxt: { color: COLORS.textMuted, fontSize: 14 },
});
