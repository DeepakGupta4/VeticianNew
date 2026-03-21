import { React, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, Home, Menu } from 'lucide-react-native';
import { parentUser } from '../../../store/slices/authSlice';
import { validateEmail } from '../../../utils/validation';

export default function PetDetail() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  // Disable the back button
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => null,
  //     gestureEnabled: false,
  //   });
  // }, [navigation]);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    setErrors({});

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Parent name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await dispatch(parentUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        address: formData.address
      })).unwrap();

      if (result.success) {
        Alert.alert(
          'Success',
          'Parent information has been saved successfully!',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', error || 'An error occurred while saving parent information');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Pet Parent Information</Text>
            <Text style={styles.subtitle}>Fill the parent information</Text>
          </View>

          <View style={styles.form}>

            {/* parent name and email */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Parent Name and Email</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <User size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Enter parent's full name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Enter email address"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>
            </View>

            {/* phone number */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Phone size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.phone && styles.inputError]}
                    placeholder="Phone number"
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    keyboardType="phone-pad"
                  />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>
            </View>

            {/* Adress */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Home size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.address && styles.inputError]}
                    placeholder="Enter complete address including city, state, and postal code"
                    value={formData.address}
                    onChangeText={(value) => handleInputChange('address', value)}
                    multiline
                  />
                </View>
                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            // disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {/* {isLoading ? 'Saving Information...' : 'Save Parent Information'}  */}
                Save Parent Information
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 15,
    paddingLeft: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    paddingRight: 20
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 5,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
