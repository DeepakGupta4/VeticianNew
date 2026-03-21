import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getPetsByUserId } from '../../../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecordsScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxPets = useSelector(state => state.auth?.userPets?.data || []);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(0);
  const [activeTab, setActiveTab] = useState('medical');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: '',
    clinic: '',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    prescription: '',
  });

  useEffect(() => {
    dispatch(getPetsByUserId()).finally(() => setLoading(false));
    loadRecordsFromStorage();
  }, []);

  const loadRecordsFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('medicalRecords');
      console.log('📋 Loaded from storage:', stored);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('📋 Parsed records:', parsed);
        setMedicalRecords(parsed);
      }
    } catch (error) {
      console.log('❌ Error loading records:', error);
    }
  };

  const saveRecordsToStorage = async (records) => {
    try {
      console.log('💾 Saving records:', records);
      await AsyncStorage.setItem('medicalRecords', JSON.stringify(records));
      console.log('✅ Records saved successfully');
    } catch (error) {
      console.log('❌ Error saving records:', error);
    }
  };

  const pets = reduxPets.length > 0 ? reduxPets : [];

  const selectedPetData = pets[selectedPet] || null;

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [hostelRecords, setHostelRecords] = useState([]);

  const handleAddRecord = () => {
    if (!newRecord.title || !newRecord.clinic || !newRecord.doctor) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const record = {
      id: Date.now(),
      ...newRecord,
    };

    const updatedRecords = [record, ...medicalRecords];
    setMedicalRecords(updatedRecords);
    saveRecordsToStorage(updatedRecords);
    setShowAddModal(false);
    setNewRecord({
      title: '',
      clinic: '',
      doctor: '',
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      prescription: '',
    });
    Alert.alert('Success', 'Medical record added successfully');
  };

  const renderTabButton = (tab, label, icon) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Icon
        name={icon}
        size={20}
        color={activeTab === tab ? '#4E8D7C' : '#666'}
      />
      <Text
        style={[styles.tabButtonText, activeTab === tab && styles.activeTabText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderMedicalRecords = () => (
    <View style={styles.recordsContainer}>
      {medicalRecords.length > 0 ? (
        medicalRecords.map((record, index) => (
          <View key={record.id || index} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <View style={styles.recordIconContainer}>
                <Icon name="clipboard-pulse" size={24} color="#4E8D7C" />
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>{record.title || record.condition || 'Medical Record'}</Text>
                <Text style={styles.recordDate}>{record.date || 'N/A'}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#CCC" />
            </View>
            <View style={styles.recordDetails}>
              <View style={styles.detailRow}>
                <Icon name="hospital-building" size={16} color="#666" />
                <Text style={styles.detailText}>{record.clinic || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="doctor" size={16} color="#666" />
                <Text style={styles.detailText}>{record.doctor || record.veterinarian || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="stethoscope" size={16} color="#666" />
                <Text style={styles.detailText}>{record.diagnosis || record.treatment || 'N/A'}</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Icon name="clipboard-pulse-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No medical records yet</Text>
        </View>
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
        <Icon name="plus-circle" size={24} color="#4E8D7C" />
        <Text style={styles.addButtonText}>Add Medical Record</Text>
      </TouchableOpacity>
    </View>
  );

  const renderVaccinations = () => (
    <View style={styles.recordsContainer}>
      {vaccinations.length > 0 ? (
        vaccinations.map((vac, index) => (
          <View key={vac.id || index} style={styles.recordCard}>
            <View style={styles.vaccineHeader}>
              <View style={styles.recordIconContainer}>
                <Icon name="needle" size={24} color="#4E8D7C" />
              </View>
              <View style={styles.vaccineInfo}>
                <Text style={styles.recordTitle}>{vac.vaccine || vac.name || 'Vaccine'}</Text>
                <Text style={styles.recordDate}>Given: {vac.date || 'N/A'}</Text>
                <Text
                  style={[
                    styles.nextDueText,
                    vac.status === 'due' && styles.dueText,
                  ]}
                >
                  Next Due: {vac.nextDue || 'N/A'}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  vac.status === 'completed'
                    ? styles.completedBadge
                    : styles.dueBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    vac.status === 'completed'
                      ? styles.completedText
                      : styles.dueStatusText,
                  ]}
                >
                  {vac.status === 'completed' ? '✓' : '!'}
                </Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Icon name="needle" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No vaccination records yet</Text>
        </View>
      )}
      <TouchableOpacity style={styles.addButton}>
        <Icon name="plus-circle" size={24} color="#4E8D7C" />
        <Text style={styles.addButtonText}>Add Vaccination Record</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAppointments = () => (
    <View style={styles.recordsContainer}>
      {appointments.length > 0 ? (
        appointments.map((apt, index) => (
          <View key={apt.id || index} style={styles.recordCard}>
            <View style={styles.appointmentHeader}>
              <View style={styles.recordIconContainer}>
                <Icon name="calendar-clock" size={24} color="#4E8D7C" />
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.recordTitle}>{apt.service}</Text>
                <Text style={styles.recordDate}>
                  {apt.date} at {apt.time}
                </Text>
                <Text style={styles.providerText}>{apt.provider}</Text>
              </View>
              <View
                style={[
                  styles.appointmentStatusBadge,
                  apt.status === 'upcoming'
                    ? styles.upcomingBadge
                    : styles.completedAppBadge,
                ]}
              >
                <Text style={styles.appointmentStatusText}>
                  {apt.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                </Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Icon name="calendar-clock" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No appointments yet</Text>
        </View>
      )}
      <TouchableOpacity style={styles.addButton}>
        <Icon name="plus-circle" size={24} color="#4E8D7C" />
        <Text style={styles.addButtonText}>Book New Appointment</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHostelRecords = () => (
    <View style={styles.recordsContainer}>
      {hostelRecords.length > 0 ? (
        hostelRecords.map((hostel, index) => (
          <View key={hostel.id || index} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <View style={styles.recordIconContainer}>
                <Icon name="home-heart" size={24} color="#4E8D7C" />
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>{hostel.facility}</Text>
                <Text style={styles.recordDate}>{hostel.duration}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#CCC" />
            </View>
            <View style={styles.recordDetails}>
              <View style={styles.detailRow}>
                <Icon name="login" size={16} color="#666" />
                <Text style={styles.detailText}>Check-in: {hostel.checkIn}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="logout" size={16} color="#666" />
                <Text style={styles.detailText}>
                  Check-out: {hostel.checkOut}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="star" size={16} color="#FFB800" />
                <Text style={styles.detailText}>{hostel.feedback}</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Icon name="home-heart" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No hostel records yet</Text>
        </View>
      )}
      <TouchableOpacity style={styles.addButton}>
        <Icon name="plus-circle" size={24} color="#4E8D7C" />
        <Text style={styles.addButtonText}>Add Hostel Record</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pet Records</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E8D7C" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pet Records</Text>
        <TouchableOpacity>
          <Icon name="download" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.petSelector}
        >
          {pets.map((pet, index) => (
            <TouchableOpacity
              key={pet._id || pet.id}
              style={[
                styles.petCard,
                selectedPet === index && styles.selectedPetCard,
              ]}
              onPress={() => setSelectedPet(index)}
            >
              <Text style={styles.petEmoji}>{pet.image || (pet.species === 'Dog' ? '🐕' : '🐱')}</Text>
              <View>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.breed || pet.species}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addPetCard} onPress={() => router.push('/pages/PetList')}>
            <Icon name="plus" size={20} color="#4E8D7C" />
            <Text style={styles.addPetText}>Add Pet</Text>
          </TouchableOpacity>
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          {renderTabButton('medical', 'Medical', 'clipboard-pulse')}
          {renderTabButton('vaccinations', 'Vaccines', 'needle')}
          {renderTabButton('appointments', 'Appointments', 'calendar-clock')}
          {renderTabButton('hostel', 'Hostel', 'home-heart')}
        </ScrollView>

        <View style={styles.content}>
          {activeTab === 'medical' && renderMedicalRecords()}
          {activeTab === 'vaccinations' && renderVaccinations()}
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'hostel' && renderHostelRecords()}
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Medical Record</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                value={newRecord.title}
                onChangeText={(text) => setNewRecord({ ...newRecord, title: text })}
                placeholder="e.g., Annual Checkup"
              />

              <Text style={styles.inputLabel}>Clinic *</Text>
              <TextInput
                style={styles.input}
                value={newRecord.clinic}
                onChangeText={(text) => setNewRecord({ ...newRecord, clinic: text })}
                placeholder="e.g., PetCare Clinic"
              />

              <Text style={styles.inputLabel}>Doctor *</Text>
              <TextInput
                style={styles.input}
                value={newRecord.doctor}
                onChangeText={(text) => setNewRecord({ ...newRecord, doctor: text })}
                placeholder="e.g., Dr. Sarah Wilson"
              />

              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                value={newRecord.date}
                onChangeText={(text) => setNewRecord({ ...newRecord, date: text })}
                placeholder="YYYY-MM-DD"
              />

              <Text style={styles.inputLabel}>Diagnosis</Text>
              <TextInput
                style={styles.input}
                value={newRecord.diagnosis}
                onChangeText={(text) => setNewRecord({ ...newRecord, diagnosis: text })}
                placeholder="e.g., Healthy"
              />

              <Text style={styles.inputLabel}>Prescription</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newRecord.prescription}
                onChangeText={(text) => setNewRecord({ ...newRecord, prescription: text })}
                placeholder="e.g., Multivitamin supplements"
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleAddRecord}>
                <Text style={styles.saveButtonText}>Save Record</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#4E8D7C',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  petSelector: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  petCard: {
    alignItems: 'center',
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    gap: 8,
  },
  selectedPetCard: {
    backgroundColor: '#E8F5F1',
    borderColor: '#4E8D7C',
  },
  petEmoji: {
    fontSize: 24,
  },
  petName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  petBreed: {
    fontSize: 12,
    color: '#666',
  },
  addPetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#4E8D7C',
    borderStyle: 'dashed',
    gap: 6,
  },
  addPetText: {
    fontSize: 14,
    color: '#4E8D7C',
    fontWeight: '600',
  },
  tabsContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  activeTabButton: {
    backgroundColor: '#E8F5F1',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4E8D7C',
    fontWeight: '600',
  },
  content: {
    paddingBottom: 20,
  },
  recordsContainer: {
    padding: 16,
  },
  recordCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 13,
    color: '#666',
  },
  recordDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  vaccineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaccineInfo: {
    flex: 1,
  },
  nextDueText: {
    fontSize: 13,
    color: '#28A745',
    marginTop: 4,
  },
  dueText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  statusBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
  },
  dueBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedText: {
    color: '#28A745',
  },
  dueStatusText: {
    color: '#FF6B6B',
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentInfo: {
    flex: 1,
  },
  providerText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  appointmentStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  upcomingBadge: {
    backgroundColor: '#FFF3E0',
  },
  completedAppBadge: {
    backgroundColor: '#E8F5E9',
  },
  appointmentStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#4E8D7C',
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#4E8D7C',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#F8F9FA',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4E8D7C',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    fontWeight: '500',
  },
});

export default RecordsScreen;
