import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, SafeAreaView,
  StatusBar, Platform, TextInput, RefreshControl, Modal, ScrollView
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Search, X, PawPrint, FileText, Calendar,
  Video, Building, Stethoscope, User, ChevronDown, ChevronUp
} from 'lucide-react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
const PET_COLORS = ['#7CB342', '#558B2F', '#F59E0B', '#10B981', '#6366F1', '#EC4899'];
const getColor = (name) => PET_COLORS[name?.charCodeAt(0) % PET_COLORS.length] || '#7CB342';

const getStatusColors = (status) => {
  const map = {
    pending:   { bg: '#FEF3C7', text: '#92400E' },
    confirmed: { bg: '#D1FAE5', text: '#065F46' },
    cancelled: { bg: '#FEE2E2', text: '#991B1B' },
    completed: { bg: '#DBEAFE', text: '#1E40AF' },
  };
  return map[status] || { bg: '#F3F4F6', text: '#374151' };
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/* ─── Detail Modal ─── */
const RecordDetail = ({ record, visible, onClose }) => {
  if (!record) return null;
  const color = getColor(record.petName);
  const sc = getStatusColors(record.status);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.modalClose}>
            <Scissors size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Medical Record</Text>
          <View style={{ width: 38 }} />
        </LinearGradient>

        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
          {/* Pet Info */}
          <View style={styles.detailCard}>
            <View style={styles.petDetailHeader}>
              {record.petPic && record.petPic.startsWith('http') ? (
                <Image source={{ uri: record.petPic }} style={styles.avatarLarge} />
              ) : (
                <View style={[styles.avatarPlaceholderLarge, { backgroundColor: `${color}20` }]}>
                  <PawPrint size={32} color={color} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.petNameLarge}>{record.petName}</Text>
                <Text style={styles.petBreedLarge}>
                  {record.petType}{record.breed ? ` • ${record.breed}` : ''}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                <Text style={[styles.statusText, { color: sc.text }]}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          {/* Record Details */}
          <View style={styles.detailCard}>
            <Text style={styles.sectionTitle}>Visit Details</Text>

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                <Calendar size={18} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>{formatDate(record.date)} at {formatTime(record.date)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: '#E9D5FF' }]}>
                <Stethoscope size={18} color="#9333EA" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Diagnosis / Illness</Text>
                <Text style={styles.infoValue}>{record.illness || 'General checkup'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: record.bookingType === 'video' ? '#DBEAFE' : '#D1FAE5' }]}>
                {record.bookingType === 'video'
                  ? <Video size={18} color="#2563EB" />
                  : <Building size={18} color="#059669" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Visit Type</Text>
                <Text style={styles.infoValue}>
                  {record.bookingType === 'video' ? 'Video Consultation' : 'In-Clinic Visit'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: '#FED7AA' }]}>
                <User size={18} color="#EA580C" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Owner Contact</Text>
                <Text style={styles.infoValue}>{record.contactInfo || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

/* ─── Patient Group Card ─── */
const PatientGroup = ({ petName, petType, breed, petPic, records, onRecordPress }) => {
  const [expanded, setExpanded] = useState(false);
  const color = getColor(petName);

  return (
    <View style={styles.groupCard}>
      {/* Group Header */}
      <TouchableOpacity style={styles.groupHeader} onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        {petPic && petPic.startsWith('http') ? (
          <Image source={{ uri: petPic }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: `${color}20` }]}>
            <PawPrint size={22} color={color} />
          </View>
        )}
        <View style={styles.groupInfo}>
          <Text style={styles.petName}>{petName}</Text>
          <Text style={styles.petBreed}>{petType}{breed ? ` • ${breed}` : ''}</Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: `${color}15` }]}>
          <Text style={[styles.countText, { color }]}>{records.length}</Text>
          <Text style={[styles.countLabel, { color }]}>{records.length === 1 ? 'visit' : 'visits'}</Text>
        </View>
        {expanded
          ? <ChevronUp size={18} color="#999" style={{ marginLeft: 6 }} />
          : <ChevronDown size={18} color="#999" style={{ marginLeft: 6 }} />}
      </TouchableOpacity>

      {/* Records List */}
      {expanded && records.map((rec, i) => {
        const sc = getStatusColors(rec.status);
        return (
          <TouchableOpacity key={rec._id} style={[styles.recordRow, i === 0 && styles.recordRowFirst]} onPress={() => onRecordPress(rec)} activeOpacity={0.7}>
            <View style={styles.recordLeft}>
              <View style={[styles.recordDot, { backgroundColor: color }]} />
              <View>
                <Text style={styles.recordIllness}>{rec.illness || 'General checkup'}</Text>
                <View style={styles.recordMeta}>
                  <Calendar size={10} color="#999" />
                  <Text style={styles.recordDate}>{formatDate(rec.date)}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  {rec.bookingType === 'video'
                    ? <Video size={10} color="#7CB342" />
                    : <Building size={10} color="#7CB342" />}
                  <Text style={styles.recordDate}>{rec.bookingType === 'video' ? 'Video' : 'In-Clinic'}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
              <Text style={[styles.statusText, { color: sc.text }]}>
                {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/* ─── Main Screen ─── */
export default function MedicalRecordsScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/appointments`, {
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

  const onRefresh = () => { setRefreshing(true); fetchAppointments(); };

  // Group appointments by petName+petType
  const grouped = Object.values(
    appointments.reduce((acc, appt) => {
      const key = `${appt.petName}-${appt.petType}`;
      if (!acc[key]) {
        acc[key] = {
          key,
          petName: appt.petName,
          petType: appt.petType,
          breed: appt.breed,
          petPic: appt.petPic,
          records: [],
        };
      }
      acc[key].records.push(appt);
      return acc;
    }, {})
  );

  const filtered = grouped.filter(g => {
    const q = search.toLowerCase();
    return !q ||
      g.petName.toLowerCase().includes(q) ||
      g.petType.toLowerCase().includes(q) ||
      (g.breed || '').toLowerCase().includes(q) ||
      g.records.some(r => (r.illness || '').toLowerCase().includes(q));
  });

  const totalRecords = appointments.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />

      {/* Header */}
      <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Medical Records</Text>
            <Text style={styles.headerSub}>
              {grouped.length} patient{grouped.length !== 1 ? 's' : ''} • {totalRecords} record{totalRecords !== 1 ? 's' : ''}
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
      </LinearGradient>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#7CB342" />
          <Text style={styles.loaderText}>Loading records...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <PatientGroup
              {...item}
              onRecordPress={setSelectedRecord}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7CB342']} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <FileText size={52} color="#ddd" />
              <Text style={styles.emptyTitle}>
                {search ? 'No results found' : 'No medical records yet'}
              </Text>
              <Text style={styles.emptySub}>
                {search ? 'Try a different search term' : 'Records will appear after appointments'}
              </Text>
            </View>
          }
        />
      )}

      <RecordDetail
        record={selectedRecord}
        visible={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },

  header: {
    paddingTop: Platform.OS === 'android' ? 12 : 12,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 24,
    paddingHorizontal: 14, paddingVertical: 10, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },

  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 12, color: '#7CB342', fontSize: 14 },

  listContent: { padding: 16, paddingBottom: 100 },

  // Group Card
  groupCard: {
    backgroundColor: '#fff', borderRadius: 16,
    marginBottom: 12, overflow: 'hidden',
    elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  groupHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, gap: 12,
  },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  avatarPlaceholder: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center',
  },
  groupInfo: { flex: 1 },
  petName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  petBreed: { fontSize: 12, color: '#888', marginTop: 2 },
  countBadge: {
    alignItems: 'center', justifyContent: 'center',
    width: 44, height: 44, borderRadius: 22,
  },
  countText: { fontSize: 16, fontWeight: '800' },
  countLabel: { fontSize: 9, fontWeight: '600' },

  // Record Row
  recordRowFirst: { borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  recordRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
  },
  recordLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  recordDot: { width: 8, height: 8, borderRadius: 4 },
  recordIllness: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  recordMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  recordDate: { fontSize: 11, color: '#999' },
  metaDot: { fontSize: 11, color: '#ccc' },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontSize: 11, fontWeight: '600' },

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
});
