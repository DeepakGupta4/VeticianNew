import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api/auth';

export default function CreateVeterinarian() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    title: 'Dr.',
    name: '',
    gender: 'Male',
    city: '',
    experience: '',
    specialization: 'Veterinarian',
    qualification: '',
    qualificationUrl: '',
    registration: '',
    registrationUrl: '',
    identityProof: '',
    identityProofUrl: '',
    profilePhotoUrl: '',
  });

  const handleSubmit = async () => {
    if (!formData.userId || !formData.name || !formData.city || !formData.registration) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Add default values for optional fields
    const submitData = {
      ...formData,
      experience: formData.experience || '0',
      qualification: formData.qualification || 'BVSc',
      qualificationUrl: formData.qualificationUrl || 'https://example.com/qualification.pdf',
      registrationUrl: formData.registrationUrl || 'https://example.com/registration.pdf',
      identityProof: formData.identityProof || 'Aadhar',
      identityProofUrl: formData.identityProofUrl || 'https://example.com/identity.pdf',
      profilePhotoUrl: formData.profilePhotoUrl || 'https://via.placeholder.com/150',
    };

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/veterinarian-register`, submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Veterinarian created successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create veterinarian');
      console.error('Full error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Veterinarian</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>User ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter user ID"
            value={formData.userId}
            onChangeText={(text) => setFormData({ ...formData, userId: text })}
          />

          <Text style={styles.label}>Title</Text>
          <View style={styles.typeButtons}>
            {['Dr.', 'Prof.', 'Mr.', 'Ms.'].map((title) => (
              <TouchableOpacity
                key={title}
                style={[
                  styles.typeButton,
                  formData.title === title && styles.typeButtonActive
                ]}
                onPress={() => setFormData({ ...formData, title })}
              >
                <Text style={[
                  styles.typeButtonText,
                  formData.title === title && styles.typeButtonTextActive
                ]}>
                  {title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.typeButtons}>
            {['Male', 'Female', 'Other'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.typeButton,
                  formData.gender === gender && styles.typeButtonActive
                ]}
                onPress={() => setFormData({ ...formData, gender })}
              >
                <Text style={[
                  styles.typeButtonText,
                  formData.gender === gender && styles.typeButtonTextActive
                ]}>
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
          />

          <Text style={styles.label}>Experience (years)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter years of experience"
            value={formData.experience}
            onChangeText={(text) => setFormData({ ...formData, experience: text })}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Specialization *</Text>
          <View style={styles.typeButtons}>
            {['Veterinarian', 'Vetician', 'Surgeon', 'Dermatologist', 'Other'].map((spec) => (
              <TouchableOpacity
                key={spec}
                style={[
                  styles.typeButton,
                  formData.specialization === spec && styles.typeButtonActive
                ]}
                onPress={() => setFormData({ ...formData, specialization: spec })}
              >
                <Text style={[
                  styles.typeButtonText,
                  formData.specialization === spec && styles.typeButtonTextActive
                ]}>
                  {spec}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Qualification</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., BVSc, MVSc"
            value={formData.qualification}
            onChangeText={(text) => setFormData({ ...formData, qualification: text })}
          />

          <Text style={styles.label}>Registration Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter registration number"
            value={formData.registration}
            onChangeText={(text) => setFormData({ ...formData, registration: text })}
          />

          <Text style={styles.label}>Qualification Documents URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/qualification.pdf"
            value={formData.qualificationUrl}
            onChangeText={(text) => setFormData({ ...formData, qualificationUrl: text })}
          />
          <Text style={styles.helpText}>Upload to cloud & paste URL (e.g., Google Drive, Cloudinary)</Text>

          <Text style={styles.label}>Registration Proof URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/registration.pdf"
            value={formData.registrationUrl}
            onChangeText={(text) => setFormData({ ...formData, registrationUrl: text })}
          />
          <Text style={styles.helpText}>Upload registration certificate & paste URL</Text>

          <Text style={styles.label}>Identity Proof Type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Aadhar, PAN, Passport"
            value={formData.identityProof}
            onChangeText={(text) => setFormData({ ...formData, identityProof: text })}
          />

          <Text style={styles.label}>Identity Proof URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/identity.pdf"
            value={formData.identityProofUrl}
            onChangeText={(text) => setFormData({ ...formData, identityProofUrl: text })}
          />
          <Text style={styles.helpText}>Upload identity document & paste URL</Text>

          <Text style={styles.label}>Profile Photo URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/photo.jpg"
            value={formData.profilePhotoUrl}
            onChangeText={(text) => setFormData({ ...formData, profilePhotoUrl: text })}
          />
          <Text style={styles.helpText}>Upload photo & paste URL</Text>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating...' : 'Create Veterinarian'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4E8D7C',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    marginTop: 5,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  typeButton: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeButtonActive: {
    backgroundColor: '#4E8D7C',
    borderColor: '#4E8D7C',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4E8D7C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    fontStyle: 'italic',
  },
});
