import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert, Modal, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : (process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api');

export default function ParavetsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unverified');
  const [paravets, setParavets] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [documentModal, setDocumentModal] = useState({ visible: false, url: '', type: '' });

  useEffect(() => {
    fetchParavets();
  }, [activeTab]);

  const fetchParavets = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const endpoint = activeTab === 'verified' ? '/paravet/verified' : '/paravet/admin/unverified';
      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParavets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching paravets:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyParavet = async (paravetId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.patch(`${API_URL}/paravet/admin/verify/${paravetId}`, 
        { approvalStatus: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Paravet verified successfully');
      fetchParavets();
    } catch (error) {
      console.error('Verify error:', error);
      Alert.alert('Error', 'Failed to verify paravet');
    }
  };

  const unverifyParavet = async (paravetId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.patch(`${API_URL}/paravet/admin/verify/${paravetId}`, 
        { approvalStatus: 'pending' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Paravet moved to unverified');
      fetchParavets();
    } catch (error) {
      console.error('Unverify error:', error);
      Alert.alert('Error', 'Failed to unverify paravet');
    }
  };

  const deleteParavet = async (paravetId) => {
    Alert.alert(
      'Delete Paravet',
      'Are you sure you want to permanently delete this paravet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(`${API_URL}/paravet/admin/delete/${paravetId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              setExpandedCards(prev => {
                const newState = { ...prev };
                delete newState[paravetId];
                return newState;
              });
              
              setParavets(prev => prev.filter(p => (p._id || p.id) !== paravetId));
              
              Alert.alert('Success', 'Paravet deleted successfully');
            } catch (error) {
              console.error('Delete error:', error.response?.data || error);
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete paravet');
            }
          }
        }
      ]
    );
  };

  const openDocument = (url, type) => {
    if (url) {
      if (type.includes('Photo')) {
        setDocumentModal({ visible: true, url, type });
      } else {
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
        Linking.openURL(viewerUrl).catch(() => {
          Alert.alert('Error', 'Could not open document');
        });
      }
    }
  };

  const ParavetCard = ({ paravet }) => {
    const paravetId = paravet._id || paravet.id;
    const isExpanded = expandedCards[paravetId] || false;
    
    const toggleExpand = () => {
      setExpandedCards(prev => ({
        ...prev,
        [paravetId]: !prev[paravetId]
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
            source={{ uri: paravet.documents?.profilePhoto?.url || paravet.photo || 'https://ui-avatars.com/api/?name=User&size=60&background=9B59B6&color=fff' }}
            style={styles.avatar}
          />
          <View style={styles.cardHeaderText}>
            <Text style={styles.paravetName}>{paravet.personalInfo?.fullName?.value}</Text>
            <Text style={styles.paravetCity}>{paravet.personalInfo?.city?.value}</Text>
            <Text style={styles.paravetExperience}>{paravet.experience?.yearsOfExperience?.value} years exp</Text>
          </View>
          <View style={styles.headerRight}>
            {paravet.applicationStatus?.approvalStatus === 'approved' && (
              <Ionicons name="checkmark-circle" size={24} color="#9B59B6" style={{ marginRight: 10 }} />
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
                  style={styles.unverifyButton}
                  onPress={() => unverifyParavet(paravetId)}
                >
                  <Ionicons name="close-circle" size={18} color="#FFF" />
                  <Text style={styles.unverifyButtonText}>Unverify</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteParavet(paravetId)}
                >
                  <Ionicons name="trash" size={18} color="#FFF" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'unverified' && (
              <TouchableOpacity 
                style={styles.verifyAllButton}
                onPress={() => verifyParavet(paravetId)}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.verifyAllButtonText}>Verify Paravet</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.sectionTitle}>Personal Information</Text>
            <DetailRow label="Full Name" value={paravet.personalInfo?.fullName?.value} />
            <DetailRow label="Email" value={paravet.personalInfo?.email?.value} />
            <DetailRow label="Mobile" value={paravet.personalInfo?.mobileNumber?.value} />
            <DetailRow label="City" value={paravet.personalInfo?.city?.value} />
            <DetailRow label="Service Area" value={paravet.personalInfo?.serviceArea?.value} />

            <Text style={styles.sectionTitle}>Experience & Skills</Text>
            <DetailRow label="Experience" value={`${paravet.experience?.yearsOfExperience?.value} years`} />
            <DetailRow 
              label="Expertise" 
              value={paravet.experience?.areasOfExpertise?.value?.join(', ') || 'Not specified'} 
            />
            <DetailRow 
              label="Languages" 
              value={paravet.experience?.languagesSpoken?.value?.join(', ') || 'Not specified'} 
            />

            <Text style={styles.sectionTitle}>Documents</Text>
            {paravet.documents?.governmentId?.url && (
              <DetailRow 
                label="Government ID" 
                value="View Document" 
                isDocument
                documentUrl={paravet.documents.governmentId.url}
                onPress={() => openDocument(paravet.documents.governmentId.url, 'Government ID')}
              />
            )}
            {paravet.documents?.certificationProof?.url && (
              <DetailRow 
                label="Certification Proof" 
                value="View Document" 
                isDocument
                documentUrl={paravet.documents.certificationProof.url}
                onPress={() => openDocument(paravet.documents.certificationProof.url, 'Certification')}
              />
            )}
            {paravet.documents?.profilePhoto?.url && (
              <DetailRow 
                label="Profile Photo" 
                value="View Photo" 
                isDocument
                documentUrl={paravet.documents.profilePhoto.url}
                onPress={() => openDocument(paravet.documents.profilePhoto.url, 'Profile Photo')}
              />
            )}

            <Text style={styles.sectionTitle}>Payment Information</Text>
            <DetailRow label="Account Holder" value={paravet.paymentInfo?.accountHolderName?.value} />
            <DetailRow label="PAN" value={paravet.paymentInfo?.pan?.value} />
          </View>
        )}
      </View>
    );
  };

  const DetailRow = ({ label, value, isDocument, documentUrl, onPress }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <Text style={styles.detailLabel}>{label}:</Text>
        {isDocument && documentUrl ? (
          <TouchableOpacity onPress={onPress}>
            <Text style={[styles.detailValue, { color: '#9B59B6', textDecorationLine: 'underline' }]}>{value}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.detailValue}>{value || 'Not provided'}</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paravets</Text>
        <TouchableOpacity onPress={fetchParavets}>
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
          <ActivityIndicator size="large" color="#9B59B6" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {paravets.length === 0 ? (
            <Text style={styles.emptyText}>No paravets found</Text>
          ) : (
            paravets.map(paravet => <ParavetCard key={paravet._id} paravet={paravet} />)
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#9B59B6',
    paddingTop: 50,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', elevation: 2 },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#9B59B6' },
  tabText: { fontSize: 16, color: '#666' },
  activeTabText: { color: '#9B59B6', fontWeight: 'bold' },
  content: { flex: 1, padding: 15 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  cardHeaderText: { flex: 1 },
  paravetName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  paravetCity: { fontSize: 14, color: '#666', marginTop: 2 },
  paravetExperience: { fontSize: 12, color: '#999', marginTop: 2 },
  expandedContent: { marginTop: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 10 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  detailLeft: { flex: 1 },
  detailLabel: { fontSize: 13, color: '#666', marginBottom: 4 },
  detailValue: { fontSize: 15, color: '#333', fontWeight: '500' },
  actionButtons: { flexDirection: 'row', gap: 8, marginBottom: 15 },
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
  unverifyButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
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
  deleteButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  verifyAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9B59B6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 15,
  },
  verifyAllButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#9B59B6',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  modalContent: { flex: 1, backgroundColor: '#000' },
  modalContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  documentImage: { width: '100%', height: 600 },
  noDocumentText: { color: '#FFF', fontSize: 16, textAlign: 'center' },
});
