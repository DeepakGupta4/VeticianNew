import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Upload, File, X, ArrowLeft } from 'lucide-react-native';
import { veterinarianUser, veterinarianProfileData, updateVeterinarianUser } from '../../../store/slices/authSlice';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VeterinarianProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    title: 'Dr.',
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

  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const result = await dispatch(veterinarianProfileData()).unwrap();
        if (result.success && result.data?.profile) {
          setIsEditMode(true);
          const profile = result.data.profile;
          const nameParts = profile.name.split(' ');
          const title = nameParts[0];
          const name = nameParts.slice(1).join(' ');
          
          setFormData({
            title: title || 'Dr.',
            name: name || '',
            city: profile.city || '',
            specialization: profile.specialization || '',
            gender: profile.gender || '',
            experience: profile.experience?.replace(' years', '') || '',
            qualification: profile.qualification || '',
            registration: profile.registration || '',
            identityProof: profile.identityProof || ''
          });
          
          const newFiles = {};
          if (profile.profilePhotoUrl) {
            newFiles.profilePhoto = { uri: profile.profilePhotoUrl, name: 'profile.jpg' };
          }
          if (profile.qualificationUrl) {
            newFiles.qualificationDocs = { uri: profile.qualificationUrl, name: 'qualification.pdf' };
          }
          if (profile.registrationUrl) {
            newFiles.registrationProof = { uri: profile.registrationUrl, name: 'registration.pdf' };
          }
          if (profile.identityProofUrl) {
            newFiles.identityProof = { uri: profile.identityProofUrl, name: 'identity.pdf' };
          }
          setFiles(prev => ({ ...prev, ...newFiles }));
        }
      } catch (error) {
        console.log('No existing profile data');
      } finally {
        setLoading(false);
      }
    };

    loadExistingData();
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleProfilePhotoUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setFiles(prev => ({ ...prev, profilePhoto: result.assets[0] }));
        setErrors(prev => ({ ...prev, profilePhoto: null }));
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      Alert.alert('Error', 'Failed to upload photo');
    }
  };

  const handleDocumentUpload = async (fieldName) => {
    try {
      setErrors(prev => ({ ...prev, [fieldName]: null }));

      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      console.log('Document picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploadingDoc(fieldName);
        
        const selectedFile = result.assets[0];
        let file = { name: selectedFile.name, type: selectedFile.mimeType || 'application/pdf' };

        if (Platform.OS === 'web') {
          const response = await fetch(selectedFile.uri);
          const blob = await response.blob();
          file.blob = blob;
        } else {
          const fileInfo = await FileSystem.getInfoAsync(selectedFile.uri, { size: true });
          file.uri = selectedFile.uri;
          file.size = fileInfo.size;
        }

        console.log('File prepared:', file);
        setFiles(prev => ({ ...prev, [fieldName]: file }));
        setUploadingDoc(null);
      }
    } catch (error) {
      console.error('Document upload error:', error);
      setErrors(prev => ({ ...prev, [fieldName]: 'Upload failed' }));
      setUploadingDoc(null);
    }
  };

  const removeFile = (fieldName) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (!formData.city.trim()) newErrors.city = 'City required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization required';
    if (!formData.gender) newErrors.gender = 'Gender required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification required';
    if (!formData.registration.trim()) newErrors.registration = 'Registration required';
    if (!formData.identityProof.trim()) newErrors.identityProof = 'Identity proof type required';
    if (!files.profilePhoto) newErrors.profilePhoto = 'Photo required';
    if (!files.qualificationDocs) newErrors.qualificationDocs = 'Docs required';
    if (!files.registrationProof) newErrors.registrationProof = 'Proof required';
    if (!files.identityProof) newErrors.identityProof = 'ID required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Missing Fields', 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get token for authenticated uploads
      const token = await AsyncStorage.getItem('token');
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
      
      const uploadResults = [];
      
      // Show progress
      console.log('📤 Uploading profile photo...');
      
      // Upload profile photo to backend
      const photoFormData = new FormData();
      if (Platform.OS === 'web') {
        const photoBlob = files.profilePhoto.blob || await fetch(files.profilePhoto.uri).then(r => r.blob());
        photoFormData.append('file', photoBlob, files.profilePhoto.fileName || 'photo.jpg');
      } else {
        photoFormData.append('file', { uri: files.profilePhoto.uri, name: files.profilePhoto.fileName || 'photo.jpg', type: 'image/jpeg' });
      }
      
      const photoRes = await fetch(`${API_URL}/upload/image`, { 
        method: 'POST', 
        body: photoFormData,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const photoData = await photoRes.json();
      
      if (!photoRes.ok) {
        console.error('Photo upload error:', photoData);
        throw new Error(photoData.message || 'Photo upload failed');
      }
      uploadResults.push(photoData);

      // Upload documents to backend
      for (const docField of ['qualificationDocs', 'registrationProof', 'identityProof']) {
        const docFormData = new FormData();
        if (Platform.OS === 'web') {
          const docBlob = files[docField].blob || await fetch(files[docField].uri).then(r => r.blob());
          docFormData.append('file', docBlob, files[docField].name);
        } else {
          docFormData.append('file', { uri: files[docField].uri, name: files[docField].name, type: files[docField].type });
        }
        
        const docRes = await fetch(`${API_URL}/upload/document`, { 
          method: 'POST', 
          body: docFormData,
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const docData = await docRes.json();
        
        if (!docRes.ok) {
          console.error(`${docField} upload error:`, docData);
          throw new Error(docData.message || 'Document upload failed');
        }
        uploadResults.push(docData);
      }

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

      const result = await dispatch(isEditMode ? updateVeterinarianUser(submissionData) : veterinarianUser(submissionData)).unwrap();

      console.log('✅ Veterinarian registration result:', result);

      // Direct redirect without alert for web compatibility
      setTimeout(() => {
        router.replace('/(doc_tabs)/(tabs)');
      }, 1000);
      
      Alert.alert('Success', 'Profile submitted! Awaiting verification.', [
        { text: 'OK', onPress: () => router.replace('/(doc_tabs)/(tabs)') }
      ]);
    } catch (error) {
      console.error('Submit error:', error);
      
      // If already applied, redirect to dashboard
      if (error.message && (error.message.includes('already applied') || error.message.includes('You have already applied'))) {
        Alert.alert('Already Submitted', 'Your profile is awaiting verification.', [
          { text: 'OK', onPress: () => router.replace('/(doc_tabs)/(tabs)') }
        ]);
      } else {
        Alert.alert('Error', error.message || 'Submission failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 16, color: '#6B7280' }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/(doc_tabs)/(tabs)')} style={styles.backBtn}>
            <ArrowLeft size={24} color="#4A90E2" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Fill in your professional details</Text>
          </View>
        </View>

        {/* Profile Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Photo*</Text>
          <TouchableOpacity style={[styles.photoBox, errors.profilePhoto && styles.errorBorder]} onPress={handleProfilePhotoUpload}>
            {files.profilePhoto ? (
              <>
                <Image source={{ uri: files.profilePhoto.uri }} style={styles.photo} />
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeFile('profilePhoto')}>
                  <X size={16} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.iconCircle}><Camera size={24} color="#4A90E2" /></View>
                <Text style={styles.uploadText}>Tap to Upload</Text>
              </>
            )}
          </TouchableOpacity>
          {errors.profilePhoto && <Text style={styles.error}>{errors.profilePhoto}</Text>}
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Full Name*</Text>
            <TextInput style={[styles.input, errors.name && styles.errorBorder]} placeholder="Enter your name" value={formData.name} onChangeText={text => handleInputChange('name', text)} />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>City*</Text>
            <TextInput style={[styles.input, errors.city && styles.errorBorder]} placeholder="Your city" value={formData.city} onChangeText={text => handleInputChange('city', text)} />
            {errors.city && <Text style={styles.error}>{errors.city}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Specialization*</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity style={[styles.input, errors.specialization && styles.errorBorder]} onPress={() => {}}>
                <Text style={formData.specialization ? styles.pickerText : styles.pickerPlaceholder}>
                  {formData.specialization || 'Select specialization'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.radioGroup}>
              {['Veterinarian', 'Vetician', 'Surgeon', 'Dermatologist', 'Other'].map(spec => (
                <TouchableOpacity key={spec} style={[styles.specBtn, formData.specialization === spec && styles.specBtnActive]} onPress={() => handleInputChange('specialization', spec)}>
                  <Text style={[styles.specText, formData.specialization === spec && styles.specTextActive]}>{spec}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.specialization && <Text style={styles.error}>{errors.specialization}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Gender*</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity style={[styles.radio, formData.gender === 'Male' && styles.radioActive]} onPress={() => handleInputChange('gender', 'Male')}>
                <Text style={[styles.radioText, formData.gender === 'Male' && styles.radioTextActive]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.radio, formData.gender === 'Female' && styles.radioActive]} onPress={() => handleInputChange('gender', 'Female')}>
                <Text style={[styles.radioText, formData.gender === 'Female' && styles.radioTextActive]}>Female</Text>
              </TouchableOpacity>
            </View>
            {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Years of Experience*</Text>
            <TextInput style={[styles.input, errors.experience && styles.errorBorder]} placeholder="e.g., 5" keyboardType="numeric" value={formData.experience} onChangeText={text => handleInputChange('experience', text)} />
            {errors.experience && <Text style={styles.error}>{errors.experience}</Text>}
          </View>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education & Certification</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Qualification*</Text>
            <TextInput style={[styles.input, styles.multiline, errors.qualification && styles.errorBorder]} placeholder="Your degrees (e.g., BVSc, MVSc)" multiline numberOfLines={3} value={formData.qualification} onChangeText={text => handleInputChange('qualification', text)} />
            {errors.qualification && <Text style={styles.error}>{errors.qualification}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Upload Qualification Docs* (PDF)</Text>
            <TouchableOpacity style={[styles.uploadBtn, errors.qualificationDocs && styles.errorBorder]} onPress={() => handleDocumentUpload('qualificationDocs')} disabled={uploadingDoc === 'qualificationDocs'}>
              {uploadingDoc === 'qualificationDocs' ? (
                <>
                  <ActivityIndicator size="small" color="#4A90E2" />
                  <Text style={styles.uploadingText}>Uploading...</Text>
                </>
              ) : files.qualificationDocs ? (
                <View style={styles.fileInfo}>
                  <File size={16} color="#4A90E2" />
                  <Text style={styles.fileName}>{files.qualificationDocs.name}</Text>
                  <TouchableOpacity onPress={() => removeFile('qualificationDocs')}><X size={16} color="#EF4444" /></TouchableOpacity>
                </View>
              ) : (
                <>
                  <Upload size={16} color="#4A90E2" />
                  <Text style={styles.uploadBtnText}>Select PDF</Text>
                </>
              )}
            </TouchableOpacity>
            {errors.qualificationDocs && <Text style={styles.error}>{errors.qualificationDocs}</Text>}
          </View>
        </View>

        {/* Registration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registration Details</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Registration Number*</Text>
            <TextInput style={[styles.input, errors.registration && styles.errorBorder]} placeholder="Your registration number" value={formData.registration} onChangeText={text => handleInputChange('registration', text)} />
            {errors.registration && <Text style={styles.error}>{errors.registration}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Upload Registration Proof* (PDF)</Text>
            <TouchableOpacity style={[styles.uploadBtn, errors.registrationProof && styles.errorBorder]} onPress={() => handleDocumentUpload('registrationProof')} disabled={uploadingDoc === 'registrationProof'}>
              {uploadingDoc === 'registrationProof' ? (
                <>
                  <ActivityIndicator size="small" color="#4A90E2" />
                  <Text style={styles.uploadingText}>Uploading...</Text>
                </>
              ) : files.registrationProof ? (
                <View style={styles.fileInfo}>
                  <File size={16} color="#4A90E2" />
                  <Text style={styles.fileName}>{files.registrationProof.name}</Text>
                  <TouchableOpacity onPress={() => removeFile('registrationProof')}><X size={16} color="#EF4444" /></TouchableOpacity>
                </View>
              ) : (
                <>
                  <Upload size={16} color="#4A90E2" />
                  <Text style={styles.uploadBtnText}>Select PDF</Text>
                </>
              )}
            </TouchableOpacity>
            {errors.registrationProof && <Text style={styles.error}>{errors.registrationProof}</Text>}
          </View>
        </View>

        {/* Identity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity Verification</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>ID Type*</Text>
            <TextInput style={[styles.input, errors.identityProof && styles.errorBorder]} placeholder="e.g., Aadhar, Passport" value={formData.identityProof} onChangeText={text => handleInputChange('identityProof', text)} />
            {errors.identityProof && <Text style={styles.error}>{errors.identityProof}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Upload ID Proof* (PDF)</Text>
            <TouchableOpacity style={[styles.uploadBtn, errors.identityProof && styles.errorBorder]} onPress={() => handleDocumentUpload('identityProof')} disabled={uploadingDoc === 'identityProof'}>
              {uploadingDoc === 'identityProof' ? (
                <>
                  <ActivityIndicator size="small" color="#4A90E2" />
                  <Text style={styles.uploadingText}>Uploading...</Text>
                </>
              ) : files.identityProof ? (
                <View style={styles.fileInfo}>
                  <File size={16} color="#4A90E2" />
                  <Text style={styles.fileName}>{files.identityProof.name}</Text>
                  <TouchableOpacity onPress={() => removeFile('identityProof')}><X size={16} color="#EF4444" /></TouchableOpacity>
                </View>
              ) : (
                <>
                  <Upload size={16} color="#4A90E2" />
                  <Text style={styles.uploadBtnText}>Select PDF</Text>
                </>
              )}
            </TouchableOpacity>
            {errors.identityProof && <Text style={styles.error}>{errors.identityProof}</Text>}
          </View>
        </View>

        <TouchableOpacity style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.submitText}>Uploading documents...</Text>
            </View>
          ) : (
            <Text style={styles.submitText}>Submit Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backBtn: { marginRight: 16 },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, padding: 20, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { height: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 16, fontSize: 15, color: '#111827', backgroundColor: '#fff' },
  multiline: { height: 80, paddingTop: 12, textAlignVertical: 'top' },
  errorBorder: { borderColor: '#EF4444' },
  error: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  radioGroup: { flexDirection: 'row', gap: 12 },
  radio: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, alignItems: 'center', backgroundColor: '#F9FAFB' },
  radioActive: { borderColor: '#4A90E2', backgroundColor: '#EFF6FF' },
  radioText: { color: '#374151', fontWeight: '500' },
  radioTextActive: { color: '#4A90E2', fontWeight: '600' },
  pickerContainer: { marginBottom: 8 },
  pickerText: { color: '#111827', fontSize: 15 },
  pickerPlaceholder: { color: '#9CA3AF', fontSize: 15 },
  specBtn: { paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, backgroundColor: '#F9FAFB', marginBottom: 8 },
  specBtnActive: { borderColor: '#4A90E2', backgroundColor: '#EFF6FF' },
  specText: { color: '#374151', fontWeight: '500', fontSize: 13, textAlign: 'center' },
  specTextActive: { color: '#4A90E2', fontWeight: '600' },
  photoBox: { height: 160, borderWidth: 2, borderStyle: 'dashed', borderColor: '#E5E7EB', borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB', overflow: 'hidden', position: 'relative' },
  photo: { width: '100%', height: '100%' },
  removeBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  uploadText: { color: '#4A90E2', fontSize: 14, fontWeight: '500' },
  uploadBtn: { padding: 16, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#F9FAFB' },
  uploadBtnText: { color: '#4A90E2', fontWeight: '500', fontSize: 14 },
  uploadingText: { color: '#6B7280', fontWeight: '500', fontSize: 14 },
  fileInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' },
  fileName: { flex: 1, color: '#4A90E2', fontSize: 14, fontWeight: '500' },
  submitBtn: { backgroundColor: '#4A90E2', marginHorizontal: 16, marginTop: 24, paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#4A90E2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  submitBtnDisabled: { opacity: 0.6 }
});
