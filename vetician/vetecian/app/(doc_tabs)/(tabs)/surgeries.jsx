import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  RefreshControl
} from 'react-native';
import { ArrowLeft, Plus, Edit2, Trash2, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';

export default function SurgeriesScreen() {
  const router = useRouter();
  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSurgery, setCurrentSurgery] = useState(null);
  const [form, setForm] = useState({
    name: '',
    date: '',
    hospital: '',
    notes: ''
  });

  useEffect(() => {
    fetchSurgeries();
  }, []);

  const fetchSurgeries = async () => {
    try {
      const response = await api.get('/surgeries');
      if (response.success) {
        setSurgeries(response.surgeries || []);
      }
    } catch (error) {
      setSurgeries([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSurgeries();
  };

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentSurgery(null);
    setForm({ name: '', date: '', hospital: '', notes: '' });
    setModalVisible(true);
  };

  const openEditModal = (surgery) => {
    setEditMode(true);
    setCurrentSurgery(surgery);
    setForm({
      name: surgery.name,
      date: new Date(surgery.date).toISOString().split('T')[0],
      hospital: surgery.hospital || '',
      notes: surgery.notes || ''
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.date) {
      Alert.alert('Error', 'Please fill surgery name and date');
      return;
    }

    setSaving(true);
    try {
      if (editMode) {
        await api.put(`/surgeries/${currentSurgery._id}`, form);
        Alert.alert('Success', 'Surgery updated');
      } else {
        await api.post('/surgeries', form);
        Alert.alert('Success', 'Surgery created');
      }
      setModalVisible(false);
      fetchSurgeries();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save surgery');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (surgery) => {
    Alert.alert(
      'Delete Surgery',
      `Are you sure you want to delete "${surgery.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/surgeries/${surgery._id}`);
              Alert.alert('Success', 'Surgery deleted');
              fetchSurgeries();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete surgery');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/(doc_tabs)/(tabs)')} style={styles.iconButton}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Surgeries</Text>
        <TouchableOpacity onPress={openCreateModal} style={styles.iconButton}>
          <Plus size={24} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {surgeries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No surgeries recorded</Text>
            <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
              <Plus size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Surgery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          surgeries.map((surgery) => (
            <View key={surgery._id} style={styles.surgeryCard}>
              <View style={styles.surgeryHeader}>
                <Text style={styles.surgeryName}>{surgery.name}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => openEditModal(surgery)} style={styles.actionBtn}>
                    <Edit2 size={18} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(surgery)} style={styles.actionBtn}>
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.surgeryDate}>
                {new Date(surgery.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
              {surgery.hospital && <Text style={styles.surgeryHospital}>{surgery.hospital}</Text>}
              {surgery.notes && <Text style={styles.surgeryNotes}>{surgery.notes}</Text>}
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editMode ? 'Edit Surgery' : 'Add Surgery'}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Surgery Name *</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="e.g., Spay Surgery"
            />

            <Text style={styles.label}>Date *</Text>
            <TextInput
              style={styles.input}
              value={form.date}
              onChangeText={(text) => setForm({ ...form, date: text })}
              placeholder="YYYY-MM-DD (e.g., 2026-02-25)"
            />

            <Text style={styles.label}>Hospital/Clinic</Text>
            <TextInput
              style={styles.input}
              value={form.hospital}
              onChangeText={(text) => setForm({ ...form, hospital: text })}
              placeholder="e.g., City Vet Clinic"
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.notes}
              onChangeText={(text) => setForm({ ...form, notes: text })}
              placeholder="Additional notes..."
              multiline
            />

            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Creating...' : (editMode ? 'Update' : 'Create')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  topBarTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  iconButton: { padding: 8 },
  content: { flex: 1, padding: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: '#6B7280', marginBottom: 20 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  surgeryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  surgeryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  surgeryName: { fontSize: 18, fontWeight: '600', color: '#111827', flex: 1 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 4 },
  surgeryDate: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  surgeryHospital: { fontSize: 14, color: '#4B5563', marginBottom: 4 },
  surgeryNotes: { fontSize: 14, color: '#6B7280', marginTop: 8 },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  modalTitle: { fontSize: 20, fontWeight: '600', color: '#111827' },
  modalContent: { flex: 1, padding: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  saveButtonDisabled: {
    backgroundColor: '#93C5FD',
    opacity: 0.7
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
