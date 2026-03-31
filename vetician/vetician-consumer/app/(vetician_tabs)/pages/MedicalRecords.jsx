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
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { getPetsByUserId } from '../../../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../../constant/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RecordsScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
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
    loadRecordsFromDatabase();
  }, []);
  
  useEffect(() => {
    // Load records when selected pet changes
    if (selectedPetData?._id) {
      loadRecordsFromDatabase();
    }
  }, [selectedPet]);

  const loadRecordsFromDatabase = async () => {
    try {
      const petId = pets[selectedPet]?._id;
      console.log('🔍 Selected Pet Index:', selectedPet);
      console.log('🔍 Selected Pet Data:', pets[selectedPet]);
      console.log('🔍 Pet ID for loading records:', petId);
      
      if (!petId) {
        console.log('⚠️ No pet ID found, skipping load');
        return;
      }
      
      const token = await AsyncStorage.getItem('token');
      const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
      
      console.log('📥 Loading medical records from database for pet:', petId);
      console.log('🌐 Request URL:', `${BASE_URL}/medical-records/pet/${petId}`);
      
      const response = await fetch(`${BASE_URL}/medical-records/pet/${petId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('📊 API Response:', JSON.stringify(data, null, 2));
      
      if (data.success && data.medicalRecords) {
        console.log('✅ Setting medical records:', data.medicalRecords.length, 'records');
        setMedicalRecords(data.medicalRecords);
        console.log('✅ Medical records loaded from database:', data.medicalRecords.length);
      } else {
        console.log('⚠️ No records found or API error');
        setMedicalRecords([]);
      }
    } catch (error) {
      console.error('❌ Error loading medical records:', error);
      setMedicalRecords([]);
    }
  };

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

  const handleAddRecord = async () => {
    if (!newRecord.title || !newRecord.clinic || !newRecord.doctor) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      console.log('📤 Sending medical record to API...');
      
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      const petId = selectedPetData?._id;
      
      if (!petId) {
        Alert.alert('Error', 'Please select a pet first');
        return;
      }
      
      console.log('🐾 Adding record for pet:', selectedPetData.name, '(ID:', petId, ')');
      
      const recordData = {
        petId: petId,
        userId: userId,
        recordType: 'Prescription',
        title: newRecord.title,
        clinic: newRecord.clinic,
        doctor: newRecord.doctor,
        date: newRecord.date,
        diagnosis: newRecord.diagnosis,
        prescription: newRecord.prescription,
        status: 'Active'
      };
      
      console.log('📝 Record data:', recordData);
      
      const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
      const apiUrl = `${BASE_URL}/medical-records`;
      
      console.log('🌐 API URL:', apiUrl);
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recordData)
      });
      
      console.log('📡 Response status:', response.status);
      
      const responseData = await response.json();
      console.log('📊 Response data:', responseData);
      
      if (!response.ok) {
        console.log('❌ Response error:', responseData);
        
        // Check if it's an authentication error
        if (response.status === 401) {
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please log in again.',
            [
              {
                text: 'OK',
                onPress: async () => {
                  // Clear stored credentials
                  await AsyncStorage.multiRemove(['token', 'userId']);
                  // Navigate to login screen
                  router.replace('/login');
                }
              }
            ]
          );
          return;
        }
        
        throw new Error(responseData.message || 'Failed to save medical record');
      }
      
      if (responseData.success) {
        // Reload records from database to show the newly added record
        await loadRecordsFromDatabase();
        
        setShowAddModal(false);
        setNewRecord({
          title: '',
          clinic: '',
          doctor: '',
          date: new Date().toISOString().split('T')[0],
          diagnosis: '',
          prescription: '',
        });
        
        Alert.alert('Success', 'Medical record saved successfully!');
        console.log('✅ Medical record saved successfully!');
      }
    } catch (error) {
      console.error('❌ Error saving medical record:', error);
      Alert.alert('Error', error.message || 'Failed to save medical record');
    }
  };

  const renderTabButton = (tab, label, icon) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={activeTab === tab ? COLORS.primaryGreen : '#666'}
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
                <MaterialCommunityIcons name="clipboard-pulse" size={24} color={COLORS.primaryGreen} />
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>{record.title || record.condition || 'Medical Record'}</Text>
                <Text style={styles.recordDate}>{record.date || 'N/A'}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#CCC" />
            </View>
            <View style={styles.recordDetails}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="hospital-building" size={16} color="#666" />
                <Text style={styles.detailText}>{record.clinic || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="doctor" size={16} color="#666" />
                <Text style={styles.detailText}>{record.doctor || record.veterinarian || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="stethoscope" size={16} color="#666" />
                <Text style={styles.detailText}>{record.diagnosis || record.treatment || 'N/A'}</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="clipboard-pulse-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No medical records yet</Text>
        </View>
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
        <MaterialCommunityIcons name="plus-circle" size={24} color={COLORS.primaryGreen} />
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
                <MaterialCommunityIcons name="needle" size={24} color={COLORS.primaryGreen} />
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
          <MaterialCommunityIcons name="needle" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No vaccination records yet</Text>
        </View>
      )}
      <TouchableOpacity style={styles.addButton}>
        <MaterialCommunityIcons name="plus-circle" size={24} color={COLORS.primaryGreen} />
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
                <MaterialCommunityIcons name="calendar-clock" size={24} color={COLORS.primaryGreen} />
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
          <MaterialCommunityIcons name="calendar-clock" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No appointments yet</Text>
        </View>
      )}
      <TouchableOpacity style={styles.addButton}>
        <MaterialCommunityIcons name="plus-circle" size={24} color={COLORS.primaryGreen} />
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
                <MaterialCommunityIcons name="home-heart" size={24} color={COLORS.primaryGreen} />
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>{hostel.facility}</Text>
                <Text style={styles.recordDate}>{hostel.duration}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#CCC" />
            </View>
            <View style={styles.recordDetails}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="login" size={16} color="#666" />
                <Text style={styles.detailText}>Check-in: {hostel.checkIn}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="logout" size={16} color="#666" />
                <Text style={styles.detailText}>
                  Check-out: {hostel.checkOut}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="star" size={16} color="#FFB800" />
                <Text style={styles.detailText}>{hostel.feedback}</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="home-heart" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No hostel records yet</Text>
        </View>
      )}
      <TouchableOpacity style={styles.addButton}>
        <MaterialCommunityIcons name="plus-circle" size={24} color={COLORS.primaryGreen} />
        <Text style={styles.addButtonText}>Add Hostel Record</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.primaryGreen} barStyle="light-content" />
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Medical Records</Text>
          <View style={styles.headerIcon} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryGreen} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryGreen} barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon} activeOpacity={0.8}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Records</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8}>
          <MaterialCommunityIcons name="download" size={22} color="#fff" />
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
          <TouchableOpacity style={styles.addPetCard} onPress={() => router.push('/(vetician_tabs)/pages/PetDetail')}>
            <MaterialCommunityIcons name="plus" size={20} color={COLORS.primaryGreen} />
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
                <MaterialCommunityIcons name="close" size={24} color="#666" />
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
    backgroundColor: COLORS.background,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  petSelector: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  petCard: {
    alignItems: 'center',
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primaryPale,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    gap: 8,
  },
  selectedPetCard: {
    backgroundColor: COLORS.primaryPale,
    borderColor: COLORS.primaryGreen,
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
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primaryGreen,
    borderStyle: 'dashed',
    gap: 6,
  },
  addPetText: {
    fontSize: 14,
    color: COLORS.primaryGreen,
    fontWeight: '600',
  },
  tabsContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
  },
  activeTabButton: {
    backgroundColor: COLORS.primaryPale,
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primaryGreen,
    fontWeight: '600',
  },
  content: {
    paddingBottom: 20,
  },
  recordsContainer: {
    padding: 16,
  },
  recordCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryPale,
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
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primaryGreen,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: COLORS.primaryGreen,
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
    backgroundColor: COLORS.primaryGreen,
    padding: 16,
    borderRadius: 12,
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
