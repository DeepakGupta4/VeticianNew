import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const GroomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userData);
      
      const response = await fetch(`${API_URL}/grooming/bookings/groomer/${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await fetch(`${API_URL}/grooming/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#558B2F" style={{ marginTop: 50 }} />;

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Icon name="paw" size={20} color="#558B2F" />
            <Text style={styles.petName}>{item.petId?.name}</Text>
            <Text style={[styles.status, { backgroundColor: item.status === 'pending' ? '#FFA726' : '#66BB6A' }]}>
              {item.status}
            </Text>
          </View>
          <Text style={styles.date}>{new Date(item.appointmentDate).toLocaleDateString()} · {item.appointmentTime}</Text>
          <Text style={styles.service}>{item.serviceType === 'home' ? 'Home Service' : 'Salon Visit'}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.btn} onPress={() => updateStatus(item._id, 'confirmed')}>
              <Text style={styles.btnText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnComplete]} onPress={() => updateStatus(item._id, 'completed')}>
              <Text style={styles.btnText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No bookings yet</Text>}
    />
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, marginBottom: 12, borderRadius: 12, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  petName: { fontSize: 16, fontWeight: '700', marginLeft: 8, flex: 1 },
  status: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, color: '#fff', fontSize: 11, fontWeight: '600' },
  date: { fontSize: 13, color: '#666', marginBottom: 4 },
  service: { fontSize: 12, color: '#888' },
  actions: { flexDirection: 'row', marginTop: 12, gap: 8 },
  btn: { flex: 1, backgroundColor: '#558B2F', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnComplete: { backgroundColor: '#7CB342' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 14 }
});

export default GroomingBookings;
