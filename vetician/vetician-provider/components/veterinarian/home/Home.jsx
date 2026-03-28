import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, RefreshControl, SafeAreaView, StatusBar,
  Platform, Image, Switch
} from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import {
  HeartPulse, PawPrint, Stethoscope, Syringe,
  CalendarClock, Bell, ChevronRight, Clock,
  CheckCircle, XCircle, AlertCircle, Video, User, FileText
} from 'lucide-react-native';
import socketService from '../../../services/socket';
import notificationService from '../../../services/notificationService';
import IncomingCallScreen from '../../IncomingCallScreen';
import VideoSDKCall from '../../VideoSDKCall';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

const STATUS_CONFIG = {
  pending:   { color: '#F59E0B', bg: '#FEF3C7', icon: AlertCircle, label: 'Pending' },
  confirmed: { color: '#7CB342', bg: '#E8F5E9', icon: CheckCircle,  label: 'Confirmed' },
  completed: { color: '#6B7280', bg: '#F3F4F6', icon: CheckCircle,  label: 'Completed' },
  cancelled: { color: '#EF4444', bg: '#FEE2E2', icon: XCircle,      label: 'Cancelled' },
};

export default function Home() {
  const { user } = useSelector(state => state.auth);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [incomingCall, setIncomingCall] = useState(null);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [inVideoCall, setInVideoCall] = useState(false);
  const [roomName, setRoomName] = useState(null);

  const fetchNotificationCount = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/notifications?userType=Veterinarian`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const unread = (data.notifications || []).filter(n => !n.isRead).length;
      setNotificationCount(unread);
      await notificationService.setBadgeCount(unread);
    } catch (e) {
      console.error('Notification count error:', e.message);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAppointments(data.appointments || []);
    } catch (e) {
      console.error('Appointments fetch error:', e.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchNotificationCount();
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();

    const setupSocket = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        socketService.disconnect();
        socketService.connect(userId, 'veterinarian');
        socketService.onIncomingCall((callData) => {
          setIncomingCall(callData);
          setShowIncomingCall(true);
        });
        // Refresh badge on new appointment
        socketService.onNewAppointment(() => {
          fetchNotificationCount();
          fetchAppointments();
        });
      }
    };
    setupSocket();
    return () => socketService.disconnect();
  }, []);

  const onRefresh = () => { setRefreshing(true); fetchAppointments(); };

  // Derived stats
  const today = new Date().toDateString();
  const todayAppts = appointments.filter(a => new Date(a.date).toDateString() === today);
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const uniquePatients = [...new Set(appointments.map(a => a.userId))].length;

  // Upcoming = confirmed/pending, future dates
  const upcoming = appointments
    .filter(a => ['pending', 'confirmed'].includes(a.status) && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  // Recent = last 3 completed
  const recentPatients = appointments
    .filter(a => a.status === 'completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const handleAcceptCall = () => {
    const callRoomName = incomingCall?.roomName;
    socketService.emitCallResponse({ callId: incomingCall?.callId, roomName: callRoomName, accepted: true, userId: user?._id });
    socketService.emitJoinCall({ roomName: callRoomName, userId: 'doctor-' + user?._id });
    setTimeout(() => {
      setShowIncomingCall(false);
      setRoomName(callRoomName);
      setInVideoCall(true);
    }, 100);
  };

  const handleRejectCall = () => {
    setShowIncomingCall(false);
    socketService.emitCallResponse({ callId: incomingCall?.callId, roomName: incomingCall?.roomName, accepted: false, userId: user?._id });
    setIncomingCall(null);
  };

  if (inVideoCall && roomName) {
    return <VideoSDKCall roomName={roomName} userName={user?.name || 'Doctor'} onEndCall={() => { setInVideoCall(false); setRoomName(null); }} />;
  }

  const stats = [
    { icon: PawPrint,   label: "Today's",   value: todayAppts.length, sub: 'Appointments', color: '#7CB342', route: '/(doc_tabs)/(tabs)/appointment' },
    { icon: HeartPulse, label: 'Total',      value: uniquePatients,    sub: 'Patients',     color: '#558B2F', route: '/(doc_tabs)/(tabs)/patients' },
    { icon: AlertCircle,label: 'Pending',    value: pendingCount,      sub: 'Requests',     color: '#F59E0B', route: '/(doc_tabs)/(tabs)/appointment' },
    { icon: CheckCircle,label: 'Completed',  value: completedCount,    sub: 'Cases',        color: '#10B981', route: '/(doc_tabs)/(tabs)/appointment' },
  ];

  const quickActions = [
    { icon: Syringe,      label: 'New Treatment',   color: '#7CB342', route: '/(doc_tabs)/newtreatment' },
    { icon: CalendarClock,label: 'Schedule',        color: '#558B2F', route: '/(doc_tabs)/(tabs)/appointment' },
    { icon: Stethoscope,  label: 'Surgeries',       color: '#7CB342', route: '/(doc_tabs)/(tabs)/surgeries' },
    { icon: FileText,     label: 'Med. Records',    color: '#558B2F', route: '/(doc_tabs)/medical-records' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />
      <Animated.ScrollView
        style={[styles.scroll, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7CB342']} />}
      >
        {/* Header */}
        <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello, Dr. {user?.name?.split(' ')[0] || 'Doctor'} 👋</Text>
              <Text style={styles.headerSub}>Welcome to your dashboard</Text>
            </View>
            <TouchableOpacity style={styles.bellBtn} onPress={async () => {
              setNotificationCount(0);
              await notificationService.clearBadge();
              router.push('/(doc_tabs)/notifications');
            }}>
              <Bell size={22} color="#fff" />
              {notificationCount > 0 && (
                <View style={styles.bellBadge}><Text style={styles.bellBadgeText}>{notificationCount}</Text></View>
              )}
            </TouchableOpacity>
          </View>

          {/* Availability Toggle */}
          <View style={styles.availabilityRow}>
            <View style={styles.availabilityLeft}>
              <View style={[styles.availDot, { backgroundColor: isAvailable ? '#A5D6A7' : '#EF9A9A' }]} />
              <Text style={styles.availText}>{isAvailable ? 'Available for Appointments' : 'Currently Unavailable'}</Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.5)' }}
              thumbColor={isAvailable ? '#fff' : '#ffcdd2'}
              ios_backgroundColor="rgba(255,255,255,0.3)"
            />
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <TouchableOpacity key={i} style={styles.statCard} onPress={() => router.push(s.route)} activeOpacity={0.8}>
              <View style={[styles.statIconWrap, { backgroundColor: `${s.color}15` }]}>
                <s.icon size={22} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {quickActions.map((a, i) => (
              <TouchableOpacity
                key={i}
                style={styles.actionCard}
                onPress={() => a.route && router.push(a.route)}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: `${a.color}15` }]}>
                  <a.icon size={24} color={a.color} />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity onPress={() => router.push('/(doc_tabs)/(tabs)/appointment')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {todayAppts.length === 0 ? (
            <View style={styles.emptyCard}>
              <CalendarClock size={32} color="#ccc" />
              <Text style={styles.emptyText}>No appointments today</Text>
            </View>
          ) : (
            todayAppts.slice(0, 4).map((appt, i) => {
              const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending;
              return (
                <View key={i} style={styles.apptCard}>
                  <View style={styles.apptLeft}>
                    {appt.petPic ? (
                      <Image source={{ uri: appt.petPic }} style={styles.petImg} />
                    ) : (
                      <View style={styles.petImgPlaceholder}>
                        <PawPrint size={18} color="#7CB342" />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.apptPetName}>{appt.petName}</Text>
                      <Text style={styles.apptBreed}>{appt.petType}{appt.breed ? ` • ${appt.breed}` : ''}</Text>
                      {appt.illness && <Text style={styles.apptIllness} numberOfLines={1}>{appt.illness}</Text>}
                    </View>
                  </View>
                  <View style={styles.apptRight}>
                    <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                      <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                    </View>
                    <View style={styles.apptTypeBadge}>
                      {appt.bookingType === 'video' ? <Video size={12} color="#558B2F" /> : <User size={12} color="#558B2F" />}
                      <Text style={styles.apptTypeText}>{appt.bookingType === 'video' ? 'Video' : 'In-Clinic'}</Text>
                    </View>
                    <Text style={styles.apptTime}>
                      {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Upcoming Appointments */}
        {upcoming.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming</Text>
              <TouchableOpacity onPress={() => router.push('/(doc_tabs)/(tabs)/appointment')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {upcoming.map((appt, i) => {
              const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending;
              const apptDate = new Date(appt.date);
              return (
                <View key={i} style={styles.upcomingCard}>
                  <View style={[styles.upcomingDateBox, { backgroundColor: '#7CB34215' }]}>
                    <Text style={styles.upcomingDay}>{apptDate.getDate()}</Text>
                    <Text style={styles.upcomingMonth}>{apptDate.toLocaleString('default', { month: 'short' })}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.upcomingPet}>{appt.petName}</Text>
                    <Text style={styles.upcomingInfo}>{appt.petType}{appt.breed ? ` • ${appt.breed}` : ''}</Text>
                    <View style={styles.upcomingTimeRow}>
                      <Clock size={11} color="#999" />
                      <Text style={styles.upcomingTime}>
                        {apptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      {appt.bookingType === 'video' && <Video size={11} color="#7CB342" style={{ marginLeft: 6 }} />}
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Recent Patients */}
        {recentPatients.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Patients</Text>
              <TouchableOpacity onPress={() => router.push('/(doc_tabs)/(tabs)/patients')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              {recentPatients.map((appt, i) => (
                <View key={i} style={[styles.recentRow, i < recentPatients.length - 1 && styles.rowBorder]}>
                  {appt.petPic ? (
                    <Image source={{ uri: appt.petPic }} style={styles.recentImg} />
                  ) : (
                    <View style={styles.recentImgPlaceholder}>
                      <PawPrint size={16} color="#7CB342" />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentPetName}>{appt.petName}</Text>
                    <Text style={styles.recentInfo}>{appt.petType}{appt.breed ? ` • ${appt.breed}` : ''}</Text>
                  </View>
                  <Text style={styles.recentDate}>
                    {new Date(appt.date).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      <IncomingCallScreen
        visible={showIncomingCall}
        callerData={incomingCall?.callerData}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#7CB342' },
  scroll: { flex: 1, backgroundColor: '#F5F5F5' },

  header: { paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 12 : 12, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greeting: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  bellBtn: { padding: 4, position: 'relative' },
  bellBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#EF4444', borderRadius: 8, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  bellBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  availabilityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  availabilityLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  availDot: { width: 8, height: 8, borderRadius: 4 },
  availText: { fontSize: 13, color: '#fff', fontWeight: '600' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingTop: 16, gap: 10 },
  statCard: { width: '47%', backgroundColor: '#fff', borderRadius: 14, padding: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  statIconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
  statLabel: { fontSize: 11, color: '#999', marginTop: 2 },
  statSub: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  seeAll: { fontSize: 13, color: '#7CB342', fontWeight: '600' },

  actionsRow: { flexDirection: 'row', gap: 10 },
  actionCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  actionIconWrap: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 11, fontWeight: '600', color: '#1A1A1A', textAlign: 'center' },

  emptyCard: { backgroundColor: '#fff', borderRadius: 14, padding: 32, alignItems: 'center', elevation: 1 },
  emptyText: { fontSize: 14, color: '#999', marginTop: 10 },

  apptCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  apptLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  petImg: { width: 44, height: 44, borderRadius: 22 },
  petImgPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#7CB34215', justifyContent: 'center', alignItems: 'center' },
  apptPetName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  apptBreed: { fontSize: 12, color: '#888', marginTop: 2 },
  apptIllness: { fontSize: 11, color: '#aaa', marginTop: 2 },
  apptRight: { alignItems: 'flex-end', gap: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700' },
  apptTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  apptTypeText: { fontSize: 11, color: '#558B2F', fontWeight: '600' },
  apptTime: { fontSize: 11, color: '#999' },

  upcomingCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  upcomingDateBox: { width: 48, height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  upcomingDay: { fontSize: 20, fontWeight: '800', color: '#7CB342' },
  upcomingMonth: { fontSize: 11, color: '#7CB342', fontWeight: '600' },
  upcomingPet: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  upcomingInfo: { fontSize: 12, color: '#888', marginTop: 2 },
  upcomingTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  upcomingTime: { fontSize: 11, color: '#999' },

  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  recentRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  recentImg: { width: 40, height: 40, borderRadius: 20 },
  recentImgPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#7CB34215', justifyContent: 'center', alignItems: 'center' },
  recentPetName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  recentInfo: { fontSize: 12, color: '#888', marginTop: 2 },
  recentDate: { fontSize: 12, color: '#999' },
});
