import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const AdminGroomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/grooming/bookings/all`);
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

  if (loading) return <ActivityIndicator size="large" color="#558B2F" style={{ marginTop: 50 }} />;

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.row}>
              <Icon name="paw" size={18} color="#558B2F" />
              <Text style={styles.petName}>{item.petId?.name} ({item.petId?.breed})</Text>
            </View>
            <Text style={[styles.badge, { backgroundColor: item.status === 'pending' ? '#FFA726' : item.status === 'completed' ? '#66BB6A' : '#42A5F5' }]}>
              {item.status}
            </Text>
          </View>
          <Text style={styles.user}>Owner: {item.userId?.name}</Text>
          <Text style={styles.date}>{new Date(item.appointmentDate).toLocaleDateString()} at {item.appointmentTime}</Text>
          <Text style={styles.type}>{item.serviceType === 'home' ? '🏠 Home Service' : '🏢 Salon Visit'}</Text>
          {item.groomerId && <Text style={styles.groomer}>Groomer: {item.groomerId.name}</Text>}
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No bookings found</Text>}
    />
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, marginBottom: 12, borderRadius: 12, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  petName: { fontSize: 15, fontWeight: '700', marginLeft: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, color: '#fff', fontSize: 11, fontWeight: '600' },
  user: { fontSize: 13, color: '#333', marginBottom: 4 },
  date: { fontSize: 13, color: '#666', marginBottom: 4 },
  type: { fontSize: 12, color: '#888', marginBottom: 4 },
  groomer: { fontSize: 12, color: '#558B2F', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 14 }
});

export default AdminGroomingBookings;
