import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { signInUser, clearLoading } from '../../store/slices/authSlice';
import { validateEmail } from '../../utils/validation';
import { Eye, EyeOff, Mail, Lock, Stethoscope } from 'lucide-react-native';

const ROLES = [
  { key: 'veterinarian', label: 'Veterinarian' },
  { key: 'paravet', label: 'Paravet' },
  { key: 'pet_resort', label: 'Pet Resort' },
  { key: 'admin', label: 'Admin' },
];

const ROUTES = {
  veterinarian: '/(doc_tabs)',
  paravet: '/(peravet_tabs)/(tabs)',
  pet_resort: '/(pet_resort_tabs)',
  admin: '/(admin_tabs)',
};

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginType, setLoginType] = useState('veterinarian');

  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  useEffect(() => { dispatch(clearLoading()); }, [dispatch]);

  const handleSignIn = async () => {
    setErrors({});
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Please enter a valid email';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    try {
      const result = await dispatch(signInUser({ email, password, loginType })).unwrap();
      if (result.success) router.replace(ROUTES[loginType] || '/(doc_tabs)');
    } catch (err) {
      Alert.alert('Login Failed', err || 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Stethoscope size={40} color="#2E7D32" style={styles.logo} />
              <Text style={styles.appName}>Vetician Provider</Text>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your provider account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Mail size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={text => setEmail(text.replace('mailto:', ''))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color="#888" /> : <Eye size={20} color="#888" />}
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

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

            <TouchableOpacity style={[styles.signInButton, isLoading && styles.buttonDisabled]} onPress={handleSignIn} disabled={isLoading}>
              <Text style={styles.signInButtonText}>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.phoneButton} onPress={() => router.push('/(auth)/phone')}>
              <Text style={styles.phoneButtonText}>Sign in with Phone</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 30, paddingVertical: 40 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logo: { marginRight: 10 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32' },
  title: { fontSize: 26, fontWeight: '600', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#888' },
  form: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  inputContainer: { marginBottom: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, borderWidth: 1, borderColor: '#eaeaea', paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 12 },
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
  signInButton: { backgroundColor: '#2E7D32', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 5 },
  buttonDisabled: { backgroundColor: '#a0a0a0' },
  signInButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  phoneButton: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#2E7D32', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  phoneButtonText: { color: '#2E7D32', fontSize: 18, fontWeight: '600' },
  signUpContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  signUpText: { fontSize: 15, color: '#888' },
  signUpLink: { fontSize: 15, color: '#2E7D32', fontWeight: '600' },
});
