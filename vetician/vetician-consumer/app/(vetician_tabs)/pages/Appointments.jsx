import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS2 }           from '../../../components/petparent/Appointments/colors';
import { MOCK_APPOINTMENTS } from '../../../components/petparent/Appointments/data';

import Header               from '../../../components/petparent/Appointments/Header';
import AppointmentsList     from '../../../components/petparent/Appointments/AppointmentsList';
import AppointmentDetails   from '../../../components/petparent/Appointments/AppointmentDetails';
import CancelConfirmDialog  from '../../../components/petparent/Appointments/CancelConfirmDialog';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function AppointmentsScreen() {
  const router = useRouter();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const fetchAllAppointments = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      
      console.log('📥 Fetching all appointments for userId:', userId);
      console.log('🔑 Token exists:', !!token);
      
      if (!userId) {
        console.log('⚠️ No user ID found');
        setAppointments(MOCK_APPOINTMENTS);
        setLoading(false);
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      console.log('🌐 Making parallel API calls...');
      const [groomingRes, doorstepRes, clinicRes] = await Promise.all([
        fetch(`${API_URL}/grooming/bookings/user/${userId}`).then(r => r.json()).catch(e => ({ success: false, error: e.message })),
        fetch(`${API_URL}/doorstep`, { headers }).then(r => r.json()).catch(e => ({ success: false, error: e.message })),
        fetch(`${API_URL}/appointments`, { headers }).then(r => r.json()).catch(e => ({ success: false, error: e.message }))
      ]);

      console.log('✂️ Grooming Response:', JSON.stringify(groomingRes, null, 2));
      console.log('🐾 Doorstep Response:', JSON.stringify(doorstepRes, null, 2));
      console.log('🏥 Clinic Response:', JSON.stringify(clinicRes, null, 2));

      const allAppointments = [];

      if (groomingRes.success && groomingRes.bookings) {
        console.log('✅ Processing', groomingRes.bookings.length, 'grooming bookings');
        const formatted = groomingRes.bookings.map(booking => {
          console.log('📋 Grooming booking:', booking._id, booking.status);
          return {
            id: booking._id,
            service: 'Pet Grooming',
            pet: booking.petId?.name || 'Unknown Pet',
            date: new Date(booking.appointmentDate).toLocaleDateString(),
            time: booking.appointmentTime,
            status: booking.status === 'pending' || booking.status === 'confirmed' ? 'upcoming' : booking.status,
            location: booking.serviceType === 'home' ? 'Home Service' : 'Salon Visit',
            groomer: booking.groomerId?.name || 'Not assigned',
            amount: booking.totalAmount,
            bookingType: 'grooming'
          };
        });
        allAppointments.push(...formatted);
        console.log('✅ Added', formatted.length, 'grooming appointments');
      } else {
        console.log('⚠️ No grooming bookings:', groomingRes.error || 'No data');
      }

      if (doorstepRes.success && doorstepRes.data) {
        console.log('✅ Processing', doorstepRes.data.length, 'doorstep bookings');
        const formatted = doorstepRes.data.map(booking => ({
          id: booking._id,
          service: booking.serviceType,
          pet: booking.petIds?.map(p => p.name).join(', ') || 'Unknown Pet',
          date: new Date(booking.appointmentDate).toLocaleDateString(),
          time: booking.timeSlot,
          status: booking.status === 'pending' || booking.status === 'confirmed' ? 'upcoming' : booking.status,
          location: `${booking.address?.city || 'Home'} - Doorstep Service`,
          groomer: booking.servicePartnerName || 'Not assigned',
          amount: booking.totalAmount,
          bookingType: 'doorstep'
        }));
        allAppointments.push(...formatted);
        console.log('✅ Added', formatted.length, 'doorstep appointments');
      } else {
        console.log('⚠️ No doorstep bookings:', doorstepRes.error || 'No data');
      }

      if (clinicRes.success && clinicRes.appointments) {
        console.log('✅ Processing', clinicRes.appointments.length, 'clinic appointments');
        const formatted = clinicRes.appointments.map(appt => ({
          id: appt._id,
          service: appt.bookingType === 'video' ? 'Video Consultation' : 'Clinic Visit',
          pet: appt.petName,
          date: new Date(appt.date).toLocaleDateString(),
          time: new Date(appt.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          status: appt.status === 'pending' || appt.status === 'confirmed' ? 'upcoming' : appt.status,
          location: appt.bookingType === 'video' ? 'Online' : 'Clinic',
          groomer: 'Veterinarian',
          amount: 0,
          bookingType: 'clinic'
        }));
        allAppointments.push(...formatted);
        console.log('✅ Added', formatted.length, 'clinic appointments');
      } else {
        console.log('⚠️ No clinic appointments:', clinicRes.error || 'No data');
      }

      allAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      console.log('📊 Total appointments before adding mock:', allAppointments.length);
      console.log('📋 All appointments:', JSON.stringify(allAppointments.map(a => ({ id: a.id, service: a.service, status: a.status })), null, 2));
      
      setAppointments([...allAppointments, ...MOCK_APPOINTMENTS]);
      console.log('✅ Final appointments count:', allAppointments.length + MOCK_APPOINTMENTS.length);
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      console.error('❌ Error stack:', error.stack);
      setAppointments(MOCK_APPOINTMENTS);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllAppointments();
    setRefreshing(false);
  }, []);

  const handleCancelPress = useCallback((appointment) => {
    setCancelTarget(appointment);
    setCancelDialogVisible(true);
  }, []);

  // Step 2a: User confirms cancel → update list instantly
  const handleCancelConfirm = useCallback(() => {
    if (!cancelTarget) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === cancelTarget.id ? { ...a, status: 'cancelled' } : a
      )
    );
    setCancelDialogVisible(false);
    setCancelTarget(null);
  }, [cancelTarget]);

  // Step 2b: User dismisses dialog
  const handleCancelDismiss = useCallback(() => {
    setCancelDialogVisible(false);
    setCancelTarget(null);
  }, []);

  // ── Details modal ─────────────────────────────────────────────
  const handleViewDetails = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setDetailsVisible(true);
  }, []);

  const handleDetailsClose = useCallback(() => {
    setDetailsVisible(false);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Header onBack={() => router.back()} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS2.primary} />
        </View>
      ) : (
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <AppointmentsList
            appointments={appointments}
            onViewDetails={handleViewDetails}
            onCancelPress={handleCancelPress}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </Animated.View>
      )}

      {/* ── Overlays ── */}

      <CancelConfirmDialog
        visible={cancelDialogVisible}
        serviceName={cancelTarget?.service ?? ''}
        onConfirm={handleCancelConfirm}
        onDismiss={handleCancelDismiss}
      />

      <AppointmentDetails
        visible={detailsVisible}
        appointment={selectedAppointment}
        onClose={handleDetailsClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS2.bg,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
