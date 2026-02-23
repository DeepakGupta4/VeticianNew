// import { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useDispatch, useSelector } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { signInUser } from '../../store/slices/authSlice';
// import { validateEmail } from '../../utils/validation';
// import { Eye, EyeOff, Mail, Lock, PawPrint } from 'lucide-react-native';

// export default function SignIn() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loginType, setLoginType] = useState('vetician');

//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { isLoading, error } = useSelector(state => state.auth);

//   const handleSignIn = async () => {
//     console.log('📱 LOGIN COMPONENT - handleSignIn started');
//     console.log('📱 LOGIN COMPONENT - Input values:', {
//       email: email,
//       password: password ? '***PROVIDED***' : 'MISSING',
//       loginType: loginType
//     });

//     // Reset errors
//     setErrors({});
//     console.log('📱 LOGIN COMPONENT - Errors reset');

//     // Validation
//     console.log('📱 LOGIN COMPONENT - Starting validation...');
//     const newErrors = {};
//     if (!email.trim()) {
//       newErrors.email = 'Email is required';
//       console.log('❌ LOGIN COMPONENT - Email validation failed: empty');
//     } else if (!validateEmail(email)) {
//       newErrors.email = 'Please enter a valid email';
//       console.log('❌ LOGIN COMPONENT - Email validation failed: invalid format');
//     } else {
//       console.log('✅ LOGIN COMPONENT - Email validation passed');
//     }

//     if (!password.trim()) {
//       newErrors.password = 'Password is required';
//       console.log('❌ LOGIN COMPONENT - Password validation failed: empty');
//     } else if (password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//       console.log('❌ LOGIN COMPONENT - Password validation failed: too short');
//     } else {
//       console.log('✅ LOGIN COMPONENT - Password validation passed');
//     }

//     if (Object.keys(newErrors).length > 0) {
//       console.log('❌ LOGIN COMPONENT - Validation failed, errors:', newErrors);
//       setErrors(newErrors);
//       return;
//     }
//     console.log('✅ LOGIN COMPONENT - All validations passed');

//     try {
//       console.log('🚀 LOGIN COMPONENT - Dispatching signInUser action...');
//       console.log('📋 LOGIN COMPONENT - Dispatch params:', {
//         email: email,
//         password: password ? '***HIDDEN***' : 'MISSING',
//         loginType: loginType
//       });
      
//       const result = await dispatch(signInUser({ email, password, loginType })).unwrap();
      
//       console.log('✅ LOGIN COMPONENT - signInUser dispatch successful');
//       console.log('📄 LOGIN COMPONENT - Result:', {
//         success: result.success,
//         message: result.message,
//         hasUser: !!result.user,
//         hasToken: !!result.token,
//         userRole: result.user?.role
//       });
      
//       if (result.success) {
//         console.log('🎉 LOGIN COMPONENT - Login successful, checking tour completion for loginType:', loginType);
        
//         // Check tour completion for vetician users
//         if (loginType === 'vetician') {
//           // Clear tour completion for testing - remove this line after testing
//           await AsyncStorage.removeItem('tourCompleted');
          
//           const tourCompleted = await AsyncStorage.getItem('tourCompleted');
//           console.log('🔍 LOGIN COMPONENT - Tour completed status:', tourCompleted);
          
//           if (!tourCompleted) {
//             console.log('📚 LOGIN COMPONENT - Routing to QuickTour');
//             router.replace('/(vetician_tabs)/pages/QuickTour');
//             return;
//           }
//         }
        
//         // Route to appropriate tabs based on login type
//         switch(loginType) {
//           case 'veterinarian':
//             console.log('🏥 LOGIN COMPONENT - Routing to veterinarian tabs');
//             router.replace('/(doc_tabs)');
//             break;
//           case 'pet_resort':
//             console.log('🏨 LOGIN COMPONENT - Routing to pet resort tabs');
//             router.replace('/(pet_resort_tabs)');
//             break;
//           case 'paravet':
//             console.log('🐕 LOGIN COMPONENT - Routing to paravet tabs');
//             router.replace('/(peravet_tabs)/(tabs)');
//             break;
//           default: // vetician
//             console.log('👤 LOGIN COMPONENT - Routing to vetician tabs (default)');
//             router.replace('/(vetician_tabs)');
//         }
//       } else {
//         console.log('❌ LOGIN COMPONENT - Login failed, result.success is false');
//       }
//     } catch (error) {
//       console.log('❌ LOGIN COMPONENT - Caught error in handleSignIn:', error);
//       console.log('❌ LOGIN COMPONENT - Error type:', typeof error);
//       console.log('❌ LOGIN COMPONENT - Error message:', error.message || error);
//       console.log('❌ LOGIN COMPONENT - Full error object:', JSON.stringify(error, null, 2));
      
//       Alert.alert('Sign In Failed', error || 'An error occurred during sign in');
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <View style={styles.logoContainer}>
//             <PawPrint size={40} color="#4A90E2" style={styles.logo} />
//             <Text style={styles.appName}>Vetician</Text>
//           </View>
//           <Text style={styles.title}>Welcome Back</Text>
//           <Text style={styles.subtitle}>Sign in to continue</Text>
//         </View>

//         <View style={styles.form}>
//           <View style={styles.inputContainer}>
//             <View style={styles.inputWrapper}>
//               <Mail size={20} color="#888" style={styles.inputIcon} />
//               <TextInput
//                 style={[styles.input, errors.email && styles.inputError]}
//                 placeholder="Email"
//                 placeholderTextColor="#aaa"
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//               />
//             </View>
//             {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//           </View>

//           <View style={styles.inputContainer}>
//             <View style={styles.inputWrapper}>
//               <Lock size={20} color="#888" style={styles.inputIcon} />
//               <TextInput
//                 style={[styles.input, errors.password && styles.inputError]}
//                 placeholder="Password"
//                 placeholderTextColor="#aaa"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity
//                 style={styles.eyeButton}
//                 onPress={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <EyeOff size={20} color="#888" />
//                 ) : (
//                   <Eye size={20} color="#888" />
//                 )}
//               </TouchableOpacity>
//             </View>
//             {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
//           </View>

//           {error && (
//             <View style={styles.errorContainer}>
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           )}

//           <Text style={styles.loginTypeLabel}>I am a:</Text>
//           <View style={styles.loginTypeContainer}>
//             <View style={styles.loginTypeButtons}>
//               <TouchableOpacity
//                 style={[
//                   styles.loginTypeButton,
//                   loginType === 'vetician' && styles.loginTypeButtonActive
//                 ]}
//                 onPress={() => setLoginType('vetician')}
//               >
//                 <PawPrint size={16} color={loginType === 'vetician' ? '#fff' : '#666'} />
//                 <Text style={[
//                   styles.loginTypeText,
//                   loginType === 'vetician' && styles.loginTypeTextActive
//                 ]}>
//                   Pet Parent
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.loginTypeButton,
//                   loginType === 'veterinarian' && styles.loginTypeButtonActive
//                 ]}
//                 onPress={() => setLoginType('veterinarian')}
//               >
//                 <PawPrint size={16} color={loginType === 'veterinarian' ? '#fff' : '#666'} />
//                 <Text style={[
//                   styles.loginTypeText,
//                   loginType === 'veterinarian' && styles.loginTypeTextActive
//                 ]}>
//                   Veterinarian
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.loginTypeButton,
//                   loginType === 'paravet' && styles.loginTypeButtonActive
//                 ]}
//                 onPress={() => setLoginType('paravet')}
//               >
//                 <PawPrint size={16} color={loginType === 'paravet' ? '#fff' : '#666'} />
//                 <Text style={[
//                   styles.loginTypeText,
//                   loginType === 'paravet' && styles.loginTypeTextActive
//                 ]}>
//                   Paravet
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.loginTypeButton,
//                   loginType === 'pet_resort' && styles.loginTypeButtonActive
//                 ]}
//                 onPress={() => setLoginType('pet_resort')}
//               >
//                 <PawPrint size={16} color={loginType === 'pet_resort' ? '#fff' : '#666'} />
//                 <Text style={[
//                   styles.loginTypeText,
//                   loginType === 'pet_resort' && styles.loginTypeTextActive
//                 ]}>
//                   Pet Resort
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[styles.signInButton, isLoading && styles.buttonDisabled]}
//             onPress={handleSignIn}
//             disabled={isLoading}
//           >
//             <Text style={styles.signInButtonText}>
//               {isLoading ? 'Signing In...' : 'Sign In'}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.phoneButton}
//             onPress={() => router.push('/(auth)/phone')}
//           >
//             <Text style={styles.phoneButtonText}>Sign in with Phone</Text>
//           </TouchableOpacity>

//           <View style={styles.signUpContainer}>
//             <Text style={styles.signUpText}>Don't have an account? </Text>
//             <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
//               <Text style={styles.signUpLink}>Sign Up</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Added coming soon notice */}
//           <View style={styles.comingSoonContainer}>
//             <Text style={styles.comingSoonText}>Pet Resort and Peravet features coming soon !</Text>
//           </View>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 30,
//     paddingBottom: 40,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     marginRight: 10,
//   },
//   appName: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#4A90E2',
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#888',
//   },
//   form: {
//     width: '100%',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#eaeaea',
//     paddingHorizontal: 16,
//     height: 56,
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     height: '100%',
//   },
//   inputError: {
//     borderColor: '#ff6b6b',
//   },
//   eyeButton: {
//     padding: 4,
//   },
//   errorContainer: {
//     marginTop: 8,
//     marginBottom: 16,
//   },
//   errorText: {
//     color: '#ff6b6b',
//     fontSize: 14,
//     marginTop: 8,
//   },
//   loginTypeContainer: {
//     marginBottom: 20,
//   },
//   loginTypeLabel: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 12,
//     fontWeight: '500',
//   },
//   loginTypeButtons: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     gap: 10,
//   },
//   loginTypeButton: {
//     flex: 1,
//     minWidth: '48%',
//     paddingVertical: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#eaeaea',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     marginBottom: 8,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 6,
//   },
//   loginTypeButtonActive: {
//     backgroundColor: '#4A90E2',
//     borderColor: '#4A90E2',
//   },
//   loginTypeText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },
//   loginTypeTextActive: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   signInButton: {
//     backgroundColor: '#4A90E2',
//     borderRadius: 12,
//     height: 56,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 10,
//     shadowColor: '#4A90E2',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   buttonDisabled: {
//     backgroundColor: '#a0a0a0',
//     shadowColor: '#a0a0a0',
//   },
//   signInButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   phoneButton: {
//     backgroundColor: '#fff',
//     borderWidth: 2,
//     borderColor: '#4A90E2',
//     borderRadius: 12,
//     height: 56,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 12,
//   },
//   phoneButtonText: {
//     color: '#4A90E2',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   signUpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 24,
//   },
//   signUpText: {
//     fontSize: 15,
//     color: '#888',
//   },
//   signUpLink: {
//     fontSize: 15,
//     color: '#4A90E2',
//     fontWeight: '600',
//   },
//   // New styles for coming soon notice
//   comingSoonContainer: {
//     marginTop: 16,
//     padding: 12,
//     backgroundColor: '#f0f7ff',
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#4A90E2',
//   },
//   comingSoonText: {
//     color: '#4A90E2',
//     fontSize: 14,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
// });

import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInUser, clearLoading } from '../../store/slices/authSlice';
import { validateEmail } from '../../utils/validation';
import { Eye, EyeOff, Mail, Lock, PawPrint, User, Briefcase } from 'lucide-react-native';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [category, setCategory] = useState('consumer'); // consumer, provider, or admin
  const [loginType, setLoginType] = useState('vetician');

  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  // Clear loading state on component mount to prevent stuck loading button
  useEffect(() => {
    dispatch(clearLoading());
  }, [dispatch]);

  const handleSignIn = async () => {
    setErrors({});

    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await dispatch(signInUser({ email, password, loginType })).unwrap();
      
      if (result.success) {
        await handlePostLoginRouting(loginType);
      }
    } catch (error) {
      Alert.alert('Login Failed', error || 'Invalid credentials');
    }
  };

  const handlePostLoginRouting = async (type) => {
    try {
      console.log('🔄 Routing for type:', type);
      
      switch(type) {
        case 'vetician':
          await handleUserLogin();
          break;
        case 'veterinarian':
          router.replace('/(doc_tabs)');
          break;
        case 'paravet':
          router.replace('/(peravet_tabs)/(tabs)');
          break;
        case 'pet_resort':
          router.replace('/(pet_resort_tabs)');
          break;
        case 'admin':
          router.replace('/(admin_tabs)');
          break;
        default:
          console.log('⚠️ Unknown login type:', type);
          router.replace('/(vetician_tabs)');
      }
    } catch (error) {
      console.error('❌ Routing error:', error);
      Alert.alert('Error', 'Navigation failed. Please restart the app.');
    }
  };

  const handleUserLogin = async () => {
    try {
      const tourCompleted = await AsyncStorage.getItem('tourCompleted');
      
      if (!tourCompleted) {
        router.replace('/(vetician_tabs)/pages/QuickTour');
      } else {
        router.replace('/(vetician_tabs)');
      }
    } catch (error) {
      console.error('❌ User login routing error:', error);
      router.replace('/(vetician_tabs)');
    }
  };



  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    // Auto-select first option of the new category
    if (newCategory === 'consumer') {
      setLoginType('vetician');
    } else if (newCategory === 'provider') {
      setLoginType('veterinarian');
    } else if (newCategory === 'admin') {
      setLoginType('admin');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <PawPrint size={40} color="#4A90E2" style={styles.logo} />
            <Text style={styles.appName}>Vetician</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
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
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
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
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#888" />
                ) : (
                  <Eye size={20} color="#888" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Category Selection: Consumer, Provider, or Admin */}
          <Text style={styles.categoryLabel}>I am a:</Text>
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                category === 'consumer' && styles.categoryButtonActive
              ]}
              onPress={() => handleCategoryChange('consumer')}
            >
              <User size={20} color={category === 'consumer' ? '#fff' : '#666'} />
              <Text style={[
                styles.categoryText,
                category === 'consumer' && styles.categoryTextActive
              ]}>
                Consumer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                category === 'provider' && styles.categoryButtonActive
              ]}
              onPress={() => handleCategoryChange('provider')}
            >
              <Briefcase size={20} color={category === 'provider' ? '#fff' : '#666'} />
              <Text style={[
                styles.categoryText,
                category === 'provider' && styles.categoryTextActive
              ]}>
                Provider
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryButtonSmall,
                category === 'admin' && styles.categoryButtonActive
              ]}
              onPress={() => handleCategoryChange('admin')}
            >
              <Lock size={18} color={category === 'admin' ? '#fff' : '#666'} />
              <Text style={[
                styles.categoryText,
                category === 'admin' && styles.categoryTextActive
              ]}>
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          {/* Role Selection based on Category */}
          {category === 'admin' ? null : category === 'consumer' ? (
            <>
              <Text style={styles.loginTypeLabel}>Select your role:</Text>
              <View style={styles.loginTypeContainer}>
                <View style={styles.loginTypeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.loginTypeButton,
                      loginType === 'vetician' && styles.loginTypeButtonActive
                    ]}
                    onPress={() => setLoginType('vetician')}
                  >
                    <PawPrint size={16} color={loginType === 'vetician' ? '#fff' : '#666'} />
                    <Text style={[
                      styles.loginTypeText,
                      loginType === 'vetician' && styles.loginTypeTextActive
                    ]}>
                      Pet Parent
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.loginTypeButton,
                      loginType === 'pet_resort' && styles.loginTypeButtonActive
                    ]}
                    onPress={() => setLoginType('pet_resort')}
                  >
                    <PawPrint size={16} color={loginType === 'pet_resort' ? '#fff' : '#666'} />
                    <Text style={[
                      styles.loginTypeText,
                      loginType === 'pet_resort' && styles.loginTypeTextActive
                    ]}>
                      Pet Resort
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.loginTypeLabel}>Select your role:</Text>
              <View style={styles.loginTypeContainer}>
                <View style={styles.loginTypeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.loginTypeButton,
                      loginType === 'veterinarian' && styles.loginTypeButtonActive
                    ]}
                    onPress={() => setLoginType('veterinarian')}
                  >
                    <PawPrint size={16} color={loginType === 'veterinarian' ? '#fff' : '#666'} />
                    <Text style={[
                      styles.loginTypeText,
                      loginType === 'veterinarian' && styles.loginTypeTextActive
                    ]}>
                      Veterinarian
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.loginTypeButton,
                      loginType === 'paravet' && styles.loginTypeButtonActive
                    ]}
                    onPress={() => setLoginType('paravet')}
                  >
                    <PawPrint size={16} color={loginType === 'paravet' ? '#fff' : '#666'} />
                    <Text style={[
                      styles.loginTypeText,
                      loginType === 'paravet' && styles.loginTypeTextActive
                    ]}>
                      Paravet
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.signInButton, isLoading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.signInButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.phoneButton}
            onPress={() => router.push('/(auth)/phone')}
          >
            <Text style={styles.phoneButtonText}>Sign in with Phone</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonText}>Pet Resort and Paravet features coming soon!</Text>
          </View>
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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    marginRight: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  form: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
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
  inputError: {
    borderColor: '#ff6b6b',
  },
  eyeButton: {
    padding: 4,
  },
  errorContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 8,
  },
  // Category Selection Styles
  categoryLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eaeaea',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  categoryButtonSmall: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eaeaea',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  categoryText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  // Login Type Selection Styles
  loginTypeContainer: {
    marginBottom: 20,
  },
  loginTypeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  loginTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  loginTypeButton: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eaeaea',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  loginTypeButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  loginTypeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  loginTypeTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  phoneButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  phoneButtonText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontSize: 15,
    color: '#888',
  },
  signUpLink: {
    fontSize: 15,
    color: '#4A90E2',
    fontWeight: '600',
  },
  comingSoonContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  comingSoonText: {
    color: '#4A90E2',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});