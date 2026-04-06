import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../../store/slices/authSlice';
import { validateEmail } from '../../utils/validation';
import { Eye, EyeOff, Mail, Lock, User, Phone, Stethoscope } from 'lucide-react-native';
import OTPInput from '../../components/auth/OTPInput';

const ROLES = [
  { key: 'veterinarian', label: 'Veterinarian', route: '/(doc_tabs)/onboarding/veterinarian_detail' },
  { key: 'paravet', label: 'Paravet', route: '/(peravet_tabs)/onboarding' },
  { key: 'pet_resort', label: 'Pet Resort', route: '/(pet_resort_tabs)/(tabs)' },
];

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';

export default function SignUp() {
  const [step, setStep] = useState(1); // 1 = form, 2 = otp
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginType, setLoginType] = useState('veterinarian');
  const [otpMethod, setOtpMethod] = useState('phone'); // 'phone' or 'email'
  const [otpLoading, setOtpLoading] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit phone number';
    if (!formData.password.trim() || formData.password.length < 6) newErrors.password = 'Password must be 6+ chars';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const fetchWithTimeout = (url, options, timeout = 60000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
    ]);
  };

  const handleSendOTP = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setOtpLoading(true);
    try {
      const contact = otpMethod === 'phone'
        ? { phoneNumber: `+91${formData.phone.trim()}` }
        : { email: formData.email.trim().toLowerCase() };

      const res = await fetchWithTimeout(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });

      const data = await res.json();

      if (res.ok) {
        setVerificationId(data.verificationId);
        setStep(2);
        Alert.alert(
          'OTP Sent!',
          data.otp
            ? `OTP: ${data.otp}\n\nSent to your ${otpMethod === 'phone' ? 'phone' : 'email'}.`
            : `OTP sent to your ${otpMethod === 'phone' ? 'phone number' : 'email address'}.`
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    if (!enteredOtp || enteredOtp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP');
      return;
    }

    // Step 1: Verify OTP
    setOtpLoading(true);
    try {
      const contact = otpMethod === 'phone'
        ? { phoneNumber: `+91${formData.phone.trim()}` }
        : { email: formData.email.trim().toLowerCase() };

      const verifyRes = await fetchWithTimeout(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contact, otp: enteredOtp, verificationId }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        Alert.alert('OTP Failed', verifyData.message || 'Invalid OTP. Please try again.');
        setOtpLoading(false);
        return;
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
      setOtpLoading(false);
      return;
    }
    setOtpLoading(false);

    // Step 2: Register user
    const result = await dispatch(signUpUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: `+91${formData.phone.trim()}`,
      password: formData.password,
      loginType,
    }));

    if (signUpUser.fulfilled.match(result)) {
      const userId = result.payload?.user?._id;
      const token = result.payload?.token;
      
      if (loginType === 'veterinarian' && userId && token) {
        router.replace('/(doc_tabs)/onboarding/veterinarian_detail');
      } else if (loginType === 'pet_resort') {
        router.replace('/(pet_resort_tabs)');
      } else if (loginType === 'paravet') {
        router.replace('/(peravet_tabs)/onboarding');
      } else {
        const role = ROLES.find(r => r.key === loginType);
        router.replace(role?.route || '/(doc_tabs)/onboarding/veterinarian_detail');
      }
    } else {
      Alert.alert('Sign Up Failed', result.payload || 'An error occurred');
    }
  };

  const handleResendOTP = async () => {
    setOtpLoading(true);
    try {
      const contact = otpMethod === 'phone'
        ? { phoneNumber: `+91${formData.phone.trim()}` }
        : { email: formData.email.trim().toLowerCase() };

      const res = await fetchWithTimeout(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      const data = await res.json();
      if (res.ok) {
        setVerificationId(data.verificationId);
        Alert.alert('OTP Resent!', data.otp ? `New OTP: ${data.otp}` : 'New OTP sent successfully.');
      } else {
        Alert.alert('Error', data.message || 'Failed to resend OTP');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // ── STEP 2: OTP Screen ──
  if (step === 2) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Stethoscope size={40} color="#2E7D32" style={styles.logo} />
              <Text style={styles.title}>Verify OTP</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to your{' '}
                <Text style={{ fontWeight: '600', color: '#2E7D32' }}>
                  {otpMethod === 'phone' ? `+91${formData.phone}` : formData.email}
                </Text>
              </Text>
            </View>

            <View style={styles.form}>
              <OTPInput onComplete={(otp) => setEnteredOtp(otp)} />

              <TouchableOpacity
                style={[styles.signUpButton, (otpLoading || isLoading) && styles.buttonDisabled]}
                onPress={handleVerifyAndRegister}
                disabled={otpLoading || isLoading}
              >
                <Text style={styles.signUpButtonText}>
                  {otpLoading || isLoading ? 'Verifying...' : 'Verify & Create Account'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.resendBtn} onPress={handleResendOTP} disabled={otpLoading}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
                <Text style={styles.backText}>← Change Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ── STEP 1: Form Screen ──
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Stethoscope size={40} color="#2E7D32" style={styles.logo} />
              <Text style={styles.appName}>Vetician Provider</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up as a service provider</Text>
          </View>

          <View style={styles.form}>
            {[
              { field: 'name', placeholder: 'Full Name', icon: <User size={20} color="#888" style={styles.inputIcon} />, autoCapitalize: 'words' },
              { field: 'email', placeholder: 'Email', icon: <Mail size={20} color="#888" style={styles.inputIcon} />, keyboardType: 'email-address', autoCapitalize: 'none' },
            ].map(({ field, placeholder, icon, ...rest }) => (
              <View key={field} style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  {icon}
                  <TextInput
                    style={[styles.input, errors[field] && styles.inputError]}
                    placeholder={placeholder}
                    placeholderTextColor="#aaa"
                    value={formData[field]}
                    onChangeText={value => handleInputChange(field, field === 'email' ? value.replace('mailto:', '') : value)}
                    {...rest}
                  />
                </View>
                {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
              </View>
            ))}

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Phone size={20} color="#888" style={styles.inputIcon} />
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  placeholder="Phone Number"
                  placeholderTextColor="#aaa"
                  value={formData.phone}
                  onChangeText={value => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {[
              { field: 'password', placeholder: 'Password', show: showPassword, toggle: () => setShowPassword(!showPassword) },
              { field: 'confirmPassword', placeholder: 'Confirm Password', show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword) },
            ].map(({ field, placeholder, show, toggle }) => (
              <View key={field} style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Lock size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors[field] && styles.inputError]}
                    placeholder={placeholder}
                    placeholderTextColor="#aaa"
                    value={formData[field]}
                    onChangeText={value => handleInputChange(field, value)}
                    secureTextEntry={!show}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity style={styles.eyeButton} onPress={toggle}>
                    {show ? <EyeOff size={20} color="#888" /> : <Eye size={20} color="#888" />}
                  </TouchableOpacity>
                </View>
                {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
              </View>
            ))}

            <Text style={styles.roleLabel}>I am a:</Text>
            <View style={styles.roleContainer}>
              {ROLES.map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.roleButton, loginType === key && styles.roleButtonActive]}
                  onPress={() => setLoginType(key)}
                >
                  <Text style={[styles.roleText, loginType === key && styles.roleTextActive]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* OTP Method Selector */}
            <Text style={styles.roleLabel}>Send OTP via:</Text>
            <View style={styles.otpMethodContainer}>
              {[{ key: 'phone', label: '📱 Phone' }, { key: 'email', label: '📧 Email' }].map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.otpMethodBtn, otpMethod === key && styles.otpMethodBtnActive]}
                  onPress={() => setOtpMethod(key)}
                >
                  <Text style={[styles.otpMethodText, otpMethod === key && styles.otpMethodTextActive]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, otpLoading && styles.buttonDisabled]}
              onPress={handleSendOTP}
              disabled={otpLoading}
            >
              <Text style={styles.signUpButtonText}>{otpLoading ? 'Sending OTP...' : 'Send OTP & Continue'}</Text>
            </TouchableOpacity>

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 35 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 30, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logo: { marginRight: 10 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32' },
  title: { fontSize: 26, fontWeight: '600', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#888', textAlign: 'center', lineHeight: 22 },
  form: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  inputContainer: { marginBottom: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, borderWidth: 1, borderColor: '#eaeaea', paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  countryCode: { fontSize: 16, color: '#333', marginRight: 8, fontWeight: '500' },
  input: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  inputError: { borderColor: '#ff6b6b' },
  eyeButton: { padding: 4 },
  errorText: { color: '#ff6b6b', fontSize: 14, marginTop: 8 },
  roleLabel: { fontSize: 16, color: '#666', marginBottom: 12, fontWeight: '500' },
  roleContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  roleButton: { flex: 1, minWidth: '45%', paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: '#eaeaea', alignItems: 'center', backgroundColor: '#f8f9fa' },
  roleButtonActive: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  roleText: { fontSize: 14, color: '#666', fontWeight: '500' },
  roleTextActive: { color: '#fff', fontWeight: '600' },
  otpMethodContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  otpMethodBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#eaeaea', alignItems: 'center', backgroundColor: '#f8f9fa' },
  otpMethodBtnActive: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  otpMethodText: { fontSize: 14, color: '#666', fontWeight: '500' },
  otpMethodTextActive: { color: '#fff', fontWeight: '600' },
  signUpButton: { backgroundColor: '#2E7D32', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 5 },
  buttonDisabled: { backgroundColor: '#ccc', elevation: 0 },
  signUpButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  signInContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  signInText: { fontSize: 15, color: '#888' },
  signInLink: { fontSize: 15, color: '#2E7D32', fontWeight: '600' },
  resendBtn: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  resendText: { color: '#2E7D32', fontSize: 16, fontWeight: '600' },
  backBtn: { alignItems: 'center', marginTop: 8, paddingVertical: 8 },
  backText: { color: '#888', fontSize: 15 },
});
