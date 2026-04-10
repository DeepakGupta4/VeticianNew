import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, Clock, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react-native';
import ApiService from '../../services/api';
import SocketService from '../../services/socket';

export default function ParavetBookings() {
  const { user } = useSelector(state => state.auth);
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?._id) {
      checkAuthAndFetch();
    }
  }, [user?._id]);

  const checkAuthAndFetch = async () => {
    if (!user?._id) {
      console.log('❌ No user ID found');
      return;
    }
    
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Session Expired', 'Please login again', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
      return;
    }
    
    console.log('🔌 Paravet bookings screen mounted');
    console.log('👤 User ID:', user._id);
    
    fetchBookings();
    
    console.log('🔌 Connecting socket for paravet:', user._id);
    SocketService.connect(user._id, 'paravet');
    
    SocketService.onNewBooking((booking) => {
      console.log('📥 New booking received:', booking);
      setBookings(prev => [booking, ...prev]);
      Alert.alert('New Booking!', `${booking.serviceType} from ${booking.userId.name}`);
    });
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('📥 Fetching bookings for paravet user._id:', user._id);
      console.log('📥 Full user object:', JSON.stringify(user, null, 2));
      
      // Try to get userId from AsyncStorage as well
      const storedUserId = await AsyncStorage.getItem('userId');
      console.log('💾 Stored userId from AsyncStorage:', storedUserId);
      
      const paravetId = storedUserId || user._id;
      console.log('🎯 Using paravetId:', paravetId);
      
      const [doorstepResponse, groomingResponse] = await Promise.all([
        ApiService.getParavetBookings(paravetId),
        ApiService.getParavetGroomingBookings(paravetId)
      ]);
      
      console.log('✅ Doorstep response:', JSON.stringify(doorstepResponse, null, 2));
      console.log('✅ Grooming response:', JSON.stringify(groomingResponse, null, 2));
      
      const allBookings = [];
      
      if (doorstepResponse.success && doorstepResponse.data) {
        console.log('🐾 Adding', doorstepResponse.data.length, 'doorstep bookings');
        allBookings.push(...doorstepResponse.data);
      } else {
        console.log('⚠️ No doorstep bookings or failed:', doorstepResponse);
      }
      
      if (groomingResponse.success && groomingResponse.bookings) {
        console.log('✂️ Adding', groomingResponse.bookings.length, 'grooming bookings');
        const formattedGrooming = groomingResponse.bookings.map(booking => ({
          _id: booking._id,
          serviceType: `Grooming - ${booking.serviceType}`,
          status: booking.status,
          userId: booking.userId,
          appointmentDate: booking.appointmentDate,
          timeSlot: booking.appointmentTime,
          totalAmount: booking.totalAmount,
          petIds: booking.petId ? [booking.petId] : [],
          specialInstructions: booking.specialInstructions,
          address: booking.address ? { street: booking.address } : null,
          bookingType: 'grooming'
        }));
        allBookings.push(...formattedGrooming);
      } else {
        console.log('⚠️ No grooming bookings or failed:', groomingResponse);
      }
      
      allBookings.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
      
      console.log('📊 Total bookings:', allBookings.length);
      if (allBookings.length > 0) {
        console.log('📋 First booking:', JSON.stringify(allBookings[0], null, 2));
      }
      setBookings(allBookings);
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      console.error('❌ Error stack:', error.stack);
      if (error.message.includes('Session expired')) {
        Alert.alert('Session Expired', 'Please login again', [
          { text: 'OK', onPress: () => router.replace('/login') }
        ]);
      }
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId, bookingType) => {
    try {
      if (bookingType === 'grooming') {
        await ApiService.updateGroomingBookingStatus(bookingId, 'confirmed');
      } else {
        await ApiService.updateBookingStatus(bookingId, 'confirmed');
      }
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'confirmed' } : b));
      Alert.alert('Success', 'Booking accepted');
    } catch (error) {
      console.error('❌ Accept error:', error);
      Alert.alert('Error', 'Failed to accept booking');
    }
  };

  const handleReject = async (bookingId, bookingType) => {
    Alert.alert('Reject Booking', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          try {
            if (bookingType === 'grooming') {
              await ApiService.updateGroomingBookingStatus(bookingId, 'cancelled', 'groomer');
            } else {
              await ApiService.updateBookingStatus(bookingId, 'cancelled');
            }
            setBookings(prev => prev.filter(b => b._id !== bookingId));
            Alert.alert('Success', 'Booking rejected');
          } catch (error) {
            console.error('❌ Reject error:', error);
            Alert.alert('Error', 'Failed to reject booking');
          }
        }
      }
    ]);
  };

  const renderBooking = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.serviceType}>{item.serviceType}</Text>
        <View style={[styles.badge, { backgroundColor: item.status === 'pending' ? '#FFA726' : '#4CAF50' }]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Customer</Text>
        <Text style={styles.value}>{item.userId?.name || 'Unknown'}</Text>
        {item.userId?.phone && (
          <View style={styles.row}>
            <Phone size={14} color="#666" />
            <Text style={styles.smallText}>{item.userId.phone}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Calendar size={16} color="#5856D6" />
          <Text style={styles.text}>{new Date(item.appointmentDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Clock size={16} color="#5856D6" />
          <Text style={styles.text}>{item.timeSlot}</Text>
        </View>
      </View>

      {item.address && (
        <View style={styles.section}>
          <View style={styles.row}>
            <MapPin size={16} color="#666" />
            <Text style={styles.smallText}>
              {item.address.street}, {item.address.city} - {item.address.pincode}
            </Text>
          </View>
        </View>
      )}

      {item.petIds?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Pets</Text>
          <Text style={styles.value}>{item.petIds.map(p => p.name).join(', ')}</Text>
        </View>
      )}

      {item.specialInstructions && (
        <View style={styles.section}>
          <Text style={styles.label}>Instructions</Text>
          <Text style={styles.smallText}>{item.specialInstructions}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.amount}>₹{item.totalAmount}</Text>
        {item.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item._id, item.bookingType)}>
              <XCircle size={18} color="#fff" />
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item._id, item.bookingType)}>
              <CheckCircle size={18} color="#fff" />
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.title}>My Bookings ({bookings.length})</Text>
      </View>
      {loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={item => item._id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchBookings} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No bookings yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7FC' },
  topHeader: { padding: 20, paddingTop: 60, backgroundColor: '#5856D6' },
  title: { fontSize: 24, fontWeight: '700', color: '#fff' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  serviceType: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  section: { marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  label: { fontSize: 12, color: '#666', marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  text: { fontSize: 14, color: '#1a1a1a' },
  smallText: { fontSize: 13, color: '#666', flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  amount: { fontSize: 20, fontWeight: '700', color: '#4CAF50' },
  actions: { flexDirection: 'row', gap: 8 },
  acceptBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#4CAF50', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  rejectBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F44336', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#999' }
});
