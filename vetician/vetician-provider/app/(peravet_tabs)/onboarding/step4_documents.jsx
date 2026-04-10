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
      console.log('📄 Picking document for:', docId);
      const result = await DocumentPicker.getDocumentAsync({
        type: doc.type,
        copyToCacheDirectory: true,
      });

      console.log('📦 Document picker result:', result);

      if (result.canceled) {
        console.log('❌ Document picker cancelled');
        return;
      }

      const file = result.assets[0];
      console.log('✅ File selected:', { name: file.name, size: file.size, type: file.mimeType, uri: file.uri });
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        Alert.alert('Error', 'File size exceeds 5MB limit. Please choose a smaller file.');
        return;
      }
      
      await uploadFile(docId, file);
    } catch (err) {
      console.error('❌ Document picker error:', err);
      Alert.alert('Error', 'Could not pick document. Please try again.');
    }
  };

  const uploadFile = async (docId, file) => {
    setIsUploading(docId);
    try {
      const token = await AsyncStorage.getItem('token');
      
      console.log('📦 File to upload:', { name: file.name, type: file.mimeType, uri: file.uri.substring(0, 50) + '...', size: file.size });
      
      // Check if it's a data URI (base64) or blob URI - both indicate web
      const isDataUri = file.uri.startsWith('data:');
      const isBlobUri = file.uri.startsWith('blob:');
      const isWeb = isDataUri || isBlobUri;
      
      if (isWeb) {
        // Web: Handle data URI or blob URI
        console.log('🌐 Web upload detected');
        
        let blob;
        if (isDataUri) {
          // Convert data URI to blob
          console.log('📄 Converting data URI to blob...');
          const response = await fetch(file.uri);
          blob = await response.blob();
        } else {
          // Convert blob URI to blob
          console.log('📄 Fetching blob from URI...');
          const response = await fetch(file.uri);
          blob = await response.blob();
        }
        
        const fileName = file.name || `${docId}_${Date.now()}.${blob.type.split('/')[1] || 'pdf'}`;
        console.log('✅ Blob created:', fileName, blob.type, blob.size);
        
        const formDataToSend = new FormData();
        formDataToSend.append('file', blob, fileName);
        formDataToSend.append('documentType', docId);
        
        console.log('🚀 Uploading to:', `${API_URL}/upload`);
        
        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formDataToSend,
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Response error:', errorText);
          let err;
          try {
            err = JSON.parse(errorText);
          } catch {
            err = { message: errorText || 'Upload failed' };
          }
          throw new Error(err.message || 'Upload failed');
        }
        
        const data = await response.json();
        console.log('✅ Upload response:', data);
        
        const uploadedUrl = data.url || data.fileUrl || file.uri;
        
        setUploadedDocs(prev => ({ ...prev, [docId]: true }));
        updateFormData(`${docId}Url`, uploadedUrl);
        Alert.alert('Success', `${file.name || 'Document'} uploaded successfully!`);
      } else {
        // Mobile: Use XMLHttpRequest for React Native
        console.log('📱 Mobile upload detected');
        
        const fileToUpload = {
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
          name: file.name || `${docId}_${Date.now()}`,
        };
        
        console.log('📤 File object to upload:', fileToUpload);
        
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          xhr.onload = () => {
            console.log('📡 Response status:', xhr.status);
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                console.log('✅ Upload response:', data);
                const uploadedUrl = data.url || data.fileUrl || file.uri;
                setUploadedDocs(prev => ({ ...prev, [docId]: true }));
                updateFormData(`${docId}Url`, uploadedUrl);
                Alert.alert('Success', `${file.name || 'Document'} uploaded successfully!`);
                setIsUploading(null);
                resolve(data);
              } catch (err) {
                console.error('❌ Parse error:', err);
                setIsUploading(null);
                reject(new Error('Failed to parse response'));
              }
            } else {
              console.error('❌ Response error:', xhr.responseText);
              setIsUploading(null);
              try {
                const err = JSON.parse(xhr.responseText);
                reject(new Error(err.message || 'Upload failed'));
              } catch {
                reject(new Error(xhr.responseText || 'Upload failed'));
              }
            }
          };
          
          xhr.onerror = () => {
            console.error('❌ Network error');
            setIsUploading(null);
            reject(new Error('Network error'));
          };
          
          xhr.open('POST', `${API_URL}/upload`);
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          
          const formData = new FormData();
          formData.append('file', fileToUpload);
          formData.append('documentType', docId);
          
          console.log('🚀 Uploading to:', `${API_URL}/upload`);
          xhr.send(formData);
        });
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
