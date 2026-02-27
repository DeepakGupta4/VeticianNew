import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

export default function ClinicsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unverified');
  const [clinics, setClinics] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ visible: false, clinicId: '', clinicName: '' });

  useEffect(() => {
    fetchClinics();
  }, [activeTab]);

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const endpoint = activeTab === 'verified' ? '/auth/admin/verified/clinic' : '/auth/admin/unverified/clinic';
      const response = await axios.post(`${API_URL}${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClinics(response.data.clinics || []);
    } catch (error) {
      console.error('Error fetching clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyClinic = async (clinicId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/auth/admin/clinic/verify/${clinicId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Clinic verified successfully');
      fetchClinics();
    } catch (error) {
      Alert.alert('Error', 'Failed to verify clinic');
    }
  };

  const unverifyClinic = async (clinicId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/auth/admin/clinic/unverify/${clinicId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Clinic moved to unverified');
      fetchClinics();
    } catch (error) {
      Alert.alert('Error', 'Failed to unverify clinic');
    }
  };

  const deleteClinic = async (clinicId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${API_URL}/auth/clinic/${clinicId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Clinic deleted successfully');
      setDeleteModal({ visible: false, clinicId: '', clinicName: '' });
      fetchClinics();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete clinic');
    }
  };

  const formatTimings = (timings) => {
    if (!timings || typeof timings !== 'object') return 'Not specified';
    
    const days = Object.keys(timings);
    if (days.length === 0) return 'Not specified';
    
    return days.map(day => {
      const timing = timings[day];
      return `${day.toUpperCase()}: ${timing.start} - ${timing.end}`;
    }).join(', ');
  };

  const ClinicCard = ({ clinic }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.clinicIcon}>
          <Ionicons name="business" size={32} color="#4E8D7C" />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.clinicName}>{clinic.clinicName}</Text>
          <Text style={styles.clinicType}>{clinic.establishmentType}</Text>
          <Text style={styles.clinicLocation}>{clinic.locality}, {clinic.city}</Text>
        </View>
        {clinic.verified && (
          <Ionicons name="checkmark-circle" size={24} color="#4E8D7C" />
        )}
      </View>

      <View style={styles.cardDetails}>
        <DetailRow icon="location" label="Address" value={clinic.streetAddress} />
        <DetailRow icon="cash" label="Fees" value={`₹${clinic.fees}`} />
        <DetailRow icon="time" label="Timings" value={formatTimings(clinic.timings)} />
      </View>

      {clinic.veterinarian && (
        <View style={styles.vetSection}>
          <Text style={styles.vetSectionTitle}>Veterinarian</Text>
          <View style={styles.vetInfo}>
            <Image
              source={{ uri: clinic.veterinarian.profilePhotoUrl || 'https://via.placeholder.com/40' }}
              style={styles.vetAvatar}
            />
            <View>
              <Text style={styles.vetName}>{clinic.veterinarian.name}</Text>
              <Text style={styles.vetSpecialization}>{clinic.veterinarian.specialization}</Text>
            </View>
          </View>
        </View>
      )}

      {clinic.verified && activeTab === 'verified' && (
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.unverifyButton}
            onPress={() => unverifyClinic(clinic._id)}
          >
            <Ionicons name="close-circle" size={18} color="#FFF" />
            <Text style={styles.unverifyButtonText}>Unverify</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => setDeleteModal({ visible: true, clinicId: clinic._id, clinicName: clinic.clinicName })}
          >
            <Ionicons name="trash" size={18} color="#FFF" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {!clinic.verified && (
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => verifyClinic(clinic._id)}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
          <Text style={styles.verifyButtonText}>Verify Clinic</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={16} color="#666" style={styles.detailIcon} />
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clinics</Text>
        <TouchableOpacity onPress={fetchClinics}>
          <Ionicons name="refresh" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unverified' && styles.activeTab]}
          onPress={() => setActiveTab('unverified')}
        >
          <Text style={[styles.tabText, activeTab === 'unverified' && styles.activeTabText]}>
            Unverified
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'verified' && styles.activeTab]}
          onPress={() => setActiveTab('verified')}
        >
          <Text style={[styles.tabText, activeTab === 'verified' && styles.activeTabText]}>
            Verified
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E8D7C" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {clinics.length === 0 ? (
            <Text style={styles.emptyText}>No clinics found</Text>
          ) : (
            clinics.map(clinic => <ClinicCard key={clinic._id} clinic={clinic} />)
          )}
        </ScrollView>
      )}

      <Modal
        visible={deleteModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModal({ visible: false, clinicId: '', clinicName: '' })}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContent}>
            <Ionicons name="warning" size={50} color="#E74C3C" />
            <Text style={styles.deleteModalTitle}>Delete Clinic?</Text>
            <Text style={styles.deleteModalText}>Are you sure you want to delete {deleteModal.clinicName}? This action cannot be undone.</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setDeleteModal({ visible: false, clinicId: '', clinicName: '' })}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmDeleteButton}
                onPress={() => deleteClinic(deleteModal.clinicId)}
              >
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    elevation: 2,
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4E8D7C',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4E8D7C',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  clinicIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardHeaderText: {
    flex: 1,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clinicType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  clinicLocation: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  cardDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  vetSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  vetSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  vetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vetAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  vetName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  vetSpecialization: {
    fontSize: 12,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  unverifyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F39C12',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  unverifyButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#4E8D7C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  verifyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deleteModalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  deleteModalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
  },
  confirmDeleteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
