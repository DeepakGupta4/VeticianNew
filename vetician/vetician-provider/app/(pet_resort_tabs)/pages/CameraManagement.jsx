import React, { useState, useEffect } from 'react';
import {
  View, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
const PRIMARY  = '#55882F';
const PALE     = '#EAF4D5';
const BORDER   = '#E2EDD5';

const api = async (endpoint, method = 'GET', body = null) => {
  const token = await AsyncStorage.getItem('token');
  const res   = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : null,
  });
  return res.json();
};

export default function CameraManagementScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [resortId,    setResortId]    = useState(null);
  const [cameras,     setCameras]     = useState([]);
  const [bookings,    setBookings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [activeTab,   setActiveTab]   = useState('cameras');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form,        setForm]        = useState({ name: '', roomNumber: '', streamUrl: '', streamType: 'hls' });
  const [saving,      setSaving]      = useState(false);
  const [checkInBooking,  setCheckInBooking]  = useState(null);
  const [selectedCamera,  setSelectedCamera]  = useState(null);

  const loadData = async () => {
    try {
      const userId  = await AsyncStorage.getItem('userId');
      const profile = await api(`/resorts/profile/${userId}`);
      const rId     = profile?.data?._id;
      if (!rId) return;
      setResortId(rId);
      const [camRes, bookRes] = await Promise.all([
        api(`/cameras/resort/${rId}`),
        api(`/cameras/bookings/resort/${rId}`),
      ]);
      setCameras(camRes.cameras   || []);
      setBookings(bookRes.bookings || []);
    } catch {
      Alert.alert('Error', 'Could not load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddCamera = async () => {
    if (!form.name || !form.streamUrl) {
      Alert.alert('Required', 'Camera name and stream URL are required');
      return;
    }
    setSaving(true);
    const res = await api('/cameras', 'POST', { ...form, resortId });
    setSaving(false);
    if (res.success) {
      setCameras(prev => [res.camera, ...prev]);
      setForm({ name: '', roomNumber: '', streamUrl: '', streamType: 'hls' });
      setShowAddForm(false);
    } else {
      Alert.alert('Error', res.message || 'Failed to add camera');
    }
  };

  const handleDeleteCamera = (cameraId) => {
    Alert.alert('Remove Camera', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          await api(`/cameras/${cameraId}`, 'DELETE');
          setCameras(prev => prev.filter(c => c._id !== cameraId));
        },
      },
    ]);
  };

  const handleCheckIn = async () => {
    if (!checkInBooking) return;
    const res = await api(`/cameras/bookings/${checkInBooking._id}/checkin`, 'PATCH', {
      cameraId: selectedCamera,
    });
    if (res.success) {
      setBookings(prev => prev.map(b => b._id === checkInBooking._id ? res.booking : b));
      setCheckInBooking(null);
      setSelectedCamera(null);
      Alert.alert('✅ Checked In', 'Pet checked in! Camera access granted to owner.');
    } else {
      Alert.alert('Error', res.message || 'Check-in failed');
    }
  };

  const handleCheckOut = (bookingId) => {
    Alert.alert('Check Out', 'Check out this pet? Camera access will be revoked.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Check Out', style: 'destructive',
        onPress: async () => {
          await api(`/cameras/bookings/${bookingId}/checkout`, 'PATCH');
          setBookings(prev => prev.map(b =>
            b._id === bookingId ? { ...b, status: 'checked_out', cameraAccessGranted: false } : b
          ));
        },
      },
    ]);
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={PRIMARY} /></View>;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Camera Management</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {['cameras', 'bookings'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'cameras' ? `📷 Cameras (${cameras.length})` : `📋 Bookings (${bookings.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />}
      >

        {/* ── CAMERAS TAB ── */}
        {activeTab === 'cameras' && (
          <>
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddForm(v => !v)}>
              <Ionicons name={showAddForm ? 'close' : 'add-circle-outline'} size={20} color="#fff" />
              <Text style={styles.addBtnText}>{showAddForm ? 'Cancel' : 'Add New Camera'}</Text>
            </TouchableOpacity>

            {showAddForm && (
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>New Camera</Text>
                {[
                  { key: 'name',       label: 'Camera Name *',     placeholder: 'e.g. Room 1 Camera' },
                  { key: 'roomNumber', label: 'Room / Area',        placeholder: 'e.g. Room 1, Play Area' },
                  { key: 'streamUrl',  label: 'Stream URL (HLS) *', placeholder: 'https://your-server/live/room1/index.m3u8' },
                ].map(field => (
                  <View key={field.key} style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{field.label}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={field.placeholder}
                      placeholderTextColor="#aaa"
                      value={form[field.key]}
                      onChangeText={v => setForm(f => ({ ...f, [field.key]: v }))}
                      autoCapitalize="none"
                    />
                  </View>
                ))}

                <Text style={styles.inputLabel}>Stream Type</Text>
                <View style={styles.typeRow}>
                  {['hls', 'mjpeg', 'demo'].map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.typeChip, form.streamType === t && styles.typeChipActive]}
                      onPress={() => setForm(f => ({ ...f, streamType: t }))}
                    >
                      <Text style={[styles.typeChipText, form.streamType === t && styles.typeChipTextActive]}>
                        {t.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleAddCamera} disabled={saving}>
                  {saving
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.saveBtnText}>Save Camera</Text>
                  }
                </TouchableOpacity>
              </View>
            )}

            {cameras.length === 0 ? (
              <View style={styles.emptyBox}>
                <MaterialCommunityIcons name="cctv-off" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No cameras added yet</Text>
                <Text style={styles.emptySubText}>
                  Add your resort cameras to enable pet watching for guests
                </Text>
              </View>
            ) : (
              cameras.map(cam => (
                <View key={cam._id} style={styles.cameraCard}>
                  <MaterialCommunityIcons name="cctv" size={28} color={PRIMARY} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.cameraName}>{cam.name}</Text>
                    {cam.roomNumber && <Text style={styles.cameraRoom}>📍 {cam.roomNumber}</Text>}
                    <Text style={styles.cameraUrl} numberOfLines={1}>{cam.streamUrl}</Text>
                    <View style={styles.cameraTypeBadge}>
                      <Text style={styles.cameraTypeText}>{cam.streamType?.toUpperCase()}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteCamera(cam._id)} style={styles.deleteBtn}>
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#FF5252" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}

        {/* ── BOOKINGS TAB ── */}
        {activeTab === 'bookings' && (
          <>
            {bookings.length === 0 ? (
              <View style={styles.emptyBox}>
                <MaterialCommunityIcons name="calendar-blank-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No bookings yet</Text>
              </View>
            ) : (
              bookings.map(b => (
                <View key={b._id} style={styles.bookingCard}>
                  <View style={styles.bookingTop}>
                    <MaterialCommunityIcons name="paw" size={22} color={PRIMARY} />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text style={styles.bookingPetName}>{b.petId?.name || 'Pet'}</Text>
                      <Text style={styles.bookingBreed}>{b.petId?.breed || b.petId?.species}</Text>
                      <Text style={styles.bookingOwner}>
                        Owner: {b.userId?.name || '—'} · {b.userId?.phone || ''}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusPill,
                      b.status === 'checked_in'  && styles.statusPillGreen,
                      b.status === 'checked_out' && styles.statusPillGrey,
                    ]}>
                      <Text style={styles.statusPillText}>
                        {b.status.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bookingMeta}>
                    <Text style={styles.bookingMetaText}>🏠 {b.roomType}</Text>
                    <Text style={styles.bookingMetaText}>📅 {b.checkinDate} → {b.checkoutDate}</Text>
                    {b.assignedCameraId && (
                      <Text style={styles.bookingMetaText}>📷 {b.assignedCameraId.name}</Text>
                    )}
                  </View>

                  {b.status === 'confirmed' && (
                    <TouchableOpacity
                      style={styles.checkInBtn}
                      onPress={() => { setCheckInBooking(b); setSelectedCamera(null); }}
                    >
                      <MaterialCommunityIcons name="login" size={18} color="#fff" />
                      <Text style={styles.actionBtnText}>Check In & Assign Camera</Text>
                    </TouchableOpacity>
                  )}

                  {b.status === 'checked_in' && (
                    <TouchableOpacity
                      style={styles.checkOutBtn}
                      onPress={() => handleCheckOut(b._id)}
                    >
                      <MaterialCommunityIcons name="logout" size={18} color="#fff" />
                      <Text style={styles.actionBtnText}>Check Out</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* ── Check-in Modal ── */}
      {checkInBooking && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              Assign Camera for {checkInBooking.petId?.name}
            </Text>
            <Text style={styles.modalSub}>Select which camera will monitor this pet:</Text>

            {cameras.length === 0 ? (
              <Text style={styles.noCameraText}>No cameras available. Add cameras first.</Text>
            ) : (
              cameras.map(cam => (
                <TouchableOpacity
                  key={cam._id}
                  style={[styles.cameraOption, selectedCamera === cam._id && styles.cameraOptionSelected]}
                  onPress={() => setSelectedCamera(cam._id)}
                >
                  <MaterialCommunityIcons name="cctv" size={20}
                    color={selectedCamera === cam._id ? '#fff' : PRIMARY} />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={[styles.cameraOptionName, selectedCamera === cam._id && { color: '#fff' }]}>
                      {cam.name}
                    </Text>
                    {cam.roomNumber && (
                      <Text style={[styles.cameraOptionRoom, selectedCamera === cam._id && { color: 'rgba(255,255,255,0.8)' }]}>
                        {cam.roomNumber}
                      </Text>
                    )}
                  </View>
                  {selectedCamera === cam._id && (
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))
            )}

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setCheckInBooking(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmBtn, !selectedCamera && { opacity: 0.5 }]}
                onPress={handleCheckIn}
                disabled={!selectedCamera}
              >
                <Text style={styles.modalConfirmText}>Confirm Check-In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: PRIMARY, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },

  tabRow: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: BORDER },
  tab:    { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive:     { borderBottomWidth: 3, borderBottomColor: PRIMARY },
  tabText:       { fontSize: 13, fontWeight: '600', color: '#999' },
  tabTextActive: { color: PRIMARY, fontWeight: '800' },

  scroll: { padding: 16, paddingBottom: 40 },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: PRIMARY, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 20,
    marginBottom: 16, elevation: 2,
  },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  formCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, marginBottom: 16, elevation: 2,
  },
  formTitle:  { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 14 },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 6 },
  input: {
    backgroundColor: '#F5F7FA', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, color: '#1a1a1a',
    borderWidth: 1, borderColor: BORDER,
  },
  typeRow:            { flexDirection: 'row', gap: 10, marginBottom: 16, marginTop: 4 },
  typeChip:           { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: BORDER },
  typeChipActive:     { backgroundColor: PRIMARY, borderColor: PRIMARY },
  typeChipText:       { fontSize: 12, fontWeight: '700', color: '#555' },
  typeChipTextActive: { color: '#fff' },
  saveBtn:     { backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  emptyBox:    { alignItems: 'center', paddingVertical: 40 },
  emptyText:   { fontSize: 16, fontWeight: '700', color: '#999', marginTop: 12 },
  emptySubText:{ fontSize: 13, color: '#bbb', textAlign: 'center', marginTop: 6, lineHeight: 20 },

  cameraCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 14, marginBottom: 12,
    flexDirection: 'row', alignItems: 'flex-start', elevation: 1,
  },
  cameraName:      { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  cameraRoom:      { fontSize: 12, color: '#666', marginTop: 2 },
  cameraUrl:       { fontSize: 11, color: '#aaa', marginTop: 2 },
  cameraTypeBadge: { backgroundColor: PALE, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 4 },
  cameraTypeText:  { fontSize: 10, fontWeight: '700', color: PRIMARY },
  deleteBtn:       { padding: 8 },

  bookingCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 14, marginBottom: 12, elevation: 1,
  },
  bookingTop:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  bookingPetName: { fontSize: 15, fontWeight: '800', color: '#1a1a1a' },
  bookingBreed:   { fontSize: 12, color: '#666', marginTop: 1 },
  bookingOwner:   { fontSize: 12, color: '#888', marginTop: 2 },
  bookingMeta:    { gap: 4, marginBottom: 12 },
  bookingMetaText:{ fontSize: 13, color: '#555' },

  statusPill:      { backgroundColor: '#FFF3E0', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  statusPillGreen: { backgroundColor: '#E8F5E9' },
  statusPillGrey:  { backgroundColor: '#F5F5F5' },
  statusPillText:  { fontSize: 10, fontWeight: '800', color: '#555' },

  checkInBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: PRIMARY, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 16,
  },
  checkOutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FF5252', borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 16,
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
  },
  modalTitle:   { fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  modalSub:     { fontSize: 13, color: '#666', marginBottom: 16 },
  noCameraText: { color: '#999', textAlign: 'center', marginVertical: 20 },
  cameraOption: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: PALE, borderRadius: 12,
    padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: BORDER,
  },
  cameraOptionSelected: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  cameraOptionName:     { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  cameraOptionRoom:     { fontSize: 12, color: '#666', marginTop: 2 },
  modalBtns:        { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalCancelBtn:   { flex: 1, borderWidth: 1.5, borderColor: BORDER, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  modalCancelText:  { fontWeight: '700', color: '#555' },
  modalConfirmBtn:  { flex: 2, backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  modalConfirmText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
