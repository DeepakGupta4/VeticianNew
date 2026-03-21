import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../../store/slices/authSlice';
import { validateEmail } from '../../utils/validation';
import { Eye, EyeOff, Mail, Lock, User, PawPrint, Phone } from 'lucide-react-native';

export default function SignUp() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [timeoutWarning, setTimeoutWarning] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSignUp = async () => {
    if (isLoading) return;
    setErrors({});
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit phone number';
    if (!formData.password.trim() || formData.password.length < 6) newErrors.password = 'Password must be 6+ chars';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    try {
      const warningTimer = setTimeout(() => setTimeoutWarning(true), 3000);
      const result = await dispatch(signUpUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: `+91${formData.phone.trim()}`,
        password: formData.password,
        loginType: 'vetician',
      }));
      clearTimeout(warningTimer);
      setTimeoutWarning(false);

      if (signUpUser.fulfilled.match(result)) {
        router.replace('/(vetician_tabs)/pages/VeticianWelcomeScreen');
      } else {
        throw new Error(result.payload || 'Sign up failed');
      }
    } catch (err) {
      setErrors({ general: typeof err === 'string' ? err : (err.message || 'An error occurred') });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <PawPrint size={40} color="#4A90E2" style={styles.logo} />
              <Text style={styles.appName}>Vetician</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up as Pet Parent</Text>
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

            {(errors.general || timeoutWarning) && (
              <View style={styles.errorContainer}>
                {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
                {timeoutWarning && <Text style={styles.warningText}>Taking longer than usual... Please wait</Text>}
              </View>
            )}

            <TouchableOpacity style={[styles.signUpButton, isLoading && styles.buttonDisabled]} onPress={handleSignUp} disabled={isLoading}>
              <Text style={styles.signUpButtonText}>{isLoading ? 'Creating Account...' : 'Create Account'}</Text>
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
  appName: { fontSize: 28, fontWeight: 'bold', color: '#4A90E2' },
  title: { fontSize: 26, fontWeight: '600', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#888' },
  form: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  inputContainer: { marginBottom: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, borderWidth: 1, borderColor: '#eaeaea', paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  countryCode: { fontSize: 16, color: '#333', marginRight: 8, fontWeight: '500' },
  input: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  inputError: { borderColor: '#ff6b6b' },
  eyeButton: { padding: 4 },
  errorContainer: { marginTop: 8, marginBottom: 16 },
  errorText: { color: '#ff6b6b', fontSize: 14, marginTop: 8 },
  warningText: { color: '#ff9500', fontSize: 14, marginTop: 8, fontStyle: 'italic' },
  signUpButton: { backgroundColor: '#4A90E2', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 5 },
  buttonDisabled: { backgroundColor: '#ccc', elevation: 0 },
  signUpButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  signInContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  signInText: { fontSize: 15, color: '#888' },
  signInLink: { fontSize: 15, color: '#4A90E2', fontWeight: '600' },
});
