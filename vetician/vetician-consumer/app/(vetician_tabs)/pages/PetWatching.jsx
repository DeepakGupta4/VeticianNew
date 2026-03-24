import React, { useState, useEffect } from 'react';
import {
  View, ScrollView, StyleSheet, StatusBar,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Text, Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../../constant/theme';

import AppHeader              from '../../../components/petparent/petWatching/AppHeader';
import DrawerMenu             from '../../../components/petparent/petWatching/DrawerMenu';
import BottomTabBar           from '../../../components/petparent/petWatching/BottomTabBar';
import LiveCameraCard         from '../../../components/petparent/petWatching/LiveCameraCard';
import HealthStatusCard       from '../../../components/petparent/petWatching/HealthStatusCard';
import ActivityTimeline       from '../../../components/petparent/petWatching/ActivityTimeline';
import RemoteInteractionPanel from '../../../components/petparent/petWatching/RemoteInteractionPanel';
import EmergencyAlert         from '../../../components/petparent/petWatching/EmergencyAlert';
import ChatWidget             from '../../../components/petparent/petWatching/ChatWidget';
import PetGallery             from '../../../components/petparent/petWatching/PetGallery';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: COLORS.primary },
};

export default function PetWatchingScreen() {
  const insets    = useSafeAreaInsets();
  const router    = useRouter();
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [activeTab,   setActiveTab]   = useState('watch');
  const [booking,     setBooking]     = useState(null);   // active booking from backend
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  // ── Fetch active booking from backend ──────────────────────
  useEffect(() => {
    const fetchActiveBooking = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const res   = await fetch(`${API_BASE}/cameras/bookings/active`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setBooking(data.booking || null);
      } catch (e) {
        setError('Could not load booking info');
      } finally {
        setLoading(false);
      }
    };
    fetchActiveBooking();
  }, []);

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Checking your booking...</Text>
      </View>
    );
  }

  // ── No active booking screen ───────────────────────────────
  if (!booking) {
    return (
      <PaperProvider theme={theme}>
        <View style={styles.container}>
          <StatusBar backgroundColor={COLORS.primaryGreen} barStyle="light-content" translucent />
          <View style={[styles.noBookingHeader, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.noBookingHeaderTitle}>Pet Watching</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.noBookingBody}>
            <View style={styles.noBookingIconWrap}>
              <MaterialCommunityIcons name="cctv-off" size={64} color={COLORS.primary} />
            </View>
            <Text style={styles.noBookingTitle}>No Active Stay</Text>
            <Text style={styles.noBookingDesc}>
              Pet Watching is available only when your pet is checked in at a Vetician hostel with camera access.
            </Text>

            {[
              { icon: 'home-city-outline', step: '1', text: 'Book a hostel stay' },
              { icon: 'paw',               step: '2', text: 'Resort staff checks in your pet & assigns camera' },
              { icon: 'cctv',              step: '3', text: 'Watch your pet live from here' },
            ].map(item => (
              <View key={item.step} style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNum}>{item.step}</Text>
                </View>
                <MaterialCommunityIcons name={item.icon} size={22} color={COLORS.primary} style={{ marginHorizontal: 12 }} />
                <Text style={styles.stepText}>{item.text}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.bookNowBtn}
              onPress={() => router.push('/(vetician_tabs)/pages/Hostel')}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="home-city-outline" size={20} color="#fff" />
              <Text style={styles.bookNowText}>Book Hostel Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PaperProvider>
    );
  }

  // ── Active booking - pet is checked in ────────────────────
  const pet    = booking.petId;           // populated pet object
  const camera = booking.assignedCameraId; // populated camera object or null

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primaryGreen} barStyle="light-content" translucent />

        <AppHeader
          pet={pet}
          hostelName={booking.resortName}
          onMenuPress={() => setDrawerOpen(true)}
        />

        <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        >
          <EmergencyAlert petName={pet?.name || 'Your Pet'} />

          {/* Camera - real stream if assigned, else waiting message */}
          <View style={styles.pad}>
            {camera ? (
              <LiveCameraCard
                streamUrl={camera.streamUrl}
                streamType={camera.streamType || 'hls'}
                cameraName={camera.name || 'Live Camera'}
              />
            ) : (
              <View style={styles.waitingCamera}>
                <MaterialCommunityIcons name="cctv" size={40} color={COLORS.primary} />
                <Text style={styles.waitingTitle}>Camera Not Yet Assigned</Text>
                <Text style={styles.waitingDesc}>
                  Resort staff will assign a camera when {pet?.name || 'your pet'} is checked in.
                  You'll see the live feed here automatically.
                </Text>
              </View>
            )}
          </View>

          <RemoteInteractionPanel petName={pet?.name || 'Your Pet'} />
          <HealthStatusCard />
          <ActivityTimeline />

          <View style={styles.pad}>
            <PetGallery />
          </View>

          <ChatWidget />
        </ScrollView>

        <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom }]}>
          <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F5F7FA' },
  centerScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' },
  loadingText:  { marginTop: 12, color: COLORS.primary, fontWeight: '600' },

  // No booking
  noBookingHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primaryGreen, paddingHorizontal: 16, paddingBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  noBookingHeaderTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  noBookingBody: { flex: 1, alignItems: 'center', paddingHorizontal: 28, paddingTop: 40 },
  noBookingIconWrap: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: COLORS.primaryPale,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  noBookingTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', marginBottom: 12 },
  noBookingDesc:  { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  stepRow: {
    flexDirection: 'row', alignItems: 'center', width: '100%',
    marginBottom: 16, backgroundColor: '#fff',
    borderRadius: 14, padding: 14, elevation: 1,
  },
  stepBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primaryPale,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNum:  { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  stepText: { fontSize: 14, fontWeight: '600', color: '#333', flex: 1 },
  bookNowBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 16, paddingHorizontal: 40,
    borderRadius: 16, marginTop: 12, elevation: 3,
  },
  bookNowText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  // Active watching
  scrollContent: { paddingTop: 8 },
  pad: { paddingHorizontal: 16 },
  tabBarWrapper: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
  },

  // Waiting for camera
  waitingCamera: {
    backgroundColor: '#fff', borderRadius: 20,
    padding: 28, marginTop: 16, marginBottom: 4,
    alignItems: 'center', elevation: 2,
  },
  waitingTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginTop: 12, marginBottom: 8 },
  waitingDesc:  { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 20 },
});
