<<<<<<< HEAD
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, ChevronLeft } from 'lucide-react-native';

export default function Appointments() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <Calendar size={80} color="#EC4899" />
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.subtitle}>Your upcoming and past appointments</Text>
        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>
=======
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { COLORS2 }           from '../../components/petparent/Appointments/colors';
import { MOCK_APPOINTMENTS } from '../../components/petparent/Appointments/data';

import Header               from '../../components/petparent/Appointments/Header';
import TabSwitcher          from '../../components/petparent/Appointments/TabSwitcher';
import BookingForm          from '../../components/petparent/Appointments/BookingForm';
import AppointmentsList     from '../../components/petparent/Appointments/AppointmentsList';
import AppointmentDetails   from '../../components/petparent/Appointments/AppointmentDetails';
import BookingSuccessToast  from '../../components/petparent/Appointments/BookingSuccessToast';
import CancelConfirmDialog  from '../../components/petparent/Appointments/CancelConfirmDialog';

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

      <View style={styles.body}>
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
      </View>

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
>>>>>>> Sher
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#4E8D7C', paddingBottom: 16, paddingHorizontal: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center' },
  placeholder: { width: 40 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#2C3E50', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#7D7D7D', marginTop: 8, textAlign: 'center' },
  comingSoon: { marginTop: 16, fontSize: 14, color: '#4E8D7C', fontWeight: '600' }
=======
  safe: {
    flex:            1,
    backgroundColor: COLORS2.primary,
  },
  body: {
    flex:            1,
    backgroundColor: COLORS2.bg,
  },
  content: {
    flex: 1,
  },
>>>>>>> Sher
});
