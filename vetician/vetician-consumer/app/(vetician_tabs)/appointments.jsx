import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketService from '../../services/socket';

import { COLORS2 } from '../../components/petparent/Appointments/colors';

import Header               from '../../components/petparent/Appointments/Header';
import AppointmentsList     from '../../components/petparent/Appointments/AppointmentsList';
import AppointmentDetails   from '../../components/petparent/Appointments/AppointmentDetails';
import CancelConfirmDialog  from '../../components/petparent/Appointments/CancelConfirmDialog';

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

  const fetchAppointments = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      console.log('📥 Fetching all appointments for userId:', userId);
      console.log('🔑 Token exists:', !!token);

      if (!userId) {
        console.log('⚠️ No userId found in storage');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      console.log('🌐 Making parallel API calls to fetch bookings...');
      const [groomingRes, doorstepRes, clinicRes] = await Promise.all([
        fetch(`${API_URL}/grooming/bookings/user/${userId}`).then(r => r.json()).catch(e => { console.error('Grooming API error:', e); return { success: false }; }),
        fetch(`${API_URL}/doorstep`, { headers }).then(r => r.json()).catch(e => { console.error('Doorstep API error:', e); return { success: false }; }),
        fetch(`${API_URL}/appointments`, { headers }).then(r => r.json()).catch(e => { console.error('Clinic API error:', e); return { success: false }; })
      ]);

      console.log('✂️ Grooming API Response:', groomingRes);
      console.log('🐾 Doorstep API Response:', doorstepRes);
      console.log('🏥 Clinic API Response:', clinicRes);

      const allAppointments = [];

      if (groomingRes.success && groomingRes.bookings) {
        console.log('✅ Processing', groomingRes.bookings.length, 'grooming bookings');
        const formatted = groomingRes.bookings.map(booking => {
          console.log('  📋 Grooming:', booking._id, '-', booking.status);
          return {
            id: booking._id,
            service: 'Pet Grooming',
            serviceIcon: 'content-cut',
            pet: booking.petId?.name || 'Unknown Pet',
            petIcon: 'paw',
            date: new Date(booking.appointmentDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
            time: booking.appointmentTime,
            status: booking.status === 'pending' || booking.status === 'confirmed' ? 'upcoming' : booking.status,
            address: booking.serviceType === 'home' ? 'Home Service' : 'Salon Visit',
            assignedTo: booking.groomerId?.name || 'Not assigned',
            notes: booking.specialInstructions || '',
            rawData: booking
          };
        });
        allAppointments.push(...formatted);
        console.log('✅ Added', formatted.length, 'grooming appointments');
      } else {
        console.log('⚠️ No grooming bookings found');
      }

      if (doorstepRes.success && doorstepRes.data) {
        console.log('✅ Processing', doorstepRes.data.length, 'doorstep bookings');
        const formatted = doorstepRes.data.map(booking => {
          console.log('  📋 Doorstep:', booking._id, '-', booking.status);
          return {
            id: booking._id,
            service: booking.serviceType,
            serviceIcon: 'home-heart',
            pet: booking.petIds?.map(p => p.name).join(', ') || 'Unknown Pet',
            petIcon: 'paw',
            date: new Date(booking.appointmentDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
            time: booking.timeSlot,
            status: booking.status === 'pending' || booking.status === 'confirmed' ? 'upcoming' : booking.status,
            address: `${booking.address?.city || 'Home'} - Doorstep`,
            assignedTo: booking.servicePartnerName || 'Not assigned',
            notes: booking.specialInstructions || '',
            rawData: booking
          };
        });
        allAppointments.push(...formatted);
        console.log('✅ Added', formatted.length, 'doorstep appointments');
      } else {
        console.log('⚠️ No doorstep bookings found');
      }

      if (clinicRes.success && clinicRes.appointments) {
        console.log('✅ Processing', clinicRes.appointments.length, 'clinic appointments');
        const formatted = clinicRes.appointments.map(appt => {
          console.log('  📋 Clinic:', appt._id, '-', appt.status);
          return {
            id: appt._id,
            service: appt.bookingType === 'video' ? 'Video Consultation' : 'Clinic Visit',
            serviceIcon: appt.bookingType === 'video' ? 'video' : 'hospital-building',
            pet: appt.petName,
            petIcon: 'paw',
            date: new Date(appt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
            time: new Date(appt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            status: appt.status === 'pending' || appt.status === 'confirmed' ? 'upcoming' : appt.status,
            address: appt.clinicName || 'Clinic',
            assignedTo: appt.doctorName || 'Veterinarian',
            notes: appt.notes || '',
            rawData: appt
          };
        });
        allAppointments.push(...formatted);
        console.log('✅ Added', formatted.length, 'clinic appointments');
      } else {
        console.log('⚠️ No clinic appointments found');
      }

      console.log('📊 Total appointments fetched:', allAppointments.length);
      console.log('📋 Appointments summary:', allAppointments.map(a => `${a.service} - ${a.status}`));
      setAppointments(allAppointments);
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      console.error('❌ Error stack:', error.stack);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();

    const initSocket = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        socketService.connect(userId, 'petparent');
        socketService.onAppointmentStatusUpdate(() => {
          fetchAppointments();
        });
      }
    };

    initSocket();

    return () => {
      socketService.disconnect();
    };
  }, [fetchAppointments]);

  const handleCancelPress = useCallback((appointment) => {
    setCancelTarget(appointment);
    setCancelDialogVisible(true);
  }, []);

  const handleCancelConfirm = useCallback(async () => {
    if (!cancelTarget) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const appointmentId = cancelTarget.rawData?._id || cancelTarget.id;

      await fetch(`${API_URL}/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }

    setCancelDialogVisible(false);
    setCancelTarget(null);
  }, [cancelTarget, fetchAppointments]);

  const handleCancelDismiss = useCallback(() => {
    setCancelDialogVisible(false);
    setCancelTarget(null);
  }, []);

  const handleViewDetails = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setDetailsVisible(true);
  }, []);

  const handleDetailsClose = useCallback(() => {
    setDetailsVisible(false);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <SafeAreaView style={styles.safe}>
      <Header onBack={() => router.back()} />

      <View style={styles.body}>
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
              onRefresh={onRefresh}
            />
          </Animated.View>
        )}
      </View>

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
    backgroundColor: COLORS2.primary,
  },
  body: {
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
    backgroundColor: COLORS2.bg,
  },
});
