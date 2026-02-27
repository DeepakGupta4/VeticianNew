import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ParavetsScreen() {
  const [paravets, setParavets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending' or 'verified'

  useEffect(() => {
    fetchParavets();
  }, [filter]);

  const fetchParavets = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const endpoint = filter === 'pending' 
        ? 'https://vetician-backend-kovk.onrender.com/api/paravet/admin/unverified'
        : 'https://vetician-backend-kovk.onrender.com/api/paravet/verified';
      
      const response = await axios.get(endpoint, config);
      setParavets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching paravets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.patch(
        `https://vetician-backend-kovk.onrender.com/api/paravet/admin/verify/${id}`,
        { approvalStatus: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Paravet verified successfully');
      fetchParavets();
    } catch (error) {
      console.error('Error verifying paravet:', error);
      Alert.alert('Error', 'Failed to verify paravet');
    }
  };

  const renderParavet = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="medical" size={24} color="#9B59B6" />
        <Text style={styles.name}>{item.personalInfo?.fullName?.value || item.name || 'Unknown'}</Text>
      </View>
      <Text style={styles.detail}>📧 {item.personalInfo?.email?.value || 'N/A'}</Text>
      <Text style={styles.detail}>📱 {item.personalInfo?.mobileNumber?.value || 'N/A'}</Text>
      <Text style={styles.detail}>📍 {item.personalInfo?.city?.value || item.city || 'N/A'}</Text>
      <Text style={styles.detail}>💼 {item.experience?.yearsOfExperience?.value || item.experience || '0'} years</Text>
      
      {filter === 'pending' && (
        <TouchableOpacity 
          style={styles.verifyButton}
          onPress={() => handleVerify(item._id || item.id)}
        >
          <Text style={styles.verifyButtonText}>Verify Paravet</Text>
        </TouchableOpacity>
      )}
      {filter === 'verified' && (
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paravets</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'verified' && styles.filterButtonActive]}
          onPress={() => setFilter('verified')}
        >
          <Text style={[styles.filterText, filter === 'verified' && styles.filterTextActive]}>
            Verified
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#9B59B6" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={paravets}
          renderItem={renderParavet}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No {filter} paravets found</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#9B59B6', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  filterContainer: { flexDirection: 'row', padding: 15, gap: 10 },
  filterButton: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#FFF', alignItems: 'center' },
  filterButtonActive: { backgroundColor: '#9B59B6' },
  filterText: { fontSize: 16, color: '#666' },
  filterTextActive: { color: '#FFF', fontWeight: 'bold' },
  list: { padding: 15 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#333' },
  detail: { fontSize: 14, color: '#666', marginBottom: 5 },
  verifyButton: { backgroundColor: '#9B59B6', padding: 12, borderRadius: 8, marginTop: 10 },
  verifyButtonText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  verifiedText: { color: '#4CAF50', marginLeft: 5, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 50, fontSize: 16 },
});
