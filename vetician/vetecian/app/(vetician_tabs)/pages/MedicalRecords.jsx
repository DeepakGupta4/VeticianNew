import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RecordsScreen = () => {
  const [selectedPet, setSelectedPet] = useState(0);
  const [activeTab, setActiveTab] = useState('medical');

  // Sample pet data
  const pets = [
    { id: 1, name: 'Max', type: 'Dog', image: '🐕', breed: 'Golden Retriever' },
    { id: 2, name: 'Luna', type: 'Cat', image: '🐱', breed: 'Persian' },
  ];

  // Sample records data
  const medicalRecords = [
    {
      id: 1,
      title: 'Annual Checkup',
      clinic: 'PetCare Clinic',
      doctor: 'Dr. Sarah Wilson',
      date: '2024-01-15',
      diagnosis: 'Healthy',
      prescription: 'Multivitamin supplements',
    },
    {
      id: 2,
      title: 'Skin Allergy Treatment',
      clinic: 'Animal Hospital',
      doctor: 'Dr. Mike Johnson',
      date: '2023-12-10',
      diagnosis: 'Allergic dermatitis',
      prescription: 'Antihistamine cream',
    },
  ];

  const vaccinations = [
    {
      id: 1,
      vaccine: 'Rabies',
      date: '2024-01-10',
      nextDue: '2025-01-10',
      status: 'completed',
    },
    {
      id: 2,
      vaccine: 'DHPP (Distemper)',
      date: '2024-01-10',
      nextDue: '2025-01-10',
      status: 'completed',
    },
    {
      id: 3,
      vaccine: 'Bordetella',
      date: '2023-08-15',
      nextDue: '2024-02-15',
      status: 'due',
    },
  ];

  const appointments = [
    {
      id: 1,
      service: 'Grooming',
      provider: 'Pampered Paws Salon',
      date: '2024-02-15',
      time: '10:00 AM',
      status: 'upcoming',
    },
    {
      id: 2,
      service: 'Video Consultation',
      provider: 'Dr. Emily Chen',
      date: '2024-02-12',
      time: '3:00 PM',
      status: 'upcoming',
    },
    {
      id: 3,
      service: 'Training Session',
      provider: 'Happy Tails Training',
      date: '2024-01-28',
      time: '2:00 PM',
      status: 'completed',
    },
  ];

  const hostelRecords = [
    {
      id: 1,
      facility: 'Pet Paradise Hostel',
      checkIn: '2023-12-20',
      checkOut: '2023-12-27',
      duration: '7 days',
      feedback: 'Excellent care',
    },
  ];

  const renderTabButton = (tab, label, icon) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Icon
        name={icon}
        size={20}
        color={activeTab === tab ? '#6C63FF' : '#666'}
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
      {medicalRecords.map((record) => (
        <View key={record.id} style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <View style={styles.recordIconContainer}>
              <Icon name="clipboard-pulse" size={24} color="#6C63FF" />
            </View>
            <View style={styles.recordInfo}>
              <Text style={styles.recordTitle}>{record.title}</Text>
              <Text style={styles.recordDate}>{record.date}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#CCC" />
          </View>
          <View style={styles.recordDetails}>
            <View style={styles.detailRow}>
              <Icon name="hospital-building" size={16} color="#666" />
              <Text style={styles.detailText}>{record.clinic}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="doctor" size={16} color="#666" />
              <Text style={styles.detailText}>{record.doctor}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="stethoscope" size={16} color="#666" />
              <Text style={styles.detailText}>{record.diagnosis}</Text>
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton}>
        <Icon name="plus-circle" size={24} color="#6C63FF" />
        <Text style={styles.addButtonText}>Add Medical Record</Text>
      </TouchableOpacity>
    </View>
  );

  const renderVaccinations = () => (
    <View style={styles.recordsContainer}>
      {vaccinations.map((vac) => (
        <View key={vac.id} style={styles.recordCard}>
          <View style={styles.vaccineHeader}>
            <View style={styles.recordIconContainer}>
              <Icon name="needle" size={24} color="#6C63FF" />
            </View>
            <View style={styles.vaccineInfo}>
              <Text style={styles.recordTitle}>{vac.vaccine}</Text>
              <Text style={styles.recordDate}>Given: {vac.date}</Text>
              <Text
                style={[
                  styles.nextDueText,
                  vac.status === 'due' && styles.dueText,
                ]}
              >
                Next Due: {vac.nextDue}
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
      ))}
      <TouchableOpacity style={styles.addButton}>
        <Icon name="plus-circle" size={24} color="#6C63FF" />
        <Text style={styles.addButtonText}>Add Vaccination Record</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAppointments = () => (
    <View style={styles.recordsContainer}>
      {appointments.map((apt) => (
        <View key={apt.id} style={styles.recordCard}>
          <View style={styles.appointmentHeader}>
            <View style={styles.recordIconContainer}>
              <Icon name="calendar-clock" size={24} color="#6C63FF" />
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
      ))}
      <TouchableOpacity style={styles.addButton}>
        <Icon name="plus-circle" size={24} color="#6C63FF" />
        <Text style={styles.addButtonText}>Book New Appointment</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHostelRecords = () => (
    <View style={styles.recordsContainer}>
      {hostelRecords.map((hostel) => (
        <View key={hostel.id} style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <View style={styles.recordIconContainer}>
              <Icon name="home-heart" size={24} color="#6C63FF" />
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
      ))}
      <TouchableOpacity style={styles.addButton}>
        <Icon name="plus-circle" size={24} color="#6C63FF" />
        <Text style={styles.addButtonText}>Add Hostel Record</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pet Records</Text>
        <TouchableOpacity>
          <Icon name="download" size={24} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {/* Pet Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.petSelector}
      >
        {pets.map((pet, index) => (
          <TouchableOpacity
            key={pet.id}
            style={[
              styles.petCard,
              selectedPet === index && styles.selectedPetCard,
            ]}
            onPress={() => setSelectedPet(index)}
          >
            <Text style={styles.petEmoji}>{pet.image}</Text>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>{pet.breed}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addPetCard}>
          <Icon name="plus" size={32} color="#6C63FF" />
          <Text style={styles.addPetText}>Add Pet</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Tabs */}
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

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'medical' && renderMedicalRecords()}
        {activeTab === 'vaccinations' && renderVaccinations()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'hostel' && renderHostelRecords()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  petSelector: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  petCard: {
    alignItems: 'center',
    marginLeft: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPetCard: {
    backgroundColor: '#EEF0FF',
    borderColor: '#6C63FF',
  },
  petEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 12,
    color: '#666',
  },
  addPetCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    minWidth: 100,
    borderWidth: 2,
    borderColor: '#6C63FF',
    borderStyle: 'dashed',
  },
  addPetText: {
    fontSize: 12,
    color: '#6C63FF',
    marginTop: 4,
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
    backgroundColor: '#EEF0FF',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#6C63FF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
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
    backgroundColor: '#EEF0FF',
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
    borderColor: '#6C63FF',
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default RecordsScreen;