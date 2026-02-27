// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Upload, FileText, Check } from 'lucide-react-native';
// import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';

// export default function Step4Documents() {
//   const router = useRouter();
//   const { formData, updateFormData } = useParavetOnboarding();
//   const [uploadProgress, setUploadProgress] = useState({
//     governmentId: false,
//     certificationProof: false,
//     vetRecommendation: false,
//     profilePhoto: false,
//   });

//   const documents = [
//     {
//       id: 'governmentId',
//       title: 'Government-Issued ID',
//       description: 'Aadhaar, PAN, or any valid government ID',
//       required: true,
//       icon: 'id',
//     },
//     {
//       id: 'certificationProof',
//       title: 'Paravet Certification/Training Proof',
//       description: 'Certificate or completion proof from training program',
//       required: true,
//       icon: 'cert',
//     },
//     {
//       id: 'vetRecommendation',
//       title: 'Veterinarian Recommendation Letter',
//       description: 'Optional: Gives you a trust badge',
//       required: false,
//       icon: 'letter',
//     },
//     {
//       id: 'profilePhoto',
//       title: 'Profile Photo',
//       description: 'Clear selfie for profile verification',
//       required: true,
//       icon: 'photo',
//     },
//   ];

//   const handleUpload = (docId) => {
//     Alert.alert(
//       'Upload Document',
//       'Choose how to upload:',
//       [
//         {
//           text: 'Camera',
//           onPress: () => simulateUpload(docId),
//         },
//         {
//           text: 'Gallery',
//           onPress: () => simulateUpload(docId),
//         },
//         {
//           text: 'Cancel',
//           onPress: () => {},
//           style: 'cancel',
//         },
//       ]
//     );
//   };

//   const simulateUpload = (docId) => {
//     // Simulate upload
//     setUploadProgress(prev => ({
//       ...prev,
//       [docId]: true,
//     }));
    
//     // Mock URL - in real app, this would be from actual upload service
//     const mockUrl = `https://example.com/uploads/${docId}_${Date.now()}.jpg`;
    
//     switch (docId) {
//       case 'governmentId':
//         updateFormData('governmentIdUrl', mockUrl);
//         break;
//       case 'certificationProof':
//         updateFormData('certificationProofUrl', mockUrl);
//         break;
//       case 'vetRecommendation':
//         updateFormData('vetRecommendationUrl', mockUrl);
//         break;
//       case 'profilePhoto':
//         updateFormData('profilePhotoUrl', mockUrl);
//         break;
//     }

//     Alert.alert('Success', 'Document uploaded successfully');
//   };

//   const isAllRequiredUploaded = formData.governmentIdUrl && 
//                                  formData.certificationProofUrl && 
//                                  formData.profilePhotoUrl;

//   const handleNext = () => {
//     if (!isAllRequiredUploaded) {
//       Alert.alert('Missing Documents', 'Please upload all required documents to proceed');
//       return;
//     }
//     router.push('./step5_experience');
//   };

//   const handleBack = () => {
//     router.back();
//   };

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>Step 4 of 9</Text>
//         <Text style={styles.heading}>Professional Verification</Text>
//       </View>

//       {/* Progress Bar */}
//       <View style={styles.progressContainer}>
//         <View style={[styles.progressBar, { width: '44%' }]} />
//       </View>

//       {/* Content */}
//       <View style={styles.contentContainer}>
//         <Text style={styles.subtitle}>Upload your documents for verification</Text>

//         {/* Documents List */}
//         {documents.map((doc) => (
//           <View key={doc.id} style={styles.documentCard}>
//             <View style={styles.documentHeader}>
//               <View style={styles.documentTitleSection}>
//                 <View style={styles.iconContainer}>
//                   <FileText size={20} color="#00B0FF" />
//                 </View>
//                 <View style={styles.titleSection}>
//                   <View style={styles.titleRow}>
//                     <Text style={styles.documentTitle}>{doc.title}</Text>
//                     {doc.required && <Text style={styles.requiredBadge}>*</Text>}
//                   </View>
//                   <Text style={styles.documentDescription}>{doc.description}</Text>
//                 </View>
//               </View>
//               {formData[`${doc.id}Url`] && (
//                 <View style={styles.successBadge}>
//                   <Check size={16} color="#34C759" />
//                 </View>
//               )}
//             </View>

//             {formData[`${doc.id}Url`] ? (
//               <View style={styles.uploadedState}>
//                 <View style={styles.uploadedCheckmark}>
//                   <Check size={16} color="#34C759" />
//                 </View>
//                 <Text style={styles.uploadedText}>Uploaded</Text>
//                 <TouchableOpacity
//                   onPress={() => handleUpload(doc.id)}
//                 >
//                   <Text style={styles.replaceLink}>Replace</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity
//                 style={styles.uploadButton}
//                 onPress={() => handleUpload(doc.id)}
//               >
//                 <Upload size={20} color="#00B0FF" />
//                 <Text style={styles.uploadButtonText}>Upload</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         ))}

//         {/* Info Box */}
//         <View style={styles.infoBox}>
//           <Text style={styles.infoTitle}>Document Requirements</Text>
//           <Text style={styles.infoText}>
//             • Documents must be clear and readable{'\n'}
//             • File size should not exceed 5MB{'\n'}
//             • Supported formats: JPG, PNG, PDF{'\n'}
//             • Personal information will be kept secure
//           </Text>
//         </View>

//         {/* Navigation Buttons */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//             <Text style={styles.backButtonText}>BACK</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.nextButton, !isAllRequiredUploaded && styles.nextButtonDisabled]}
//             onPress={handleNext}
//             disabled={!isAllRequiredUploaded}
//           >
//             <Text style={styles.nextButtonText}>NEXT</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     paddingHorizontal: 24,
//     paddingTop: 20,
//     paddingBottom: 12,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e1e5e9',
//   },
//   title: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 4,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   progressContainer: {
//     height: 4,
//     backgroundColor: '#e1e5e9',
//     width: '100%',
//   },
//   progressBar: {
//     height: 4,
//     backgroundColor: '#00B0FF',
//   },
//   contentContainer: {
//     padding: 24,
//     paddingBottom: 40,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 20,
//   },
//   documentCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e1e5e9',
//   },
//   documentHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   documentTitleSection: {
//     flexDirection: 'row',
//     flex: 1,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//     backgroundColor: '#E8F4FD',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   titleSection: {
//     flex: 1,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   documentTitle: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#1a1a1a',
//   },
//   requiredBadge: {
//     fontSize: 16,
//     color: '#FF3B30',
//     marginLeft: 4,
//   },
//   documentDescription: {
//     fontSize: 12,
//     color: '#666',
//   },
//   successBadge: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#E8F5E9',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   uploadButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//     borderStyle: 'dashed',
//     borderColor: '#00B0FF',
//     borderRadius: 8,
//     paddingVertical: 12,
//     backgroundColor: '#E8F4FD',
//     gap: 8,
//   },
//   uploadButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#00B0FF',
//   },
//   uploadedState: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#F0F9FF',
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//   },
//   uploadedCheckmark: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#E8F5E9',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   uploadedText: {
//     flex: 1,
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#34C759',
//     marginLeft: 12,
//   },
//   replaceLink: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#00B0FF',
//   },
//   infoBox: {
//     backgroundColor: '#FFFAF0',
//     borderLeftWidth: 4,
//     borderLeftColor: '#FF9500',
//     borderRadius: 8,
//     padding: 14,
//     marginTop: 24,
//     marginBottom: 24,
//   },
//   infoTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   infoText: {
//     fontSize: 12,
//     color: '#666',
//     lineHeight: 18,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 24,
//   },
//   backButton: {
//     flex: 1,
//     backgroundColor: '#f0f2f5',
//     borderRadius: 8,
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   backButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   nextButton: {
//     flex: 1,
//     backgroundColor: '#00B0FF',
//     borderRadius: 8,
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   nextButtonDisabled: {
//     backgroundColor: '#ccc',
//   },
//   nextButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//   },
// });

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Upload, FileText, Check } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';

export default function Step4Documents() {
  const router = useRouter();
  const { formData, updateFormData } = useParavetOnboarding();
  const [isUploading, setIsUploading] = useState(null);

  const documents = [
    { id: 'governmentId', title: 'Government-Issued ID', required: true },
    { id: 'certificationProof', title: 'Certification Proof', required: true },
    { id: 'profilePhoto', title: 'Profile Photo', required: true },
  ];

  const handleUploadPress = async (docId) => {
    if (Platform.OS === 'web') {
      openPicker(docId, 'gallery');
    } else {
      Alert.alert('Upload', 'Choose source', [
        { text: 'Camera', onPress: () => openPicker(docId, 'camera') },
        { text: 'Gallery', onPress: () => openPicker(docId, 'gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const openPicker = async (docId, mode) => {
    const options = {
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    };

    let result;
    if (mode === 'camera') {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      uploadFile(docId, result.assets[0]);
    }
  };

 const uploadFile = async (docId, asset) => {
  setIsUploading(docId);

  try {
    const formDataToSend = new FormData();
    
    // Get token for authentication
    const token = await AsyncStorage.getItem('token');
    
    // Use localhost for testing, production URL for deployed
    const uploadUrl = __DEV__ 
      ? 'http://localhost:3000/api/upload'
      : 'https://vetician-backend-kovk.onrender.com/api/upload';
    
    if (Platform.OS === 'web') {
      // For web, fetch the blob from the URI
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      formDataToSend.append('file', blob, `${docId}_${Date.now()}.jpg`);
    } else {
      // For mobile
      formDataToSend.append('file', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: `${docId}_${Date.now()}.jpg`,
      });
    }
    
    formDataToSend.append('documentType', docId);
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formDataToSend,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}));
      throw new Error(errorData.message || 'Upload failed');
    }
    
    const data = await uploadResponse.json();
    const uploadedUrl = data.url || data.fileUrl || asset.uri;

    updateFormData(`${docId}Url`, uploadedUrl);
    Alert.alert('Success', 'Document uploaded successfully!');
  } catch (err) {
    console.error('Upload error:', err);
    Alert.alert('Error', err.message || 'Upload failed. Please try again.');
  } finally {
    setIsUploading(null);
  }
};


  const isAllRequiredUploaded = formData.governmentIdUrl && 
                                 formData.certificationProofUrl && 
                                 formData.profilePhotoUrl;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Professional Verification</Text>
      </View>

      <View style={styles.contentContainer}>
        {documents.map((doc) => (
          <View key={doc.id} style={styles.documentCard}>
            <View style={styles.titleRow}>
              <FileText size={20} color="#00B0FF" />
              <Text style={styles.documentTitle}>{doc.title}</Text>
            </View>

            {formData[`${doc.id}Url`] ? (
              <View style={styles.successState}>
                <Check size={18} color="#34C759" />
                <Text style={{color: '#34C759', flex: 1, marginLeft: 8}}>Ready</Text>
                <TouchableOpacity onPress={() => handleUploadPress(doc.id)}>
                   <Text style={{color: '#00B0FF'}}>Change</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.uploadBtn} 
                onPress={() => handleUploadPress(doc.id)}
                disabled={isUploading === doc.id}
              >
                {isUploading === doc.id ? <ActivityIndicator color="#00B0FF" /> : <Upload size={20} color="#00B0FF" />}
                <Text style={styles.uploadBtnText}>Select File</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity 
           style={[styles.nextBtn, !isAllRequiredUploaded && {backgroundColor: '#ccc'}]}
           disabled={!isAllRequiredUploaded}
           onPress={() => router.push('./step5_experience')}
        >
          <Text style={{color: '#fff', fontWeight: 'bold'}}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 24, backgroundColor: '#fff', paddingTop: 60 },
  heading: { fontSize: 22, fontWeight: '700' },
  contentContainer: { padding: 20 },
  documentCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 },
  documentTitle: { fontSize: 16, fontWeight: '600' },
  uploadBtn: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#00B0FF', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: '#f0faff' },
  uploadBtnText: { color: '#00B0FF', fontWeight: '600' },
  successState: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8fdf0', padding: 12, borderRadius: 8 },
  nextBtn: { backgroundColor: '#00B0FF', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 20 }
});
