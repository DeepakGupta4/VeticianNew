import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert, Modal, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

export default function VeterinariansScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unverified');
  const [veterinarians, setVeterinarians] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [documentModal, setDocumentModal] = useState({ visible: false, url: '', type: '' });
  const [deleteModal, setDeleteModal] = useState({ visible: false, vetId: '', vetName: '' });

  useEffect(() => {
    fetchVeterinarians();
  }, [activeTab]);

  const fetchVeterinarians = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const endpoint = activeTab === 'verified' ? '/auth/admin/verified' : '/auth/admin/unverified';
      const response = await axios.post(`${API_URL}${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVeterinarians(response.data.veterinarians || []);
    } catch (error) {
      console.error('Error fetching veterinarians:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyField = async (vetId, fieldName) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.patch(`${API_URL}/auth/verify/${vetId}/${fieldName}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchVeterinarians();
    } catch (error) {
      Alert.alert('Error', 'Failed to verify field');
    }
  };

  const deleteVeterinarian = async (vetId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${API_URL}/auth/veterinarian/${vetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Veterinarian deleted successfully');
      setDeleteModal({ visible: false, vetId: '', vetName: '' });
      fetchVeterinarians();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete veterinarian');
    }
  };

  const unverifyVeterinarian = async (vetId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.patch(`${API_URL}/auth/unverify/${vetId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Veterinarian moved to unverified');
      fetchVeterinarians();
    } catch (error) {
      Alert.alert('Error', 'Failed to unverify veterinarian');
    }
  };

  const openDocument = (url, type) => {
    if (url) {
      if (type === 'Profile Photo') {
        // Profile photo is image - show in modal
        setDocumentModal({ visible: true, url, type });
      } else {
        // Documents are PDFs - open with Google Docs Viewer
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
        Linking.openURL(viewerUrl).catch(() => {
          Alert.alert('Error', 'Could not open document');
        });
      }
    }
  };

  const VetCard = ({ vet }) => {
    const isExpanded = expandedCards[vet._id] || false;
    
    const toggleExpand = () => {
      setExpandedCards(prev => ({
        ...prev,
        [vet._id]: !prev[vet._id]
      }));
    };
    
    return (
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.cardHeader}
          onPress={toggleExpand}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: vet.profilePhotoUrl?.value || 'https://via.placeholder.com/60' }}
            style={styles.avatar}
          />
          <View style={styles.cardHeaderText}>
            <Text style={styles.vetName}>{vet.title?.value} {vet.name?.value}</Text>
            <Text style={styles.vetSpecialization}>{vet.specialization?.value}</Text>
            <Text style={styles.vetCity}>{vet.city?.value}</Text>
          </View>
          <View style={styles.headerRight}>
            {vet.isVerified && (
              <Ionicons name="checkmark-circle" size={24} color="#4E8D7C" style={{ marginRight: 10 }} />
            )}
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#666" 
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {activeTab === 'verified' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => router.push(`/(admin_tabs)/edit-veterinarian?id=${vet._id}`)}
                >
                  <Ionicons name="create" size={18} color="#FFF" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.unverifyButton}
                  onPress={() => unverifyVeterinarian(vet._id)}
                >
                  <Ionicons name="close-circle" size={18} color="#FFF" />
                  <Text style={styles.unverifyButtonText}>Unverify</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => setDeleteModal({ visible: true, vetId: vet._id, vetName: vet.name?.value })}
                >
                  <Ionicons name="trash" size={18} color="#FFF" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.sectionTitle}>Personal Information</Text>
            <DetailRow 
              label="Full Name" 
              value={`${vet.title?.value} ${vet.name?.value}`} 
              verified={vet.name?.verified}
              onVerify={() => verifyField(vet._id, 'name')}
            />
            <DetailRow 
              label="Gender" 
              value={vet.gender?.value} 
              verified={vet.gender?.verified}
              onVerify={() => verifyField(vet._id, 'gender')}
            />
            <DetailRow 
              label="City" 
              value={vet.city?.value} 
              verified={vet.city?.verified}
              onVerify={() => verifyField(vet._id, 'city')}
            />

            <Text style={styles.sectionTitle}>Professional Details</Text>
            <DetailRow 
              label="Experience" 
              value={`${vet.experience?.value} years`} 
              verified={vet.experience?.verified}
              onVerify={() => verifyField(vet._id, 'experience')}
            />
            <DetailRow 
              label="Specialization" 
              value={vet.specialization?.value} 
              verified={vet.specialization?.verified}
              onVerify={() => verifyField(vet._id, 'specialization')}
            />
            <DetailRow 
              label="Qualification" 
              value={vet.qualification?.value} 
              verified={vet.qualification?.verified}
              onVerify={() => verifyField(vet._id, 'qualification')}
            />
            <DetailRow 
              label="Registration" 
              value={vet.registration?.value} 
              verified={vet.registration?.verified}
              onVerify={() => verifyField(vet._id, 'registration')}
            />

            <Text style={styles.sectionTitle}>Documents</Text>
            {vet.identityProofUrl?.value && (
              <DetailRow 
                label="Identity Proof" 
                value="View Document" 
                verified={vet.identityProofUrl?.verified}
                onVerify={() => verifyField(vet._id, 'identityProofUrl')}
                isDocument
                documentUrl={vet.identityProofUrl?.value}
              />
            )}
            {vet.qualificationUrl?.value && (
              <DetailRow 
                label="Qualification Proof" 
                value="View Document" 
                verified={vet.qualificationUrl?.verified}
                onVerify={() => verifyField(vet._id, 'qualificationUrl')}
                isDocument
                documentUrl={vet.qualificationUrl?.value}
              />
            )}
            {vet.registrationUrl?.value && (
              <DetailRow 
                label="Registration Proof" 
                value="View Document" 
                verified={vet.registrationUrl?.verified}
                onVerify={() => verifyField(vet._id, 'registrationUrl')}
                isDocument
                documentUrl={vet.registrationUrl?.value}
              />
            )}
            {vet.profilePhotoUrl?.value && (
              <DetailRow 
                label="Profile Photo" 
                value="View Photo" 
                verified={vet.profilePhotoUrl?.verified}
                onVerify={() => verifyField(vet._id, 'profilePhotoUrl')}
                isDocument
                documentUrl={vet.profilePhotoUrl?.value}
              />
            )}
          </View>
        )}
      </View>
    );
  };

  const DetailRow = ({ label, value, verified, onVerify, isDocument, documentUrl }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <Text style={styles.detailLabel}>{label}:</Text>
        {isDocument && documentUrl ? (
          <TouchableOpacity onPress={() => openDocument(documentUrl, label)}>
            <Text style={[styles.detailValue, { color: '#4E8D7C', textDecorationLine: 'underline' }]}>{value}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.detailValue}>{value || 'Not provided'}</Text>
        )}
      </View>
      <View style={styles.detailRight}>
        {verified ? (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#4E8D7C" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.verifyBtn} onPress={onVerify}>
            <Ionicons name="checkmark" size={16} color="#FFF" />
            <Text style={styles.verifyBtnText}>Verify</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Veterinarians</Text>
        <TouchableOpacity onPress={fetchVeterinarians}>
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
          {veterinarians.length === 0 ? (
            <Text style={styles.emptyText}>No veterinarians found</Text>
          ) : (
            veterinarians.map(vet => <VetCard key={vet._id} vet={vet} />)
          )}
        </ScrollView>
      )}

      <Modal
        visible={documentModal.visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setDocumentModal({ visible: false, url: '', type: '' })}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{documentModal.type}</Text>
            <TouchableOpacity onPress={() => setDocumentModal({ visible: false, url: '', type: '' })}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalContentContainer}>
              {documentModal.url ? (
                <Image 
                  source={{ uri: documentModal.url }} 
                  style={styles.documentImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.noDocumentText}>No document available</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModal({ visible: false, vetId: '', vetName: '' })}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContent}>
            <Ionicons name="warning" size={50} color="#E74C3C" />
            <Text style={styles.deleteModalTitle}>Delete Veterinarian?</Text>
            <Text style={styles.deleteModalText}>Are you sure you want to delete {deleteModal.vetName}? This action cannot be undone.</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setDeleteModal({ visible: false, vetId: '', vetName: '' })}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmDeleteButton}
                onPress={() => deleteVeterinarian(deleteModal.vetId)}
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
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  cardHeaderText: {
    flex: 1,
  },
  vetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  vetSpecialization: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  vetCity: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  cardDetails: {
    marginBottom: 10,
  },
  expandedContent: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  detailLeft: {
    flex: 1,
  },
  detailRight: {
    marginLeft: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4E8D7C',
    fontWeight: '600',
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4E8D7C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  verifyBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  verifyButton: {
    backgroundColor: '#4E8D7C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  verifyButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#4E8D7C',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  documentImage: {
    width: '100%',
    height: 600,
  },
  noDocumentText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
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
