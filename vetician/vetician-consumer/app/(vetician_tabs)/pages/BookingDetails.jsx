import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonHeader from '../../../components/CommonHeader';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

export default function BookingDetails() {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/petparent/appointments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const foundAppointment = data.appointments.find(apt => apt._id === appointmentId);
        setAppointment(foundAppointment);
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FFA726';
      case 'completed': return '#9E9E9E';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <CommonHeader title="Booking Details" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <CommonHeader title="Booking Details" />
        <View style={styles.emptyState}>
          <MaterialIcons name="error-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Appointment not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CommonHeader title="Booking Details" />
      
      <ScrollView style={styles.content}>
        {/* Status Badge */}
        <View style={[styles.statusBanner, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusBannerText}>
            {appointment.status.toUpperCase()}
          </Text>
        </View>

        {/* Pet Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Information</Text>
          <View style={styles.card}>
            {appointment.petPic && (
              <Image source={{ uri: appointment.petPic }} style={styles.petImage} />
            )}
            <View style={styles.infoRow}>
              <MaterialIcons name="pets" size={20} color="#666" />
              <Text style={styles.infoLabel}>Pet Name:</Text>
              <Text style={styles.infoValue}>{appointment.petName}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="category" size={20} color="#666" />
              <Text style={styles.infoLabel}>Pet Type:</Text>
              <Text style={styles.infoValue}>{appointment.petType}</Text>
            </View>
            {appointment.breed && (
              <View style={styles.infoRow}>
                <MaterialIcons name="info-outline" size={20} color="#666" />
                <Text style={styles.infoLabel}>Breed:</Text>
                <Text style={styles.infoValue}>{appointment.breed}</Text>
              </View>
            )}
            {appointment.illness && (
              <View style={styles.infoRow}>
                <MaterialIcons name="medical-services" size={20} color="#666" />
                <Text style={styles.infoLabel}>Illness:</Text>
                <Text style={styles.infoValue}>{appointment.illness}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>
                {new Date(appointment.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Time:</Text>
              <Text style={styles.infoValue}>
                {new Date(appointment.date).toLocaleTimeString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="video-call" size={20} color="#666" />
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{appointment.bookingType}</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        {appointment.contactInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#666" />
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{appointment.contactInfo}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Booking ID */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Reference</Text>
          <View style={styles.card}>
            <Text style={styles.bookingId}>{appointment._id}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16
  },
  content: {
    flex: 1
  },
  statusBanner: {
    padding: 16,
    alignItems: 'center'
  },
  statusBannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  section: {
    padding: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  petImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '600',
    width: 100
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1
  },
  bookingId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace'
  }
});
