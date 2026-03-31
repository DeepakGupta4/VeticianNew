import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, SafeAreaView,
  StatusBar, Platform, TextInput, RefreshControl, Modal, Alert, ScrollView
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Calendar, Clock, Video, MapPin, Phone, Stethoscope,
  Search, X, PawPrint, Building
} from 'lucide-react-native';
import socketService from '../../../services/socket';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

const PET_COLORS = ['#7CB342', '#558B2F', '#F59E0B', '#10B981', '#6366F1', '#EC4899'];

const getColor = (name) => PET_COLORS[name?.charCodeAt(0) % PET_COLORS.length] || '#7CB342';

const getStatusColors = (status) => {
  const map = {
    pending:   { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
    confirmed: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
    cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
    completed: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  };
  return map[status] || { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/* ─── Detail Modal ─── */
const AppointmentDetail = ({ appointment, visible, onClose, onStatusUpdate }) => {
  if (!appointment) return null;
  const sc = getStatusColors(appointment.status);
  const color = getColor(appointment.petName);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Modal Header */}
        <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.modalClose}>
            <X size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Appointment Details</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
          {/* Pet Card */}
          <View style={styles.detailCard}>
            <View style={styles.petDetailHeader}>
              {appointment.petPic && appointment.petPic.startsWith('http') ? (
                <Image source={{ uri: appointment.petPic }} style={styles.avatarLarge} />
              ) : (
                <View style={[styles.avatarPlaceholderLarge, { backgroundColor: `${color}20` }]}>
                  <PawPrint size={32} color={color} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.petNameLarge}>{appointment.petName}</Text>
                <Text style={styles.petBreedLarge}>
                  {appointment.petType}{appointment.breed ? ` • ${appointment.breed}` : ''}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: sc.bg, borderColor: sc.border }]}>
                <Text style={[styles.statusText, { color: sc.text }]}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.detailCard}>
            <Text style={styles.sectionTitle}>Appointment Information</Text>

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                <Calendar size={18} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>{formatDate(appointment.date)} at {formatTime(appointment.date)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: '#E9D5FF' }]}>
                <Stethoscope size={18} color="#9333EA" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Reason for Visit</Text>
                <Text style={styles.infoValue}>{appointment.illness || 'General checkup'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: appointment.bookingType === 'video' ? '#DBEAFE' : '#D1FAE5' }]}>
                {appointment.bookingType === 'video'
                  ? <Video size={18} color="#2563EB" />
                  : <MapPin size={18} color="#059669" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Appointment Type</Text>
                <Text style={styles.infoValue}>
                  {appointment.bookingType === 'video' ? 'Video Consultation' : 'In-Clinic Visit'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: '#FED7AA' }]}>
                <Phone size={18} color="#EA580C" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Contact</Text>
                <Text style={styles.infoValue}>{appointment.contactInfo}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {appointment.status === 'pending' && (
              <>
                <TouchableOpacity style={styles.rejectButton} onPress={() => onStatusUpdate(appointment._id, 'cancelled')}>
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={() => onStatusUpdate(appointment._id, 'confirmed')}>
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </>
            )}
            {appointment.status === 'confirmed' && (
              <TouchableOpacity style={styles.completeButton} onPress={() => onStatusUpdate(appointment._id, 'completed')}>
                <Text style={styles.completeButtonText}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

/* ─── Main Screen ─── */
export default function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchAppointments();
    const init = async () => {
      const userId = await AsyncStorage.getItem('userId');
      socketService.connect(userId, 'veterinarian');
      socketService.onNewAppointment((data) => {
        Alert.alert('New Appointment! 🔔', data.message, [{ text: 'View', onPress: fetchAppointments }]);
        fetchAppointments();
      });
    };
    init();
    return () => socketService.disconnect();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/veterinarian/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAppointments(data.appointments || []);
    } catch (e) {
      console.error('Fetch error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/appointment/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (res.ok) {
        Alert.alert('Success', `Appointment ${newStatus} successfully`);
        setSelected(null);
        fetchAppointments();
      } else {
        Alert.alert('Error', result.message || 'Failed to update');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update appointment');
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchAppointments(); };

  const FILTERS = ['all', 'pending', 'confirmed', 'completed'];

  const filtered = appointments.filter(a => {
    const matchFilter = activeFilter === 'all' || a.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      a.petName?.toLowerCase().includes(q) ||
      a.petType?.toLowerCase().includes(q) ||
      (a.breed || '').toLowerCase().includes(q) ||
      (a.illness || '').toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  const renderItem = ({ item }) => {
    const color = getColor(item.petName);
    const sc = getStatusColors(item.status);
    return (
      <TouchableOpacity style={styles.card} onPress={() => setSelected(item)} activeOpacity={0.7}>
        {/* Avatar */}
        {item.petPic && item.petPic.startsWith('http') ? (
          <Image source={{ uri: item.petPic }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: `${color}20` }]}>
            <PawPrint size={22} color={color} />
          </View>
        )}

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.petName}>{item.petName}</Text>
          <Text style={styles.petBreed}>
            {item.petType}{item.breed ? ` • ${item.breed}` : ''}
          </Text>
          {item.illness ? (
            <Text style={styles.illness} numberOfLines={1}>{item.illness}</Text>
          ) : null}
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              {item.bookingType === 'video'
                ? <Video size={11} color="#7CB342" />
                : <Building size={11} color="#7CB342" />}
              <Text style={styles.metaText}>
                {item.bookingType === 'video' ? 'Video' : 'In-Clinic'}
              </Text>
            </View>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{formatDate(item.date)}</Text>
          </View>
        </View>

        {/* Right */}
        <View style={styles.cardRight}>
          <View style={[styles.statusBadge, { backgroundColor: sc.bg, borderColor: sc.border }]}>
            <Text style={[styles.statusText, { color: sc.text }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          <Text style={styles.timeText}>{formatTime(item.date)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />

      {/* Header */}
      <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Appointments</Text>
            <Text style={styles.headerSub}>
              {appointments.length} total appointment{appointments.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.replace('/(doc_tabs)/(tabs)/profile')} style={styles.closeBtn}>
            <X size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={16} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, type or illness..."
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
            >
              <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#7CB342" />
          <Text style={styles.loaderText}>Loading appointments...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7CB342']} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Calendar size={52} color="#ddd" />
              <Text style={styles.emptyTitle}>
                {search ? 'No results found' : 'No appointments yet'}
              </Text>
              <Text style={styles.emptySub}>
                {search ? 'Try a different search term' : 'Appointments will appear here'}
              </Text>
            </View>
          }
        />
      )}

      <AppointmentDetail
        appointment={selected}
        visible={!!selected}
        onClose={() => setSelected(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },

  header: {
    paddingTop: Platform.OS === 'android' ? 12 : 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  closeBtn: { padding: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  bellWrap: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: '#EF4444', borderRadius: 10,
    minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 24,
    paddingHorizontal: 14, paddingVertical: 10, gap: 8, marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },

  filterScroll: { flexGrow: 0 },
  filterTab: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', marginRight: 8,
  },
  filterTabActive: { backgroundColor: '#fff' },
  filterTabText: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.9)' },
  filterTabTextActive: { color: '#558B2F', fontWeight: '700' },

  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  loaderText: { marginTop: 12, color: '#7CB342', fontSize: 14 },

  listContent: { padding: 16, paddingBottom: 100 },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 16,
    padding: 14, marginBottom: 12,
    elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  avatarPlaceholder: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  cardInfo: { flex: 1 },
  petName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  petBreed: { fontSize: 12, color: '#888', marginTop: 2 },
  illness: { fontSize: 11, color: '#aaa', marginTop: 2 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, color: '#999' },
  metaDot: { fontSize: 11, color: '#ccc' },

  cardRight: { alignItems: 'flex-end', marginLeft: 10, gap: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: '600' },
  timeText: { fontSize: 11, color: '#999' },

  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginTop: 16 },
  emptySub: { fontSize: 13, color: '#999', marginTop: 6, textAlign: 'center', paddingHorizontal: 32 },

  // Modal
  modalContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 16 : 56,
    paddingBottom: 16, paddingHorizontal: 16,
  },
  modalClose: { padding: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalScroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  detailCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, marginBottom: 14,
    elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  petDetailHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarLarge: { width: 64, height: 64, borderRadius: 32 },
  avatarPlaceholderLarge: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center',
  },
  petNameLarge: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  petBreedLarge: { fontSize: 13, color: '#888', marginTop: 2 },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 14 },
  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  iconBox: { padding: 10, borderRadius: 12, alignSelf: 'flex-start' },
  infoLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },

  actionButtons: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  rejectButton: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 2, borderColor: '#EF4444', alignItems: 'center',
  },
  rejectButtonText: { fontSize: 15, fontWeight: '700', color: '#DC2626' },
  confirmButton: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: '#7CB342', alignItems: 'center',
  },
  confirmButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  completeButton: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: '#7CB342', alignItems: 'center',
  },
  completeButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
