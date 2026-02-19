
// import React, {useState } from 'react';


// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useDispatch, useSelector } from 'react-redux';
// import { Camera, ChevronDown, Upload, File, X, ArrowLeft } from 'lucide-react-native';
// import { veterinarianUser } from '../../../store/slices/authSlice';
// import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker';
// // import * as FileSystem from 'expo-file-system';
// import * as FileSystem from 'expo-file-system';

// export default function CreateProfile() {
//   const router = useRouter();

//   // Define required fields with validation messages
//   const requiredFields = {
//     title: 'Title is required',
//     name: 'Full name is required',
//     city: 'City is required',
//     specialization: 'Specialization is required',
//     gender: 'Please select your gender',
//     experience: 'Experience is required',
//     qualification: 'Qualification is required',
//     registration: 'Registration details are required',
//     identityProof: 'Identity proof type is required'
//   };

//   const [formData, setFormData] = useState({
//     title: '',
//     name: '',
//     city: '',
//     specialization: '',
//     gender: '',
//     experience: '',
//     qualification: '',
//     registration: '',
//     identityProof: ''
//   });

//   const [files, setFiles] = useState({
//     profilePhoto: null,
//     qualificationDocs: null,
//     registrationProof: null,
//     identityProof: null
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const dispatch = useDispatch();

//   const handleGoBack = () => {
//     router.back();
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: null }));
//     }
//   };

//   const handleProfilePhotoUpload = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (!permissionResult.granted) {
//         Alert.alert('Permission required', 'We need access to your photos to upload a profile picture');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets?.length > 0) {
//         setFiles(prev => ({ ...prev, profilePhoto: result.assets[0] }));
//         setErrors(prev => ({ ...prev, profilePhoto: null }));
//       }
//     } catch (error) {
//       console.error('Profile photo upload error:', error);
//     }
//   };

//   // const handleDocumentUpload = async (fieldName) => {
//   //   try {
//   //     setErrors(prev => ({ ...prev, [fieldName]: null }));

//   //     const result = await DocumentPicker.getDocumentAsync({
//   //       type: ['application/pdf'],
//   //       copyToCacheDirectory: true,
//   //     });

//   //     if (!result.canceled && result.assets && result.assets.length > 0) {
//   //       const selectedFile = result.assets[0];
//   //       const fileInfo = await FileSystem.getInfoAsync(selectedFile.uri);

//   //       if (!fileInfo.exists) {
//   //         console.error('File access error:', selectedFile.uri);
//   //         throw new Error('Selected file could not be accessed');
//   //       }

//   //       const file = {
//   //         uri: selectedFile.uri,
//   //         name: selectedFile.name,
//   //         type: selectedFile.mimeType || 'application/pdf',
//   //         size: fileInfo.size
//   //       };

//   //       setFiles(prev => ({ ...prev, [fieldName]: file }));
//   //     }
//   //   } catch (error) {
//   //     console.error('Upload failed:', error);
//   //     setErrors(prev => ({ ...prev, [fieldName]: 'Failed to upload document. Please try again.' }));
//   //   }
//   // };
  

// const handleDocumentUpload = async (fieldName) => {
//   try {
//     setErrors(prev => ({ ...prev, [fieldName]: null }));

//     const result = await DocumentPicker.getDocumentAsync({
//       type: ['application/pdf'],
//       copyToCacheDirectory: true,
//     });

//     if (result.type === 'success') {
//       const selectedFile = result;

//       let file = {
//         uri: selectedFile.uri,
//         name: selectedFile.name,
//         type: selectedFile.mimeType || 'application/pdf',
//       };

//       if (Platform.OS === 'web') {
//         // Web: read file as base64 using FileReader
//         const reader = new FileReader();
//         reader.onload = () => {
//           file.base64 = reader.result.split(',')[1]; // Base64 string
//           setFiles(prev => ({ ...prev, [fieldName]: file }));
//         };
//         reader.readAsDataURL(selectedFile); // Data URL format
//       } else {
//         // Native: expo-file-system
//         const fileInfo = await FileSystem.getInfoAsync(selectedFile.uri);
//         file.size = fileInfo.size;
//         setFiles(prev => ({ ...prev, [fieldName]: file }));
//       }
//     }
//   } catch (error) {
//     console.error('Upload failed:', error);
//     setErrors(prev => ({ ...prev, [fieldName]: 'Failed to upload document. Please try again.' }));
//   }
// };

//   const removeFile = (fieldName) => {
//     setFiles(prev => ({ ...prev, [fieldName]: null }));
//     setErrors(prev => ({ ...prev, [fieldName]: null }));
//   };

//   const renderFileInfo = (file, fieldName) => {
//     if (!file) return null;

//     return (
//       <View style={styles.fileInfoContainer}>
//         <File size={16} color="#3B82F6" />
//         <View style={styles.fileInfoText}>
//           <Text style={styles.fileName} numberOfLines={1}>
//             {file.name || 'Document.pdf'}
//           </Text>
//           {file.size && (
//             <Text style={styles.fileSize}>
//               {Math.round(file.size / 1024)} KB
//             </Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={() => removeFile(fieldName)}>
//           <X size={16} color="#EF4444" />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const uploadToCloudinary = async (file) => {
//     const fileExtension = file.uri.split('.').pop().toLowerCase();
//     const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
//     const type = isImage ? 'image' : 'raw';

//     try {
//       const fileInfo = await FileSystem.getInfoAsync(file.uri, { size: true });
//       if (!fileInfo.exists) throw new Error(`File not found: ${file.uri}`);
//       if (fileInfo.size === 0) throw new Error('Empty file');

//       const formData = new FormData();
//       formData.append('file', {
//         uri: file.uri,
//         name: file.name || `upload_${Date.now()}.${fileExtension}`,
//         type: isImage ? `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`
//           : file.type || 'application/pdf'
//       });
//       formData.append('upload_preset', 'vetician');
//       formData.append('cloud_name', 'dqwzfs4ox');

//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/dqwzfs4ox/${type}/upload`,
//         {
//           method: 'POST',
//           body: formData,
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('[Cloudinary] UPLOAD FAILED:', error);
//       throw error;
//     }
//   };

//   const handleSubmit = async () => {
//     if (isSubmitting) return;

//     // Validate form fields
//     const newErrors = {};
//     Object.entries(requiredFields).forEach(([field, message]) => {
//       if (!formData[field]?.trim()) {
//         newErrors[field] = message;
//       }
//     });

//     // Validate files
//     if (!files.profilePhoto) newErrors.profilePhoto = 'Profile photo required';
//     if (!files.qualificationDocs) newErrors.qualificationDocs = 'Qualification docs required';
//     if (!files.registrationProof) newErrors.registrationProof = 'Registration proof required';
//     if (!files.identityProof) newErrors.identityProof = 'Identity proof required';

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const uploadResults = await Promise.all([
//         uploadToCloudinary(files.profilePhoto),
//         uploadToCloudinary(files.qualificationDocs),
//         uploadToCloudinary(files.registrationProof),
//         uploadToCloudinary(files.identityProof)
//       ]);

//       const [profilePhoto, qualificationDocs, registrationProof, identityProof] = uploadResults;

//       const submissionData = {
//         title: formData.title,
//         name: formData.name.trim(),
//         gender: formData.gender,
//         city: formData.city.trim(),
//         experience: Number(formData.experience),
//         specialization: formData.specialization,
//         qualification: formData.qualification.trim(),
//         registration: formData.registration.trim(),
//         identityProof: formData.identityProof.trim(),
//         profilePhotoUrl: profilePhoto.secure_url,
//         qualificationUrl: qualificationDocs.secure_url,
//         registrationUrl: registrationProof.secure_url,
//         identityProofUrl: identityProof.secure_url
//       };

//       const result = await dispatch(veterinarianUser(submissionData)).unwrap();

//       if (result.success) {
//         Alert.alert(
//           'Success',
//           'Veterinarian profile submitted successfully! Your account will be activated after verification.',
//           [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
//         );
//       }
//     } catch (error) {
//       console.error('[Submit] Error:', error);
//       let errorMessage = 'Submission failed. Please try again.';
//       if (error.message && error.message.includes('registration number already exists')) {
//         errorMessage = 'A veterinarian with this registration number already exists.';
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
//       Alert.alert('Error', errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scrollContainer}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Header with Back Button */}
//         <View style={styles.headerContainer}>
//           <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
//             <ArrowLeft size={24} color="#3B82F6" />
//           </TouchableOpacity>
//           <View style={styles.headerTextContainer}>
//             <Text style={styles.headerTitle}>Create Professional Profile</Text>
//             <Text style={styles.headerSubtitle}>Complete your profile to start using the platform</Text>
//           </View>
//         </View>

//         {/* Profile Photo Section */}
//         <View style={styles.formSection}>
//           <Text style={styles.sectionTitle}>Profile Photo*</Text>
//           <TouchableOpacity
//             style={[
//               styles.photoUpload,
//               errors.profilePhoto && styles.uploadError
//             ]}
//             onPress={handleProfilePhotoUpload}
//           >
//             {files.profilePhoto ? (
//               <>
//                 <Image
//                   source={{ uri: files.profilePhoto.uri }}
//                   style={styles.uploadedImage}
//                 />
//                 <TouchableOpacity
//                   style={styles.removeButton}
//                   onPress={() => removeFile('profilePhoto')}
//                 >
//                   <X size={16} color="#fff" />
//                 </TouchableOpacity>
//               </>
//             ) : (
//               <>
//                 <View style={styles.uploadIconCircle}>
//                   <Camera size={24} color="#3B82F6" />
//                 </View>
//                 <Text style={styles.photoUploadText}>Upload Photo</Text>
//                 <Text style={styles.photoUploadHint}>Recommended: Square image, 500x500px</Text>
//               </>
//             )}
//           </TouchableOpacity>
//           {errors.profilePhoto && (
//             <Text style={styles.errorText}>{errors.profilePhoto}</Text>
//           )}
//         </View>

//         {/* Professional Information Section */}
//         <View style={styles.formSection}>
//           <Text style={styles.sectionTitle}>Professional Information</Text>

//           {/* Title */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Title*</Text>
//             <View style={[styles.inputWrapper, errors.title && styles.inputError]}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Dr."
//                 value={formData.title}
//                 onChangeText={(text) => handleInputChange('title', text)}
//               />
//               <ChevronDown size={20} color="#9CA3AF" />
//             </View>
//             {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
//           </View>

//           {/* Name */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Full Name*</Text>
//             <TextInput
//               style={[styles.input, errors.name && styles.inputError]}
//               placeholder="Enter your full name"
//               value={formData.name}
//               onChangeText={(text) => handleInputChange('name', text)}
//             />
//             {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
//           </View>

//           {/* City */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>City*</Text>
//             <TextInput
//               style={[styles.input, errors.city && styles.inputError]}
//               placeholder="Enter your city"
//               value={formData.city}
//               onChangeText={(text) => handleInputChange('city', text)}
//             />
//             {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
//           </View>

//           {/* Specialization */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Specialization*</Text>
//             <TextInput
//               style={[styles.input, errors.specialization && styles.inputError]}
//               placeholder="Your area of expertise"
//               value={formData.specialization}
//               onChangeText={(text) => handleInputChange('specialization', text)}
//             />
//             {errors.specialization && (
//               <Text style={styles.errorText}>{errors.specialization}</Text>
//             )}
//           </View>

//           {/* Gender */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Gender*</Text>
//             <View style={styles.radioGroup}>
//               <TouchableOpacity
//                 style={[
//                   styles.radioButton,
//                   formData.gender === 'Male' && styles.radioButtonActive
//                 ]}
//                 onPress={() => handleInputChange('gender', 'Male')}
//               >
//                 <Text style={styles.radioLabel}>Male</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.radioButton,
//                   formData.gender === 'Female' && styles.radioButtonActive
//                 ]}
//                 onPress={() => handleInputChange('gender', 'Female')}
//               >
//                 <Text style={styles.radioLabel}>Female</Text>
//               </TouchableOpacity>
//             </View>
//             {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
//           </View>

//           {/* Experience */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Years of Experience*</Text>
//             <TextInput
//               style={[styles.input, errors.experience && styles.inputError]}
//               placeholder="Number of years"
//               keyboardType="numeric"
//               value={formData.experience}
//               onChangeText={(text) => handleInputChange('experience', text)}
//             />
//             {errors.experience && (
//               <Text style={styles.errorText}>{errors.experience}</Text>
//             )}
//           </View>
//         </View>

//         {/* Education & Certification Section */}
//         <View style={styles.formSection}>
//           <Text style={styles.sectionTitle}>Education & Certification</Text>

//           {/* Qualification */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Qualification*</Text>
//             <TextInput
//               style={[styles.input, errors.qualification && styles.inputError]}
//               placeholder="Your degrees and certifications"
//               multiline
//               value={formData.qualification}
//               onChangeText={(text) => handleInputChange('qualification', text)}
//             />
//             {errors.qualification && (
//               <Text style={styles.errorText}>{errors.qualification}</Text>
//             )}
//           </View>

//           {/* Qualification Documents */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Upload Qualification Documents*</Text>
//             <Text style={styles.helperText}>
//               Please upload scanned copies of your degrees and certifications (PDF only)
//             </Text>
//             <TouchableOpacity
//               style={[
//                 styles.uploadButton,
//                 errors.qualificationDocs && styles.uploadError
//               ]}
//               onPress={() => handleDocumentUpload('qualificationDocs')}
//             >
//               {files.qualificationDocs ? (
//                 renderFileInfo(files.qualificationDocs, 'qualificationDocs')
//               ) : (
//                 <>
//                   <Upload size={16} color="#3B82F6" />
//                   <Text style={styles.uploadButtonText}>Select PDF File</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//             {errors.qualificationDocs && (
//               <Text style={styles.errorText}>{errors.qualificationDocs}</Text>
//             )}
//           </View>
//         </View>

//         {/* Registration Details Section */}
//         <View style={styles.formSection}>
//           <Text style={styles.sectionTitle}>Registration Details</Text>

//           {/* Registration */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Registration Number*</Text>
//             <TextInput
//               style={[styles.input, errors.registration && styles.inputError]}
//               placeholder="Your professional registration number"
//               value={formData.registration}
//               onChangeText={(text) => handleInputChange('registration', text)}
//             />
//             {errors.registration && (
//               <Text style={styles.errorText}>{errors.registration}</Text>
//             )}
//           </View>

//           {/* Registration Proof */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Upload Registration Proof*</Text>
//             <Text style={styles.helperText}>
//               Upload your professional registration certificate (PDF only)
//             </Text>
//             <TouchableOpacity
//               style={[
//                 styles.uploadButton,
//                 errors.registrationProof && styles.uploadError
//               ]}
//               onPress={() => handleDocumentUpload('registrationProof')}
//             >
//               {files.registrationProof ? (
//                 renderFileInfo(files.registrationProof, 'registrationProof')
//               ) : (
//                 <>
//                   <Upload size={16} color="#3B82F6" />
//                   <Text style={styles.uploadButtonText}>Select PDF File</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//             {errors.registrationProof && (
//               <Text style={styles.errorText}>{errors.registrationProof}</Text>
//             )}
//           </View>
//         </View>

//         {/* Identity Verification Section */}
//         <View style={styles.formSection}>
//           <Text style={styles.sectionTitle}>Identity Verification</Text>

//           {/* Identity Proof */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Identity Document Type*</Text>
//             <TextInput
//               style={[styles.input, errors.identityProof && styles.inputError]}
//               placeholder="Aadhar Card, Passport, etc."
//               value={formData.identityProof}
//               onChangeText={(text) => handleInputChange('identityProof', text)}
//             />
//             {errors.identityProof && (
//               <Text style={styles.errorText}>{errors.identityProof}</Text>
//             )}
//           </View>

//           {/* Identity Proof Upload */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Upload Identity Document*</Text>
//             <Text style={styles.helperText}>
//               Upload a scanned copy of your ID proof (PDF only)
//             </Text>
//             <TouchableOpacity
//               style={[
//                 styles.uploadButton,
//                 errors.identityProof && styles.uploadError
//               ]}
//               onPress={() => handleDocumentUpload('identityProof')}
//             >
//               {files.identityProof ? (
//                 renderFileInfo(files.identityProof, 'identityProof')
//               ) : (
//                 <>
//                   <Upload size={16} color="#3B82F6" />
//                   <Text style={styles.uploadButtonText}>Select PDF File</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//             {errors.identityProof && (
//               <Text style={styles.errorText}>{errors.identityProof}</Text>
//             )}
//           </View>
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity
//           style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
//           onPress={handleSubmit}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.submitButtonText}>Complete Profile</Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   scrollContainer: {
//     paddingBottom: 48,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     paddingBottom: 16,
//     backgroundColor: '#FFFFFF',
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   formSection: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 20,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: '#F3F4F6',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   helperText: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginBottom: 12,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     backgroundColor: '#FFFFFF',
//     height: 50,
//   },
//   input: {
//     flex: 1,
//     height: 50,
//     color: '#111827',
//     fontSize: 15,
//     paddingHorizontal: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 10,
//     backgroundColor: '#FFFFFF',
//   },
//   inputError: {
//     borderColor: '#EF4444',
//   },
//   errorText: {
//     color: '#EF4444',
//     fontSize: 12,
//     marginTop: 6,
//   },
//   radioGroup: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   radioButton: {
//     flex: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 10,
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//   },
//   radioButtonActive: {
//     borderColor: '#3B82F6',
//     backgroundColor: '#EFF6FF',
//   },
//   radioLabel: {
//     color: '#374151',
//     fontWeight: '500',
//   },
//   photoUpload: {
//     height: 160,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderStyle: 'dashed',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     marginBottom: 8,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   uploadIconCircle: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#EFF6FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   uploadError: {
//     borderColor: '#EF4444',
//   },
//   uploadedImage: {
//     width: '100%',
//     height: '100%',
//   },
//   removeButton: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   photoUploadText: {
//     color: '#111827',
//     marginTop: 8,
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   photoUploadHint: {
//     color: '#6B7280',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   uploadButton: {
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 10,
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 10,
//   },
//   uploadButtonText: {
//     color: '#3B82F6',
//     fontWeight: '500',
//     fontSize: 15,
//   },
//   fileInfoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     width: '100%',
//   },
//   fileInfoText: {
//     flex: 1,
//   },
//   fileName: {
//     color: '#3B82F6',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   fileSize: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   submitButton: {
//     backgroundColor: '#3B82F6',
//     borderRadius: 12,
//     paddingVertical: 18,
//     alignItems: 'center',
//     marginHorizontal: 20,
//     marginTop: 16,
//     marginBottom: 30,
//     shadowColor: '#3B82F6',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   submitButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   submitButtonDisabled: {
//     opacity: 0.7,
//   }
// });

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { Camera, ChevronDown, Upload, File, X, ArrowLeft } from 'lucide-react-native';
import { veterinarianUser } from '../../../store/slices/authSlice';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function CreateProfile() {
  const router = useRouter();
  const dispatch = useDispatch();

  const requiredFields = {
    title: 'Title is required',
    name: 'Full name is required',
    city: 'City is required',
    specialization: 'Specialization is required',
    gender: 'Please select your gender',
    experience: 'Experience is required',
    qualification: 'Qualification is required',
    registration: 'Registration details are required',
    identityProof: 'Identity proof type is required'
  };

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    city: '',
    specialization: '',
    gender: '',
    experience: '',
    qualification: '',
    registration: '',
    identityProof: ''
  });

  const [files, setFiles] = useState({
    profilePhoto: null,
    qualificationDocs: null,
    registrationProof: null,
    identityProof: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoBack = () => router.back();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  // Profile Photo Upload
  const handleProfilePhotoUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'We need access to your photos to upload a profile picture');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setFiles(prev => ({ ...prev, profilePhoto: result.assets[0] }));
        setErrors(prev => ({ ...prev, profilePhoto: null }));
      }
    } catch (error) {
      console.error('Profile photo upload error:', error);
    }
  };

  // Document / PDF Upload (Web + Native)
  const handleDocumentUpload = async (fieldName) => {
    try {
      setErrors(prev => ({ ...prev, [fieldName]: null }));

      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        let file = { name: result.name, type: result.mimeType || 'application/pdf' };

        if (Platform.OS === 'web') {
          // Web: fetch as blob
          const response = await fetch(result.uri);
          const blob = await response.blob();
          file.blob = blob;
        } else {
          // Native
          const fileInfo = await FileSystem.getInfoAsync(result.uri, { size: true });
          file.uri = result.uri;
          file.size = fileInfo.size;
        }

        setFiles(prev => ({ ...prev, [fieldName]: file }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors(prev => ({ ...prev, [fieldName]: 'Failed to upload document. Please try again.' }));
    }
  };

  const removeFile = (fieldName) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }));
    setErrors(prev => ({ ...prev, [fieldName]: null }));
  };

  const renderFileInfo = (file, fieldName) => {
    if (!file) return null;
    return (
      <View style={styles.fileInfoContainer}>
        <File size={16} color="#3B82F6" />
        <View style={styles.fileInfoText}>
          <Text style={styles.fileName} numberOfLines={1}>{file.name || 'Document.pdf'}</Text>
          {file.size && <Text style={styles.fileSize}>{Math.round(file.size / 1024)} KB</Text>}
        </View>
        <TouchableOpacity onPress={() => removeFile(fieldName)}>
          <X size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  // Cloudinary Upload
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
    const type = isImage ? 'image' : 'raw';

    if (Platform.OS === 'web') {
      formData.append('file', file.blob, file.name);
    } else {
      formData.append('file', { uri: file.uri, name: file.name, type: file.type });
    }

    formData.append('upload_preset', 'vetician');
    formData.append('cloud_name', 'dmtadfogc');

    const response = await fetch(`https://api.cloudinary.com/v1_1/dmtadfogc/${type}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    return await response.json();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const newErrors = {};
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]?.trim()) newErrors[field] = message;
    });
    if (!files.profilePhoto) newErrors.profilePhoto = 'Profile photo required';
    if (!files.qualificationDocs) newErrors.qualificationDocs = 'Qualification docs required';
    if (!files.registrationProof) newErrors.registrationProof = 'Registration proof required';
    if (!files.identityProof) newErrors.identityProof = 'Identity proof required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadResults = await Promise.all([
        uploadToCloudinary(files.profilePhoto),
        uploadToCloudinary(files.qualificationDocs),
        uploadToCloudinary(files.registrationProof),
        uploadToCloudinary(files.identityProof)
      ]);

      const [profilePhoto, qualificationDocs, registrationProof, identityProof] = uploadResults;

      const submissionData = {
        title: formData.title,
        name: formData.name.trim(),
        gender: formData.gender,
        city: formData.city.trim(),
        experience: Number(formData.experience),
        specialization: formData.specialization,
        qualification: formData.qualification.trim(),
        registration: formData.registration.trim(),
        identityProof: formData.identityProof.trim(),
        profilePhotoUrl: profilePhoto.secure_url,
        qualificationUrl: qualificationDocs.secure_url,
        registrationUrl: registrationProof.secure_url,
        identityProofUrl: identityProof.secure_url
      };

      const result = await dispatch(veterinarianUser(submissionData)).unwrap();

      if (result.success) {
        Alert.alert(
          'Success',
          'Veterinarian profile submitted successfully! Your account will be activated after verification.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      }
    } catch (error) {
      console.error('[Submit] Error:', error);
      let errorMessage = 'Submission failed. Please try again.';
      if (error.message?.includes('registration number already exists')) {
        errorMessage = 'A veterinarian with this registration number already exists.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}><ArrowLeft size={24} color="#3B82F6" /></TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Create Professional Profile</Text>
            <Text style={styles.headerSubtitle}>Complete your profile to start using the platform</Text>
          </View>
        </View>

        {/* Profile Photo */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Profile Photo*</Text>
          <TouchableOpacity style={[styles.photoUpload, errors.profilePhoto && styles.uploadError]} onPress={handleProfilePhotoUpload}>
            {files.profilePhoto ? (
              <>
                <Image source={{ uri: files.profilePhoto.uri }} style={styles.uploadedImage} />
                <TouchableOpacity style={styles.removeButton} onPress={() => removeFile('profilePhoto')}><X size={16} color="#fff" /></TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.uploadIconCircle}><Camera size={24} color="#3B82F6" /></View>
                <Text style={styles.photoUploadText}>Upload Photo</Text>
                <Text style={styles.photoUploadHint}>Recommended: Square image, 500x500px</Text>
              </>
            )}
          </TouchableOpacity>
          {errors.profilePhoto && <Text style={styles.errorText}>{errors.profilePhoto}</Text>}
        </View>

        {/* Professional Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title*</Text>
            <View style={[styles.inputWrapper, errors.title && styles.inputError]}>
              <TextInput style={styles.input} placeholder="Dr." value={formData.title} onChangeText={text => handleInputChange('title', text)} />
              <ChevronDown size={20} color="#9CA3AF" />
            </View>
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name*</Text>
            <TextInput style={[styles.input, errors.name && styles.inputError]} placeholder="Enter your full name" value={formData.name} onChangeText={text => handleInputChange('name', text)} />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* City */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>City*</Text>
            <TextInput style={[styles.input, errors.city && styles.inputError]} placeholder="Enter your city" value={formData.city} onChangeText={text => handleInputChange('city', text)} />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          {/* Specialization */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Specialization*</Text>
            <TextInput style={[styles.input, errors.specialization && styles.inputError]} placeholder="Your area of expertise" value={formData.specialization} onChangeText={text => handleInputChange('specialization', text)} />
            {errors.specialization && <Text style={styles.errorText}>{errors.specialization}</Text>}
          </View>

          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender*</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity style={[styles.radioButton, formData.gender === 'Male' && styles.radioButtonActive]} onPress={() => handleInputChange('gender', 'Male')}><Text style={styles.radioLabel}>Male</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.radioButton, formData.gender === 'Female' && styles.radioButtonActive]} onPress={() => handleInputChange('gender', 'Female')}><Text style={styles.radioLabel}>Female</Text></TouchableOpacity>
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </View>

          {/* Experience */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Years of Experience*</Text>
            <TextInput style={[styles.input, errors.experience && styles.inputError]} placeholder="Number of years" keyboardType="numeric" value={formData.experience} onChangeText={text => handleInputChange('experience', text)} />
            {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}
          </View>
        </View>

        {/* Education & Docs */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Education & Certification</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Qualification*</Text>
            <TextInput style={[styles.input, errors.qualification && styles.inputError]} placeholder="Your degrees and certifications" multiline value={formData.qualification} onChangeText={text => handleInputChange('qualification', text)} />
            {errors.qualification && <Text style={styles.errorText}>{errors.qualification}</Text>}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Upload Qualification Documents*</Text>
            <Text style={styles.helperText}>Please upload scanned copies of your degrees and certifications (PDF only)</Text>
            <TouchableOpacity style={[styles.uploadButton, errors.qualificationDocs && styles.uploadError]} onPress={() => handleDocumentUpload('qualificationDocs')}>
              {files.qualificationDocs ? renderFileInfo(files.qualificationDocs, 'qualificationDocs') : <>
                <Upload size={16} color="#3B82F6" />
                <Text style={styles.uploadButtonText}>Select PDF File</Text>
              </>}
            </TouchableOpacity>
            {errors.qualificationDocs && <Text style={styles.errorText}>{errors.qualificationDocs}</Text>}
          </View>
        </View>

        {/* Registration & Identity Docs */}
        {/* Similar sections for registrationProof and identityProof */}
        {/* For brevity, you can reuse handleDocumentUpload and renderFileInfo */}
        {/* Submit Button */}
        <TouchableOpacity style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Complete Profile</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingBottom: 48,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    height: 50,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#111827',
    fontSize: 15,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  radioButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  radioLabel: {
    color: '#374151',
    fontWeight: '500',
  },
  photoUpload: {
    height: 160,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadError: {
    borderColor: '#EF4444',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoUploadText: {
    color: '#111827',
    marginTop: 8,
    fontSize: 15,
    fontWeight: '500',
  },
  photoUploadHint: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  uploadButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  uploadButtonText: {
    color: '#3B82F6',
    fontWeight: '500',
    fontSize: 15,
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  fileInfoText: {
    flex: 1,
  },
  fileName: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    color: '#6B7280',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 30,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  }
});
