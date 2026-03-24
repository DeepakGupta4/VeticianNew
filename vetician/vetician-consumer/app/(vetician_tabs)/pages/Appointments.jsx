// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

// const APPOINTMENTS = [
//   { id: '1', pet: 'Luna', type: 'Vet Checkup', time: 'Oct 12, 10:00 AM', icon: '🩺' },
//   { id: '2', pet: 'Max', type: 'Grooming', time: 'Oct 15, 2:30 PM', icon: '✂️' },
//   { id: '3', pet: 'Cooper', type: 'Vaccination', time: 'Oct 20, 09:15 AM', icon: '💉' },
// ];

// const AppointmentPage = () => {
//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.iconContainer}>
//         <Text style={{ fontSize: 30 }}>{item.icon}</Text>
//       </View>
//       <View style={styles.info}>
//         <Text style={styles.petName}>{item.pet}</Text>
//         <Text style={styles.details}>{item.type}</Text>
//         <Text style={styles.time}>{item.time}</Text>
//       </View>
//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Edit</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Upcoming Visits</Text>
//       <FlatList
//         data={APPOINTMENTS}
//         keyExtractor={item => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FA', paddingHorizontal: 20, paddingTop: 60 },
//   header: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
//   card: {
//     backgroundColor: '#FFF',
//     borderRadius: 15,
//     padding: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     elevation: 3, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//   },
//   iconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E1F5FE', justifyContent: 'center', alignItems: 'center' },
//   info: { flex: 1, marginLeft: 15 },
//   petName: { fontSize: 18, fontWeight: 'bold' },
//   details: { color: '#666', marginVertical: 2 },
//   time: { color: '#007AFF', fontWeight: '600' },
//   button: { backgroundColor: '#F0F0F0', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
//   buttonText: { color: '#555', fontWeight: 'bold' }
// });

// export default AppointmentPage;

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

import { COLORS2 }           from '../../../components/petparent/Appointments/colors';
import { MOCK_APPOINTMENTS } from '../../../components/petparent/Appointments/data';

import Header               from '../../../components/petparent/Appointments/Header';
import TabSwitcher          from '../../../components/petparent/Appointments/TabSwitcher';
import BookingForm          from '../../../components/petparent/Appointments/BookingForm';
import AppointmentsList     from '../../../components/petparent/Appointments/AppointmentsList';
import AppointmentDetails   from '../../../components/petparent/Appointments/AppointmentDetails';
import BookingSuccessToast  from '../../../components/petparent/Appointments/BookingSuccessToast';
import CancelConfirmDialog  from '../../../components/petparent/Appointments/CancelConfirmDialog';

export default function AppointmentsScreen() {
  const router = useRouter();

  // ── Core list state ─────────────────────────────────────────
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);

  // ── Tab state ────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(0);

  // ── Details modal ────────────────────────────────────────────
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsVisible,      setDetailsVisible      ] = useState(false);

  // ── Success toast ────────────────────────────────────────────
  const [toastVisible, setToastVisible] = useState(false);
  const [toastData,    setToastData   ] = useState(null);   // { service, pet, date, time }

  // ── Cancel dialog ─────────────────────────────────────────────
  const [cancelTarget,        setCancelTarget       ] = useState(null);  // appointment | null
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);

  // ── Fade animation for tab switch ────────────────────────────
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeSwitch = useCallback((fn) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 110, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 190, useNativeDriver: true }),
    ]).start();
    fn();
  }, [fadeAnim]);

  // ── Tab change ───────────────────────────────────────────────
  const handleTabChange = useCallback((index) => {
    fadeSwitch(() => setActiveTab(index));
  }, [fadeSwitch]);

  // ── BookingForm callback ─────────────────────────────────────
  // Called after user fills form and taps Confirm.
  // 1. Prepend new appointment to list (instant, real-time)
  // 2. Show success toast
  // 3. Switch to My Appointments tab
  const handleBookingConfirmed = useCallback((newAppointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);

    setToastData({
      service: newAppointment.service,
      pet:     newAppointment.pet,
      date:    newAppointment.date,
      time:    newAppointment.time,
    });
    setToastVisible(true);

    fadeSwitch(() => setActiveTab(1));
  }, [fadeSwitch]);

  // ── Toast "View" button ──────────────────────────────────────
  const handleToastView = useCallback(() => {
    setToastVisible(false);
  }, []);

  const handleToastDismiss = useCallback(() => {
    setToastVisible(false);
  }, []);

  // ── Cancel flow ──────────────────────────────────────────────
  // Step 1: Card cancel button pressed → open dialog
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

  // ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <Header onBack={() => router.back()} />

      <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {activeTab === 0 ? (
          <BookingForm onBookingConfirmed={handleBookingConfirmed} />
        ) : (
          <AppointmentsList
            appointments={appointments}
            onViewDetails={handleViewDetails}
            onCancelPress={handleCancelPress}
          />
        )}
      </Animated.View>

      {/* ── Overlays (rendered above everything) ── */}

      <BookingSuccessToast
        visible={toastVisible}
        service={toastData?.service}
        pet={toastData?.pet}
        date={toastData?.date}
        time={toastData?.time}
        onView={handleToastView}
        onDismiss={handleToastDismiss}
      />

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
    flex:            1,
    backgroundColor: COLORS2.bg,
  },
  content: {
    flex: 1,
  },
});
