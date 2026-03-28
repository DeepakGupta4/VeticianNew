import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, SafeAreaView, StatusBar, Platform,
  TextInput, RefreshControl, Modal, Alert, ScrollView
} from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Search, X, Scissors, Plus, Edit2, Trash2, Calendar, MapPin, FileText } from 'lucide-react-native';
import api from '../../../services/api';

const SURGERY_COLORS = ['#7CB342', '#558B2F', '#F59E0B', '#10B981', '#6366F1', '#EC4899'];
const getColor = (name) => SURGERY_COLORS[name?.charCodeAt(0) % SURGERY_COLORS.length] || '#7CB342';

const formatDate = (date) =>
  new Date(date).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });

/* ─── Add/Edit Modal ─── */
const SurgeryModal = ({ visible, editMode, form, setForm, onClose, onSave, saving }) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <View style={styles.modalContainer}>
      <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.modalHeader}>
        <TouchableOpacity onPress={onClose} style={styles.modalClose}>
          <X size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>{editMode ? 'Edit Surgery' : 'Add Surgery'}</Text>
        <View style={{ width: 38 }} />
      </LinearGradient>

      <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Surgery Name *</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(t) => setForm({ ...form, name: t })}
          placeholder="e.g., Spay Surgery"
          placeholderTextColor="#bbb"
        />

        <Text style={styles.label}>Date * (DD/MM/YYYY)</Text>
        <TextInput
          style={styles.input}
          value={form.date}
          onChangeText={(t) => {
            const digits = t.replace(/\D/g, '').slice(0, 8);
            let formatted = digits;
            if (digits.length > 4) formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
            else if (digits.length > 2) formatted = digits.slice(0, 2) + '/' + digits.slice(2);
            setForm({ ...form, date: formatted });
          }}
          placeholder="e.g., 25/02/2026"
          placeholderTextColor="#bbb"
          keyboardType="numeric"
          maxLength={10}
        />

        <Text style={styles.label}>Hospital / Clinic</Text>
        <TextInput
          style={styles.input}
          value={form.hospital}
          onChangeText={(t) => setForm({ ...form, hospital: t })}
          placeholder="e.g., City Vet Clinic"
          placeholderTextColor="#bbb"
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.notes}
          onChangeText={(t) => setForm({ ...form, notes: t })}
          placeholder="Additional notes..."
          placeholderTextColor="#bbb"
          multiline
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={onSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : editMode ? 'Update Surgery' : 'Create Surgery'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  </Modal>
);

/* ─── Main Screen ─── */
export default function SurgeriesScreen() {
  const router = useRouter();
  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSurgery, setCurrentSurgery] = useState(null);
  const [form, setForm] = useState({ name: '', date: '', hospital: '', notes: '' });

  useEffect(() => { fetchSurgeries(); }, []);

  const fetchSurgeries = async () => {
    try {
      const res = await api.get('/surgeries');
      if (res.success) setSurgeries(res.surgeries || []);
    } catch {
      setSurgeries([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchSurgeries(); };

  const openCreate = () => {
    setEditMode(false);
    setCurrentSurgery(null);
    setForm({ name: '', date: '', hospital: '', notes: '' });
    setModalVisible(true);
  };

  const openEdit = (surgery) => {
    setEditMode(true);
    setCurrentSurgery(surgery);
    setForm({
      name: surgery.name,
      date: new Date(surgery.date).toISOString().split('T')[0],
      hospital: surgery.hospital || '',
      notes: surgery.notes || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.date) {
      Alert.alert('Error', 'Please fill surgery name and date');
      return;
    }
    // Convert DD/MM/YYYY → YYYY-MM-DD for backend
    let isoDate = form.date;
    if (form.date.includes('/')) {
      const [dd, mm, yyyy] = form.date.split('/');
      isoDate = `${yyyy}-${mm}-${dd}`;
    }
    const payload = { ...form, date: isoDate };
    setSaving(true);
    try {
      if (editMode) {
        await api.put(`/surgeries/${currentSurgery._id}`, payload);
        Alert.alert('Success', 'Surgery updated');
      } else {
        await api.post('/surgeries', payload);
        Alert.alert('Success', 'Surgery created');
      }
      setModalVisible(false);
      fetchSurgeries();
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to save surgery');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (surgery) => {
    Alert.alert('Delete Surgery', `Are you sure you want to delete "${surgery.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/surgeries/${surgery._id}`);
            Alert.alert('Success', 'Surgery deleted');
            fetchSurgeries();
          } catch {
            Alert.alert('Error', 'Failed to delete surgery');
          }
        },
      },
    ]);
  };

  const filtered = surgeries.filter(s => {
    const q = search.toLowerCase();
    return !q ||
      s.name?.toLowerCase().includes(q) ||
      (s.hospital || '').toLowerCase().includes(q) ||
      (s.notes || '').toLowerCase().includes(q);
  });

  const renderItem = ({ item }) => {
    const color = getColor(item.name);
    return (
      <View style={styles.card}>
        {/* Avatar */}
        <View style={[styles.avatarPlaceholder, { backgroundColor: `${color}20` }]}>
          <Scissors size={22} color={color} />
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.surgeryName}>{item.name}</Text>
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <Calendar size={11} color="#7CB342" />
              <Text style={styles.metaText}>{formatDate(item.date)}</Text>
            </View>
            {item.hospital ? (
              <>
                <Text style={styles.metaDot}>•</Text>
                <View style={styles.metaItem}>
                  <MapPin size={11} color="#7CB342" />
                  <Text style={styles.metaText} numberOfLines={1}>{item.hospital}</Text>
                </View>
              </>
            ) : null}
          </View>
          {item.notes ? (
            <View style={styles.notesRow}>
              <FileText size={11} color="#aaa" />
              <Text style={styles.notesText} numberOfLines={2}>{item.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
            <Edit2 size={16} color="#7CB342" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn}>
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />

      {/* Header */}
      <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Surgeries</Text>
            <Text style={styles.headerSub}>
              {surgeries.length} total surger{surgeries.length !== 1 ? 'ies' : 'y'}
            </Text>
          </View>
          <TouchableOpacity onPress={openCreate} style={styles.addBtn}>
            <Plus size={20} color="#7CB342" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/(doc_tabs)/(tabs)/profile')} style={styles.closeBtn}>
            <X size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={16} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, hospital or notes..."
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
          <Text style={styles.loaderText}>Loading surgeries...</Text>
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
              <Scissors size={52} color="#ddd" />
              <Text style={styles.emptyTitle}>
                {search ? 'No results found' : 'No surgeries recorded'}
              </Text>
              <Text style={styles.emptySub}>
                {search ? 'Try a different search term' : 'Tap + to add a surgery record'}
              </Text>
            </View>
          }
        />
      )}

      <SurgeryModal
        visible={modalVisible}
        editMode={editMode}
        form={form}
        setForm={setForm}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        saving={saving}
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
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  addBtn: {
    backgroundColor: '#fff', borderRadius: 20,
    width: 38, height: 38, justifyContent: 'center', alignItems: 'center',
  },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 24,
    paddingHorizontal: 14, paddingVertical: 10, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },

  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 12, color: '#7CB342', fontSize: 14 },

  listContent: { padding: 16, paddingBottom: 100 },

  card: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#fff', borderRadius: 16,
    padding: 14, marginBottom: 12,
    elevation: 2, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  avatarPlaceholder: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  cardInfo: { flex: 1 },
  surgeryName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, color: '#999' },
  metaDot: { fontSize: 11, color: '#ccc' },
  notesRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4, marginTop: 6 },
  notesText: { fontSize: 11, color: '#aaa', flex: 1 },

  cardActions: { gap: 8, marginLeft: 8, alignItems: 'center' },
  actionBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center',
  },

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
  modalScroll: { flex: 1, padding: 16 },

  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 12, padding: 14, fontSize: 14, color: '#1A1A1A', marginBottom: 14,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#7CB342', paddingVertical: 16,
    borderRadius: 14, alignItems: 'center', marginTop: 8, marginBottom: 32,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
