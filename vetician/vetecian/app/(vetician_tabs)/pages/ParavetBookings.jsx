import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../../../services/api';
import SocketService from '../../../services/socket';
import CommonHeader from '../../../components/CommonHeader';

const ParavetBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
    setupSocketListeners();
    
    return () => {
      SocketService.off('booking:new');
    };
  }, []);

  const setupSocketListeners = async () => {
    const paravetId = await AsyncStorage.getItem('userId');
    console.log('🔌 Setting up socket for paravet:', paravetId);
    
    if (paravetId) {
      console.log('📡 Connecting socket as paravet...');
      SocketService.connect(paravetId, 'paravet');
      
      // Wait a bit for connection
      setTimeout(() => {
        console.log('📊 Socket status:', {
          connected: SocketService.socket?.connected,
          id: SocketService.socket?.id
        });
      }, 1000);
      
      SocketService.on('booking:new', (data) => {
        console.log('🔔 New booking received:', data);
        Alert.alert('New Booking Request', 'You have received a new booking request!');
        fetchBookings();
      });
      
      console.log('✅ Socket listener registered for booking:new');
    } else {
      console.log('❌ No paravet ID found in storage');
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const paravetId = await AsyncStorage.getItem('userId');
      const response = await ApiService.get(`/doorstep/paravet/${paravetId}`);
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      await ApiService.put(`/doorstep/${bookingId}/status`, { status: 'accepted' });
      Alert.alert('Success', 'Booking accepted successfully!');
      fetchBookings();
    } catch (error) {
      Alert.alert('Error', 'Failed to accept booking');
    }
  };

  const handleReject = async (bookingId) => {
    Alert.alert(
      'Reject Booking',
      'Are you sure you want to reject this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.put(`/doorstep/${bookingId}/status`, { status: 'rejected' });
              Alert.alert('Success', 'Booking rejected');
              fetchBookings();
            } catch (error) {
              Alert.alert('Error', 'Failed to reject booking');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'accepted': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'completed': return '#3B82F6';
      default: return '#999';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="Booking Requests" />
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchBookings} />}
      >
        {bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="event-busy" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No booking requests</Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking._id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.serviceType}>{booking.serviceType}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                  <Text style={styles.statusText}>{booking.status}</Text>
                </View>
              </View>

              <View style={styles.bookingInfo}>
                <MaterialIcons name="person" size={16} color="#666" />
                <Text style={styles.infoText}>{booking.userId?.name || 'Pet Parent'}</Text>
              </View>

              <View style={styles.bookingInfo}>
                <MaterialIcons name="calendar-today" size={16} color="#666" />
                <Text style={styles.infoText}>
                  {new Date(booking.appointmentDate).toLocaleDateString()} • {booking.timeSlot}
                </Text>
              </View>

              <View style={styles.bookingInfo}>
                <MaterialIcons name="pets" size={16} color="#666" />
                <Text style={styles.infoText}>{booking.petIds?.length || 0} pet(s)</Text>
              </View>

              <View style={styles.bookingInfo}>
                <MaterialIcons name="attach-money" size={16} color="#666" />
                <Text style={styles.infoText}>₹{booking.totalAmount}</Text>
              </View>

              {booking.specialInstructions && (
                <View style={styles.instructionsBox}>
                  <Text style={styles.instructionsLabel}>Special Instructions:</Text>
                  <Text style={styles.instructionsText}>{booking.specialInstructions}</Text>
                </View>
              )}

              {booking.status === 'pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.acceptBtn]}
                    onPress={() => handleAccept(booking._id)}
                  >
                    <MaterialIcons name="check" size={20} color="#fff" />
                    <Text style={styles.actionBtnText}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => handleReject(booking._id)}
                  >
                    <MaterialIcons name="close" size={20} color="#fff" />
                    <Text style={styles.actionBtnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  instructionsBox: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  instructionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  acceptBtn: {
    backgroundColor: '#10B981',
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ParavetBookings;
