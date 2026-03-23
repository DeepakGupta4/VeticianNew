import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api/auth';

export default function CreateClinic() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [veterinarians, setVeterinarians] = useState([]);
  const [loadingVets, setLoadingVets] = useState(true);
  const [showManualInput, setShowManualInput] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    clinicName: '',
    establishmentType: 'Owner of establishment',
    city: '',
    locality: '',
    streetAddress: '',
    fees: '',
    timings: '',
  });

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const fetchVeterinarians = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${API_URL}/admin/verified`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVeterinarians(response.data.veterinarians || []);
    } catch (error) {
      console.error('Error fetching veterinarians:', error);
    } finally {
      setLoadingVets(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.userId || !formData.clinicName || !formData.city || !formData.streetAddress) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/register-clinic`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Clinic created successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error?.message || 'Failed to create clinic');
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
        <Text style={styles.headerTitle}>Create Clinic</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Select Veterinarian *</Text>
          {loadingVets ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#4E8D7C" />
              <Text style={styles.loadingText}>Loading veterinarians...</Text>
            </View>
          ) : veterinarians.length === 0 || showManualInput ? (
            <View>
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No verified veterinarians found</Text>
                <Text style={styles.helpText}>Create a veterinarian first, then verify them from Veterinarians tab</Text>
              </View>
              <Text style={styles.label}>Enter User ID Manually</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 24-character veterinarian userId"
                value={formData.userId}
                onChangeText={(text) => setFormData({ ...formData, userId: text })}
              />
              <Text style={styles.helpText}>Get userId from Veterinarians tab (e.g., 507f1f77bcf86cd799439011)</Text>
            </View>
          ) : (
            <View>
              <ScrollView style={styles.vetList} nestedScrollEnabled>
                {veterinarians.map((vet) => (
                  <TouchableOpacity
                    key={vet._id}
                    style={[
                      styles.vetItem,
                      formData.userId === vet.userId && styles.vetItemSelected
                    ]}
                    onPress={() => setFormData({ ...formData, userId: vet.userId })}
                  >
                    <View style={styles.vetInfo}>
                      <Text style={styles.vetName}>{vet.title?.value} {vet.name?.value}</Text>
                      <Text style={styles.vetDetails}>{vet.specialization?.value} • {vet.city?.value}</Text>
                    </View>
                    {formData.userId === vet.userId && (
                      <Ionicons name="checkmark-circle" size={24} color="#4E8D7C" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity 
                style={styles.manualButton}
                onPress={() => setShowManualInput(true)}
              >
                <Text style={styles.manualButtonText}>Enter User ID Manually</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Clinic Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter clinic name"
            value={formData.clinicName}
            onChangeText={(text) => setFormData({ ...formData, clinicName: text })}
          />

          <Text style={styles.label}>Establishment Type</Text>
          <View style={styles.typeButtons}>
            {['Owner of establishment', 'Consultant doctor', 'Rented at other establishment', 'Practicing at home'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  formData.establishmentType === type && styles.typeButtonActive
                ]}
                onPress={() => setFormData({ ...formData, establishmentType: type })}
              >
                <Text style={[
                  styles.typeButtonText,
                  formData.establishmentType === type && styles.typeButtonTextActive
                ]}>
                  {type}
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

          <Text style={styles.label}>Locality</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter locality"
            value={formData.locality}
            onChangeText={(text) => setFormData({ ...formData, locality: text })}
          />

          <Text style={styles.label}>Street Address *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter street address"
            value={formData.streetAddress}
            onChangeText={(text) => setFormData({ ...formData, streetAddress: text })}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Consultation Fees</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter fees (e.g., 500)"
            value={formData.fees}
            onChangeText={(text) => setFormData({ ...formData, fees: text })}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Timings</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 9:00 AM - 6:00 PM"
            value={formData.timings}
            onChangeText={(text) => setFormData({ ...formData, timings: text })}
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating...' : 'Create Clinic'}
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    minWidth: '48%',
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
  loadingBox: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyBox: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  emptyText: {
    color: '#999',
  },
  vetList: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    maxHeight: 200,
  },
  vetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  vetItemSelected: {
    backgroundColor: '#E8F5F3',
  },
  vetInfo: {
    flex: 1,
  },
  vetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  vetDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    fontStyle: 'italic',
  },
  manualButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  manualButtonText: {
    color: '#4E8D7C',
    fontSize: 14,
    fontWeight: '600',
  },
});
