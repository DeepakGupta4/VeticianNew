import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

export default function PetResortsScreen() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unverified');
  const [resorts, setResorts] = useState([]);

  useEffect(() => {
    fetchResorts();
  }, [activeTab]);

  const fetchResorts = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const endpoint = activeTab === 'verified' ? '/auth/admin/verified/petresort' : '/auth/admin/unverified/petresort';
      const response = await axios.post(`${API_URL}${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResorts(response.data.petResorts || []);
    } catch (error) {
      console.error('Error fetching resorts:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyResort = async (resortId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/auth/admin/petresort/verify/${resortId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Pet resort verified successfully');
      fetchResorts();
    } catch (error) {
      Alert.alert('Error', 'Failed to verify resort');
    }
  };

  const unverifyResort = async (resortId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/auth/admin/petresort/unverify/${resortId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Pet resort unverified successfully');
      fetchResorts();
    } catch (error) {
      Alert.alert('Error', 'Failed to unverify resort');
    }
  };

  const formatOpeningHours = (hours) => {
    if (!hours || typeof hours !== 'object') return hours || 'Not specified';
    
    const days = Object.keys(hours);
    if (days.length === 0) return 'Not specified';
    
    return days.map(day => {
      const timing = hours[day];
      return `${day.toUpperCase()}: ${timing.start} - ${timing.end}`;
    }).join(', ');
  };

  const ResortCard = ({ resort }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: resort.logo || 'https://via.placeholder.com/60' }}
          style={styles.logo}
        />
        <View style={styles.cardHeaderText}>
          <Text style={styles.resortName}>{resort.resortName}</Text>
          <Text style={styles.brandName}>{resort.brandName}</Text>
        </View>
        {resort.isVerified && (
          <Ionicons name="checkmark-circle" size={24} color="#4E8D7C" />
        )}
      </View>

      <View style={styles.cardDetails}>
        <DetailRow icon="location" label="Address" value={resort.address} />
        <DetailRow icon="call" label="Resort Phone" value={resort.resortPhone} />
        <DetailRow icon="person" label="Owner Phone" value={resort.ownerPhone} />
      </View>

      {resort.services && resort.services.length > 0 && (
        <View style={styles.servicesSection}>
          <Text style={styles.servicesTitle}>Services:</Text>
          <View style={styles.servicesList}>
            {resort.services.map((service, index) => (
              <View key={index} style={styles.serviceTag}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {resort.openingHours && (
        <View style={styles.hoursSection}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.hoursText}>{formatOpeningHours(resort.openingHours)}</Text>
        </View>
      )}

      {resort.notice && (
        <View style={styles.noticeSection}>
          <Ionicons name="information-circle-outline" size={16} color="#FF6B6B" />
          <Text style={styles.noticeText}>{resort.notice}</Text>
        </View>
      )}

      <View style={styles.cardActions}>
        {!resort.isVerified ? (
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() => verifyResort(resort._id)}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
            <Text style={styles.verifyButtonText}>Verify Resort</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.unverifyButton}
            onPress={() => unverifyResort(resort._id)}
          >
            <Ionicons name="close-circle-outline" size={20} color="#FFF" />
            <Text style={styles.unverifyButtonText}>Unverify Resort</Text>
          </TouchableOpacity>
        )}
      </View>
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
        <Text style={styles.headerTitle}>Pet Resorts</Text>
        <TouchableOpacity onPress={fetchResorts}>
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
          {resorts.length === 0 ? (
            <Text style={styles.emptyText}>No pet resorts found</Text>
          ) : (
            resorts.map(resort => <ResortCard key={resort._id} resort={resort} />)
          )}
        </ScrollView>
      )}
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
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  cardHeaderText: {
    flex: 1,
  },
  resortName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  brandName: {
    fontSize: 14,
    color: '#666',
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
  servicesSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    backgroundColor: '#E8F5F3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 12,
    color: '#4E8D7C',
  },
  hoursSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  hoursText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  noticeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFF5F5',
    padding: 10,
    borderRadius: 8,
  },
  noticeText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginLeft: 8,
    flex: 1,
  },
  cardActions: {
    marginTop: 15,
  },
  verifyButton: {
    backgroundColor: '#4E8D7C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  verifyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  unverifyButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  unverifyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
