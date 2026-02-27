import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CreateParavet() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobileNumber: '',
    city: '',
    serviceArea: '',
    yearsOfExperience: '',
  });

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.mobileNumber) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      // Create user account
      const userResponse = await axios.post(
        'https://vetician-backend-kovk.onrender.com/api/auth/register',
        {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: 'paravet',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userId = userResponse.data.user._id;

      // Initialize paravet profile
      await axios.post(
        'https://vetician-backend-kovk.onrender.com/api/paravet/initialize',
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update personal info
      await axios.patch(
        `https://vetician-backend-kovk.onrender.com/api/paravet/personal-info/${userId}`,
        {
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          city: formData.city,
          serviceArea: formData.serviceArea,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update experience
      if (formData.yearsOfExperience) {
        await axios.patch(
          `https://vetician-backend-kovk.onrender.com/api/paravet/experience-skills/${userId}`,
          {
            yearsOfExperience: formData.yearsOfExperience,
            areasOfExpertise: [],
            languagesSpoken: [],
            availability: { days: [], startTime: '', endTime: '' },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      Alert.alert('Success', 'Paravet created successfully!');
      router.back();
    } catch (error) {
      console.error('Error creating paravet:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create paravet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Paravet</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          placeholder="Enter full name"
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          placeholder="Enter password"
          secureTextEntry
        />

        <Text style={styles.label}>Mobile Number *</Text>
        <TextInput
          style={styles.input}
          value={formData.mobileNumber}
          onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
          placeholder="Enter mobile number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          placeholder="Enter city"
        />

        <Text style={styles.label}>Service Area</Text>
        <TextInput
          style={styles.input}
          value={formData.serviceArea}
          onChangeText={(text) => setFormData({ ...formData, serviceArea: text })}
          placeholder="Enter service area"
        />

        <Text style={styles.label}>Years of Experience</Text>
        <TextInput
          style={styles.input}
          value={formData.yearsOfExperience}
          onChangeText={(text) => setFormData({ ...formData, yearsOfExperience: text })}
          placeholder="Enter years of experience"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Creating...' : 'Create Paravet'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9B59B6',
    padding: 20,
    paddingTop: 50,
    gap: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  submitButton: {
    backgroundColor: '#9B59B6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: { backgroundColor: '#CCC' },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
