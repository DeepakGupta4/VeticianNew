import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, Check, Upload } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function Step4Documents() {
  const router = useRouter();
  const { formData, updateFormData } = useParavetOnboarding();
  const [isUploading, setIsUploading] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState({
    governmentId: false,
    certificationProof: false,
    profilePhoto: false,
  });

  useEffect(() => {
    setUploadedDocs({
      governmentId: !!formData.governmentIdUrl,
      certificationProof: !!formData.certificationProofUrl,
      profilePhoto: !!formData.profilePhotoUrl,
    });
  }, [formData.governmentIdUrl, formData.certificationProofUrl, formData.profilePhotoUrl]);

  const documents = [
    { id: 'governmentId',      title: 'Government-Issued ID',            desc: 'Aadhaar, PAN, or any valid govt ID',         required: true,  type: ['image/*', 'application/pdf'] },
    { id: 'certificationProof', title: 'Paravet Certification Proof',     desc: 'Certificate or training completion proof',   required: true,  type: ['image/*', 'application/pdf'] },
    { id: 'profilePhoto',      title: 'Profile Photo',                   desc: 'Clear photo for profile verification',       required: true,  type: ['image/*'] },
  ];

  const handlePickDocument = async (docId) => {
    const doc = documents.find(d => d.id === docId);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: doc.type,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      await uploadFile(docId, file);
    } catch (err) {
      Alert.alert('Error', 'Could not pick document. Please try again.');
    }
  };

  const uploadFile = async (docId, file) => {
    setIsUploading(docId);
    try {
      const token = await AsyncStorage.getItem('token');
      
      // Check if running on web
      const isWeb = typeof window !== 'undefined' && window.document;
      
      if (isWeb && file.uri.startsWith('blob:')) {
        // Web: Convert blob URI to actual file
        const blob = await fetch(file.uri).then(r => r.blob());
        const formDataToSend = new FormData();
        formDataToSend.append('file', blob, file.name || `${docId}_${Date.now()}.pdf`);
        formDataToSend.append('documentType', docId);
        
        console.log('🌐 Web upload:', file.name);
        
        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formDataToSend,
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || 'Upload failed');
        }
        
        const data = await response.json();
        const uploadedUrl = data.url || data.fileUrl || file.uri;
        
        setUploadedDocs(prev => ({ ...prev, [docId]: true }));
        updateFormData(`${docId}Url`, uploadedUrl);
        Alert.alert('Success', `${file.name || 'Document'} uploaded successfully!`);
      } else {
        // Mobile: Use React Native FormData
        const formDataToSend = new FormData();
        formDataToSend.append('file', {
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
          name: file.name || `${docId}_${Date.now()}`,
        });
        formDataToSend.append('documentType', docId);
        
        console.log('📱 Mobile upload:', file.name);
        
        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formDataToSend,
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || 'Upload failed');
        }
        
        const data = await response.json();
        const uploadedUrl = data.url || data.fileUrl || file.uri;
        
        setUploadedDocs(prev => ({ ...prev, [docId]: true }));
        updateFormData(`${docId}Url`, uploadedUrl);
        Alert.alert('Success', `${file.name || 'Document'} uploaded successfully!`);
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      Alert.alert('Upload Failed', err.message || 'Please try again.');
    } finally {
      setIsUploading(null);
    }
  };

  const isAllUploaded = uploadedDocs.governmentId && uploadedDocs.certificationProof && uploadedDocs.profilePhoto;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.stepText}>Step 4 of 9</Text>
        <Text style={styles.heading}>Professional Verification</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '44%' }]} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Upload your documents for verification. ID & Certification: JPG, PNG, PDF | Profile Photo: JPG, PNG only</Text>

        {documents.map((doc) => (
          <View key={doc.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <FileText size={22} color="#4CAF50" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.docTitle}>{doc.title} {doc.required && <Text style={styles.required}>*</Text>}</Text>
                <Text style={styles.docDesc}>{doc.desc}</Text>
              </View>
              {uploadedDocs[doc.id] && <Check size={20} color="#4CAF50" />}
            </View>

            {uploadedDocs[doc.id] ? (
              <View style={styles.uploadedRow}>
                <Check size={16} color="#4CAF50" />
                <Text style={styles.uploadedText}>Document uploaded</Text>
                <TouchableOpacity onPress={() => handlePickDocument(doc.id)}>
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={() => handlePickDocument(doc.id)}
                disabled={isUploading === doc.id}
              >
                {isUploading === doc.id
                  ? <ActivityIndicator color="#4CAF50" />
                  : <Upload size={18} color="#4CAF50" />
                }
                <Text style={styles.uploadBtnText}>
                  {isUploading === doc.id ? 'Uploading...' : 'Select Document'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Document Requirements</Text>
          <Text style={styles.infoText}>
            • File size should not exceed 5MB{'\n'}
            • Supported formats: JPG, PNG, PDF{'\n'}
            • Documents must be clear and readable{'\n'}
            • Personal information will be kept secure
          </Text>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>BACK</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextBtn, !isAllUploaded && styles.nextBtnDisabled]}
            disabled={!isAllUploaded}
            onPress={() => router.push('./step5_experience')}
          >
            <Text style={styles.nextBtnText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e1e5e9',
  },
  stepText: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 4 },
  heading: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  progressContainer: { height: 4, backgroundColor: '#e1e5e9' },
  progressBar: { height: 4, backgroundColor: '#4CAF50' },
  content: { padding: 24, paddingBottom: 40 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#e1e5e9',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: '#E8F5E9', alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  cardText: { flex: 1 },
  docTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  required: { color: '#EF4444' },
  docDesc: { fontSize: 12, color: '#666' },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderWidth: 2, borderStyle: 'dashed', borderColor: '#4CAF50',
    borderRadius: 8, paddingVertical: 14, backgroundColor: '#F1F8F1',
  },
  uploadBtnText: { fontSize: 14, fontWeight: '600', color: '#4CAF50' },
  uploadedRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#E8F5E9', borderRadius: 8, padding: 12,
  },
  uploadedText: { flex: 1, fontSize: 14, color: '#2E7D32', fontWeight: '500' },
  changeText: { fontSize: 13, color: '#4CAF50', fontWeight: '600' },
  infoBox: {
    backgroundColor: '#FFFBEB', borderLeftWidth: 4,
    borderLeftColor: '#F59E0B', borderRadius: 8, padding: 14,
    marginTop: 8, marginBottom: 24,
  },
  infoTitle: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 6 },
  infoText: { fontSize: 12, color: '#666', lineHeight: 20 },
  btnRow: { flexDirection: 'row', gap: 12 },
  backBtn: {
    flex: 1, backgroundColor: '#f0f2f5', borderRadius: 8,
    paddingVertical: 14, alignItems: 'center',
  },
  backBtnText: { fontSize: 16, fontWeight: '600', color: '#333' },
  nextBtn: {
    flex: 1, backgroundColor: '#4CAF50', borderRadius: 8,
    paddingVertical: 14, alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: '#ccc' },
  nextBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
