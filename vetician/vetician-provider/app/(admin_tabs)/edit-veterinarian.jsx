import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

export default function EditVeterinarian() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchVeterinarianData();
  }, [id]);

  const fetchVeterinarianData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/veterinarian/details/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const vet = response.data.veterinarian;
      setFormData({
        title: vet.title?.value || 'Dr.',
        name: vet.name?.value || '',
        gender: vet.gender?.value || 'Male',
        city: vet.city?.value || '',
        experience: vet.experience?.value?.toString() || '',
        specialization: vet.specialization?.value || 'Veterinarian',
        qualification: vet.qualification?.value || '',
        qualificationUrl: vet.qualificationUrl?.value || '',
        registration: vet.registration?.value || '',
        registrationUrl: vet.registrationUrl?.value || '',
        identityProof: vet.identityProof?.value || '',
        identityProofUrl: vet.identityProofUrl?.value || '',
        profilePhotoUrl: vet.profilePhotoUrl?.value || '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load veterinarian data');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.city || !formData.registration) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`${API_URL}/auth/veterinarian/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Veterinarian updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update veterinarian');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E8D7C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Veterinarian</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
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

          <TouchableOpacity
            style={[styles.submitButton, saving && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={saving}
          >
            <Text style={styles.submitButtonText}>
              {saving ? 'Updating...' : 'Update Veterinarian'}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
