import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { Camera, Upload, File, X, ChevronLeft, CheckCircle } from 'lucide-react-native';
import { veterinarianUser, veterinarianProfileData, updateVeterinarianUser } from '../../../store/slices/authSlice';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const C = {
  primary: '#558B2F',
  secondary: '#7CB342',
  bg: '#F5F7F2',
  card: '#FFFFFF',
  border: '#E2EDD5',
  accent: '#EAF4D5',
  text: '#1B1B1B',
  subtext: '#4A5E3A',
  muted: '#8A9880',
  error: '#E53935',
  errorPale: '#FDECEA',
};

const SPECIALIZATIONS = ['Veterinarian', 'Vetician', 'Surgeon', 'Dermatologist', 'Other'];

export default function VeterinarianProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: 'Dr.',
    name: '',
    city: '',
    specialization: '',
    gender: '',
    experience: '',
    qualification: '',
    registration: '',
    identityProof: '',
  });

  const [files, setFiles] = useState({
    profilePhoto: null,
    qualificationDocs: null,
    registrationProof: null,
    identityProof: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const result = await dispatch(veterinarianProfileData()).unwrap();
        if (result.success && result.data?.profile) {
          setIsEditMode(true);
          const p = result.data.profile;
          const TITLES = ['Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Prof.'];
          const parts = p.name.split(' ');
          const hasTitle = TITLES.includes(parts[0]);
          setFormData({
            title: hasTitle ? parts[0] : (p.title || 'Dr.'),
            name: hasTitle ? parts.slice(1).join(' ') : p.name,
            city: p.city || '',
            specialization: p.specialization || '',
            gender: p.gender || '',
            experience: p.experience?.replace(' years', '') || '',
            qualification: p.qualification || '',
            registration: p.registration || '',
            identityProof: p.identityProof || '',
          });
          const newFiles = {};
          if (p.profilePhotoUrl) newFiles.profilePhoto = { uri: p.profilePhotoUrl, name: 'profile.jpg' };
          if (p.qualificationUrl) newFiles.qualificationDocs = { uri: p.qualificationUrl, name: 'qualification.pdf' };
          if (p.registrationUrl) newFiles.registrationProof = { uri: p.registrationUrl, name: 'registration.pdf' };
          if (p.identityProofUrl) newFiles.identityProof = { uri: p.identityProofUrl, name: 'identity.pdf' };
          setFiles(prev => ({ ...prev, ...newFiles }));
        }
      } catch (_) {}
      finally { setLoading(false); }
    })();
  }, [dispatch]);

  const set = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleProfilePhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permission Required', 'Please allow access to photos'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setFiles(prev => ({ ...prev, profilePhoto: result.assets[0] }));
      setErrors(prev => ({ ...prev, profilePhoto: null }));
    }
  };

  const handleDocUpload = async (field) => {
    try {
      setErrors(prev => ({ ...prev, [field]: null }));
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true });
      if (!result.canceled && result.assets?.length > 0) {
        setUploadingDoc(field);
        const sel = result.assets[0];
        let file = { name: sel.name, type: sel.mimeType || 'application/pdf' };
        if (Platform.OS === 'web') {
          file.blob = await (await fetch(sel.uri)).blob();
        } else {
          const info = await FileSystem.getInfoAsync(sel.uri, { size: true });
          file.uri = sel.uri;
          file.size = info.size;
        }
        setFiles(prev => ({ ...prev, [field]: file }));
        setUploadingDoc(null);
      }
    } catch (_) {
      setErrors(prev => ({ ...prev, [field]: 'Upload failed' }));
      setUploadingDoc(null);
    }
  };

  const isRemoteUrl = (uri) => typeof uri === 'string' && (uri.startsWith('http://') || uri.startsWith('https://'));

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Validate all fields
    const e = {};
    if (!formData.name.trim()) e.name = 'Name required';
    if (!formData.city.trim()) e.city = 'City required';
    if (!formData.specialization) e.specialization = 'Specialization required';
    if (!formData.gender) e.gender = 'Gender required';
    if (!formData.experience.trim() || isNaN(Number(formData.experience))) e.experience = 'Valid experience required';
    if (!formData.qualification.trim()) e.qualification = 'Qualification required';
    if (!formData.registration.trim()) e.registration = 'Registration required';
    if (!formData.identityProof.trim()) e.identityProof = 'ID type required';
    if (!files.profilePhoto) e.profilePhoto = 'Photo required';
    if (!files.qualificationDocs) e.qualificationDocs = 'Document required';
    if (!files.registrationProof) e.registrationProof = 'Proof required';
    if (!files.identityProof) e.identityProofFile = 'ID required';

    if (Object.keys(e).length > 0) {
      setErrors(e);
      Alert.alert('Missing Fields', 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      if (!token || !userId) {
        Alert.alert('Session Expired', 'Please log in again.');
        return;
      }

      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

      const uploadFile = async (file, endpoint) => {
        if (isRemoteUrl(file.uri)) return file.uri;
        const fd = new FormData();
        fd.append('file', {
          uri: file.uri,
          name: file.fileName || file.name || 'file',
          type: file.type || 'application/octet-stream',
        });
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 90000);
        try {
          const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            body: fd,
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || `Upload failed (${res.status})`);
          const url = data.secure_url || data.url || data.fileUrl;
          if (!url) throw new Error('No URL returned from upload');
          return url;
        } finally {
          clearTimeout(timer);
        }
      };

      const photoUrl = await uploadFile(files.profilePhoto, '/upload/image');
      const qualUrl  = await uploadFile(files.qualificationDocs, '/upload/document');
      const regUrl   = await uploadFile(files.registrationProof, '/upload/document');
      const idUrl    = await uploadFile(files.identityProof, '/upload/document');

      const payload = {
        title: formData.title,
        name: formData.name.trim(),
        gender: formData.gender,
        city: formData.city.trim(),
        experience: Number(formData.experience),
        specialization: formData.specialization,
        qualification: formData.qualification.trim(),
        registration: formData.registration.trim(),
        identityProof: formData.identityProof.trim(),
        profilePhotoUrl: photoUrl,
        qualificationUrl: qualUrl,
        registrationUrl: regUrl,
        identityProofUrl: idUrl,
      };

      const action = isEditMode ? updateVeterinarianUser(payload) : veterinarianUser(payload);
      await dispatch(action).unwrap();

      Alert.alert('Profile Submitted!', 'Awaiting admin verification.', [
        { text: 'OK', onPress: () => router.replace('/(doc_tabs)/pending-approval') }
      ]);
    } catch (err) {
      const msg = typeof err === 'string' ? err : (err.message || 'Submission failed');
      if (msg.includes('already applied')) {
        Alert.alert('Already Submitted', 'Your profile is awaiting verification.', [
          { text: 'OK', onPress: () => router.replace('/(doc_tabs)/pending-approval') }
        ]);
      } else {
        Alert.alert('Submission Error', msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={C.secondary} />
        <Text style={styles.loaderText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.root}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={[C.secondary, C.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(doc_tabs)/(tabs)')} style={styles.backBtn}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Complete Your Profile</Text>
          <Text style={styles.headerSub}>Fill in your professional details</Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Profile Photo */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Profile Photo *</Text>
          <TouchableOpacity style={[styles.photoBox, errors.profilePhoto && styles.errorBorder]} onPress={handleProfilePhoto} activeOpacity={0.8}>
            {files.profilePhoto ? (
              <>
                <Image source={{ uri: files.profilePhoto.uri }} style={styles.photo} />
                <TouchableOpacity style={styles.removePhoto} onPress={() => setFiles(p => ({ ...p, profilePhoto: null }))}>
                  <X size={14} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.photoPlaceholder}>
                <View style={styles.photoIconCircle}>
                  <Camera size={26} color={C.secondary} />
                </View>
                <Text style={styles.photoText}>Tap to upload photo</Text>
                <Text style={styles.photoHint}>JPG or PNG, clear face photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {errors.profilePhoto && <Text style={styles.errText}>{errors.profilePhoto}</Text>}
        </View>

        {/* Basic Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <Text style={styles.label}>Full Name *</Text>
          <View style={[styles.inputRow, errors.name && styles.errorBorder]}>
            <TouchableOpacity
              style={styles.titlePill}
              onPress={() => set('title', formData.title === 'Dr.' ? 'Mr.' : formData.title === 'Mr.' ? 'Ms.' : 'Dr.')}
            >
              <Text style={styles.titleText}>{formData.title}</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.inputFlex}
              placeholder="Your name"
              placeholderTextColor={C.muted}
              value={formData.name}
              onChangeText={v => set('name', v)}
            />
          </View>
          {errors.name && <Text style={styles.errText}>{errors.name}</Text>}

          <Text style={styles.label}>City *</Text>
          <TextInput
            style={[styles.input, errors.city && styles.errorBorder]}
            placeholder="Your city"
            placeholderTextColor={C.muted}
            value={formData.city}
            onChangeText={v => set('city', v)}
          />
          {errors.city && <Text style={styles.errText}>{errors.city}</Text>}

          <Text style={styles.label}>Specialization *</Text>
          <View style={styles.chipRow}>
            {SPECIALIZATIONS.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, formData.specialization === s && styles.chipActive]}
                onPress={() => set('specialization', s)}
              >
                <Text style={[styles.chipText, formData.specialization === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.specialization && <Text style={styles.errText}>{errors.specialization}</Text>}

          <Text style={styles.label}>Gender *</Text>
          <View style={styles.chipRow}>
            {['Male', 'Female'].map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.chip, styles.chipHalf, formData.gender === g && styles.chipActive]}
                onPress={() => set('gender', g)}
              >
                <Text style={[styles.chipText, formData.gender === g && styles.chipTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender && <Text style={styles.errText}>{errors.gender}</Text>}

          <Text style={styles.label}>Years of Experience *</Text>
          <TextInput
            style={[styles.input, errors.experience && styles.errorBorder]}
            placeholder="e.g. 5"
            placeholderTextColor={C.muted}
            keyboardType="numeric"
            value={formData.experience}
            onChangeText={v => set('experience', v)}
          />
          {errors.experience && <Text style={styles.errText}>{errors.experience}</Text>}
        </View>

        {/* Education */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Education & Certification</Text>

          <Text style={styles.label}>Qualification *</Text>
          <TextInput
            style={[styles.input, styles.inputMulti, errors.qualification && styles.errorBorder]}
            placeholder="e.g. BVSc, MVSc"
            placeholderTextColor={C.muted}
            multiline
            numberOfLines={3}
            value={formData.qualification}
            onChangeText={v => set('qualification', v)}
          />
          {errors.qualification && <Text style={styles.errText}>{errors.qualification}</Text>}

          <Text style={styles.label}>Qualification Document * (PDF)</Text>
          {renderDocUpload('qualificationDocs', files, errors, uploadingDoc, handleDocUpload, setFiles)}
          {errors.qualificationDocs && <Text style={styles.errText}>{errors.qualificationDocs}</Text>}
        </View>

        {/* Registration */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Registration Details</Text>

          <Text style={styles.label}>Registration Number *</Text>
          <TextInput
            style={[styles.input, errors.registration && styles.errorBorder]}
            placeholder="Your registration number"
            placeholderTextColor={C.muted}
            value={formData.registration}
            onChangeText={v => set('registration', v)}
          />
          {errors.registration && <Text style={styles.errText}>{errors.registration}</Text>}

          <Text style={styles.label}>Registration Proof * (PDF)</Text>
          {renderDocUpload('registrationProof', files, errors, uploadingDoc, handleDocUpload, setFiles)}
          {errors.registrationProof && <Text style={styles.errText}>{errors.registrationProof}</Text>}
        </View>

        {/* Identity */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Identity Verification</Text>

          <Text style={styles.label}>ID Type *</Text>
          <TextInput
            style={[styles.input, errors.identityProof && styles.errorBorder]}
            placeholder="e.g. Aadhar, Passport"
            placeholderTextColor={C.muted}
            value={formData.identityProof}
            onChangeText={v => set('identityProof', v)}
          />
          {errors.identityProof && <Text style={styles.errText}>{errors.identityProof}</Text>}

          <Text style={styles.label}>ID Proof * (PDF)</Text>
          {renderDocUpload('identityProof', files, errors, uploadingDoc, handleDocUpload, setFiles)}
          {errors.identityProofFile && <Text style={styles.errText}>{errors.identityProofFile}</Text>}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <LinearGradient colors={isSubmitting ? ['#aaa', '#aaa'] : [C.secondary, C.primary]} style={styles.submitGradient}>
            {isSubmitting ? (
              <View style={styles.submitRow}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.submitText}>Uploading documents...</Text>
              </View>
            ) : (
              <View style={styles.submitRow}>
                <CheckCircle size={20} color="#fff" />
                <Text style={styles.submitText}>Submit Profile</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function renderDocUpload(field, files, errors, uploadingDoc, handleDocUpload, setFiles) {
  const file = files[field];
  const isUploading = uploadingDoc === field;
  return (
    <TouchableOpacity
      style={[styles.docBtn, (errors[field] || errors[field + 'File']) && styles.errorBorder]}
      onPress={() => handleDocUpload(field)}
      disabled={isUploading}
      activeOpacity={0.8}
    >
      {isUploading ? (
        <View style={styles.docRow}>
          <ActivityIndicator size="small" color={C.secondary} />
          <Text style={styles.docUploading}>Uploading...</Text>
        </View>
      ) : file ? (
        <View style={styles.docRow}>
          <View style={styles.docIconWrap}>
            <File size={16} color={C.secondary} />
          </View>
          <Text style={styles.docName} numberOfLines={1}>{file.name}</Text>
          <TouchableOpacity onPress={() => setFiles(p => ({ ...p, [field]: null }))}>
            <X size={16} color={C.error} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.docRow}>
          <View style={styles.docIconWrap}>
            <Upload size={16} color={C.secondary} />
          </View>
          <Text style={styles.docPlaceholder}>Select PDF file</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg },
  loaderText: { marginTop: 12, color: C.subtext, fontSize: 14 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 44 : 54,
    paddingBottom: 16, paddingHorizontal: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 20 },

  card: {
    backgroundColor: C.card, borderRadius: 16, padding: 20,
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: C.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 16 },

  label: { fontSize: 13, fontWeight: '600', color: C.subtext, marginBottom: 8, marginTop: 4 },

  input: {
    height: 50, borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
    paddingHorizontal: 14, fontSize: 15, color: C.text, backgroundColor: C.bg,
    marginBottom: 4,
  },
  inputMulti: { height: 80, paddingTop: 12, textAlignVertical: 'top' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5,
    borderColor: C.border, borderRadius: 12, backgroundColor: C.bg,
    overflow: 'hidden', marginBottom: 4,
  },
  inputFlex: { flex: 1, height: 50, fontSize: 15, color: C.text, paddingHorizontal: 12 },
  titlePill: {
    backgroundColor: C.accent, paddingHorizontal: 14, height: 50,
    justifyContent: 'center', borderRightWidth: 1.5, borderRightColor: C.border,
  },
  titleText: { fontSize: 14, fontWeight: '700', color: C.primary },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: {
    paddingVertical: 9, paddingHorizontal: 14, borderRadius: 20,
    borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg,
  },
  chipHalf: { flex: 1, alignItems: 'center' },
  chipActive: { backgroundColor: C.accent, borderColor: C.secondary },
  chipText: { fontSize: 13, color: C.subtext, fontWeight: '500' },
  chipTextActive: { color: C.primary, fontWeight: '700' },

  photoBox: {
    height: 160, borderWidth: 2, borderStyle: 'dashed', borderColor: C.border,
    borderRadius: 16, overflow: 'hidden', backgroundColor: C.bg,
    justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  photo: { width: '100%', height: '100%' },
  removePhoto: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 12,
    width: 24, height: 24, justifyContent: 'center', alignItems: 'center',
  },
  photoPlaceholder: { alignItems: 'center', gap: 6 },
  photoIconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: C.accent, justifyContent: 'center', alignItems: 'center',
  },
  photoText: { fontSize: 14, fontWeight: '600', color: C.primary },
  photoHint: { fontSize: 12, color: C.muted },

  docBtn: {
    borderWidth: 1.5, borderColor: C.border, borderRadius: 12,
    padding: 14, backgroundColor: C.bg, marginBottom: 4,
  },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  docIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: C.accent, justifyContent: 'center', alignItems: 'center',
  },
  docName: { flex: 1, fontSize: 13, color: C.primary, fontWeight: '500' },
  docPlaceholder: { fontSize: 14, color: C.muted, fontWeight: '500' },
  docUploading: { fontSize: 14, color: C.muted },

  errorBorder: { borderColor: C.error },
  errText: { color: C.error, fontSize: 12, marginTop: 2, marginBottom: 6 },

  submitBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  submitDisabled: { opacity: 0.7 },
  submitGradient: { paddingVertical: 17, alignItems: 'center', justifyContent: 'center' },
  submitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
