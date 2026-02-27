import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonHeader from '../../../components/CommonHeader';
import SimpleVideoCall from '../../../components/SimpleVideoCall';

const VideoCallPage = ({ route }) => {
  // Get selected pet from route params or use default
  const { pet } = route?.params || {
    pet: {
      id: '1',
      name: 'Bruno',
      breed: 'Golden Retriever',
      age: '3 years',
      weight: '28 kg',
      lastVisit: '15 Jan 2024',
      img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop',
    },
  };

  const user = useSelector(state => state.auth.user);
  const [currentStep, setCurrentStep] = useState('selectDoctor'); // selectDoctor, consultation, inCall
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [callActive, setCallActive] = useState(false);
  const [videoToken, setVideoToken] = useState(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [notes, setNotes] = useState('');
  const [showPrescription, setShowPrescription] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  // Mock prescription data
  const [prescription, setPrescription] = useState({
    diagnosis: 'Seasonal Allergies',
    medicines: [
      { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '7 days' },
      { name: 'Skin Ointment', dosage: 'Apply thin layer', frequency: 'Once daily', duration: '10 days' },
    ],
    instructions: 'Keep the pet indoors during high pollen days. Bathe weekly with medicated shampoo.',
  });

  // Fetch doctors from database
  useEffect(() => {
    fetchAvailableDoctors();
  }, []);

  const fetchAvailableDoctors = async () => {
    try {
      setLoadingDoctors(true);
      
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
      const response = await fetch(`${apiUrl}/auth/veterinarians/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Real veterinarians from database:', data);
        
        if (data.veterinarians && data.veterinarians.length > 0) {
          const transformedDoctors = data.veterinarians.map((vet, index) => ({
            id: vet._id,
            name: `Dr. ${vet.name || vet.firstName || vet.email?.split('@')[0] || 'Doctor'}`,
            role: vet.specialization || vet.role || 'Veterinarian',
            experience: `${Math.floor(Math.random() * 10) + 3} years`,
            rating: (4.2 + Math.random() * 0.7).toFixed(1),
            consultations: Math.floor(Math.random() * 1000) + 500,
            specialties: ['General Medicine'],
            isOnline: true,
            price: Math.floor(Math.random() * 300) + 299,
            img: vet.avatar || `https://images.unsplash.com/photo-${[
              '1559839734-2b71ea197ec2',
              '1612349317150-e413f6a5b16d', 
              '1594824388853-d0d4c0b5b5e7',
              '1582750433449-648ed127bb54'
            ][index % 4]}?w=150&h=150&fit=crop&crop=face`,
            clinicName: `${vet.location || 'City'} Veterinary Clinic`,
            phone: vet.phone || '+91 98765 43210',
            email: vet.email
          }));
          
          setAvailableDoctors(transformedDoctors);
          console.log('Successfully loaded real doctors:', transformedDoctors.length);
        } else {
          console.log('No veterinarians found in response');
          setAvailableDoctors([]);
        }
      } else {
        console.log('API call failed with status:', response.status);
        setAvailableDoctors([]);
      }
    } catch (error) {
      console.error('Error fetching real veterinarians:', error);
      setAvailableDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const getMockDoctors = () => [
    {
      id: '1',
      name: 'Dr. Prateeksha B S',
      role: 'Senior Vet, Surgeon',
      experience: '7 years',
      rating: 4.8,
      consultations: 1337,
      specialties: ['General Medicine', 'Surgery'],
      isOnline: true,
      price: 399,
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '2',
      name: 'Dr. Anshuman Gupta',
      role: 'Pet Cardiologist',
      experience: '11 years',
      rating: 4.9,
      consultations: 1587,
      specialties: ['Cardiology', 'Internal Medicine'],
      isOnline: true,
      price: 499,
      img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '3',
      name: 'Dr. Sarah Johnson',
      role: 'Dermatology Specialist',
      experience: '5 years',
      rating: 4.7,
      consultations: 892,
      specialties: ['Dermatology', 'Allergies'],
      isOnline: true,
      price: 449,
      img: 'https://images.unsplash.com/photo-1594824388853-d0d4c0b5b5e7?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '4',
      name: 'Dr. Rajesh Kumar',
      role: 'Emergency Veterinarian',
      experience: '9 years',
      rating: 4.6,
      consultations: 1245,
      specialties: ['Emergency Care', 'Surgery'],
      isOnline: true,
      price: 599,
      img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '5',
      name: 'Dr. Meera Patel',
      role: 'Pet Nutritionist',
      experience: '6 years',
      rating: 4.5,
      consultations: 756,
      specialties: ['Nutrition', 'Diet Planning'],
      isOnline: false,
      price: 349,
      img: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
    },
  ];

  const selectDoctor = (doctor) => {
    if (!doctor.isOnline) {
      Alert.alert('Doctor Unavailable', 'This doctor is currently offline. Please select another doctor.');
      return;
    }
    setSelectedDoctor(doctor);
    setCurrentStep('consultation');
  };

  const startVideoCall = async () => {
    if (!selectedDoctor) {
      Alert.alert('Error', 'Please select a doctor first');
      return;
    }

    setLoadingToken(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
      const userId = await AsyncStorage.getItem('userId');
      const roomName = `consultation-${userId}-${selectedDoctor.id}-${Date.now()}`;
      
      console.log(`Starting call with Dr. ${selectedDoctor.name}...`);
      
      // Simulate token generation for now
      const mockToken = {
        token: 'mock-jwt-token',
        roomName: roomName,
        identity: user?.name || 'pet-parent'
      };
      
      setVideoToken(mockToken);
      setCallActive(true);
      setCurrentStep('inCall');
    } catch (error) {
      console.error('Error starting call:', error);
      Alert.alert('Error', 'Failed to start video call');
    } finally {
      setLoadingToken(false);
    }
  };

  const endVideoCall = () => {
    setCallActive(false);
    setVideoToken(null);
    setCurrentStep('consultation');
  };

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setUploadedPhotos([...uploadedPhotos, ...result.assets.map(asset => asset.uri)]);
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      setUploadedPhotos([...uploadedPhotos, result.assets[0].uri]);
    }
  };

  const savePrescription = () => {
    Alert.alert('Success', 'Prescription saved to pet records!');
    setShowPrescription(false);
  };

  const bookFollowUp = (timeframe) => {
    Alert.alert('Follow-up Booked', `Follow-up consultation scheduled for ${timeframe}`);
    setShowFollowUp(false);
  };

  // Render doctor selection screen
  const renderDoctorSelection = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Choose Your Veterinarian</Text>
        <Text style={styles.headerSubtitle}>Connect with experienced vets for {pet.name}</Text>
      </View>

      <View style={styles.petInfoCard}>
        <Image source={{ uri: pet.img }} style={styles.petImageSmall} />
        <View style={styles.petInfoText}>
          <Text style={styles.petNameSmall}>{pet.name}</Text>
          <Text style={styles.petBreedSmall}>{pet.breed} • {pet.age}</Text>
        </View>
      </View>

      <View style={styles.doctorsSection}>
        <Text style={styles.sectionTitle}>Available Veterinarians</Text>
        {loadingDoctors ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading doctors...</Text>
          </View>
        ) : (
          availableDoctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={[styles.doctorCard, !doctor.isOnline && styles.doctorCardOffline]}
              onPress={() => selectDoctor(doctor)}
            >
              <Image source={{ uri: doctor.img }} style={styles.doctorImage} />
              <View style={styles.doctorInfo}>
                <View style={styles.doctorHeader}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <View style={styles.onlineStatus}>
                    <View style={[styles.statusDot, { backgroundColor: doctor.isOnline ? '#4CAF50' : '#999' }]} />
                    <Text style={styles.statusText}>{doctor.isOnline ? 'Online' : 'Offline'}</Text>
                  </View>
                </View>
                <Text style={styles.doctorRole}>{doctor.role}</Text>
                <Text style={styles.doctorExperience}>{doctor.experience} experience</Text>
                <View style={styles.doctorStats}>
                  <Text style={styles.rating}>⭐ {doctor.rating}</Text>
                  <Text style={styles.consultations}>{doctor.consultations} consultations</Text>
                </View>
                <View style={styles.specialtiesContainer}>
                  {doctor.specialties?.map((specialty, index) => (
                    <View key={index} style={styles.specialtyTag}>
                      <Text style={styles.specialtyText}>{specialty}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{doctor.price}</Text>
                <Text style={styles.priceLabel}>per consultation</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );

  // Render consultation preparation screen
  const renderConsultationPrep = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setCurrentStep('selectDoctor')}
      >
        <Text style={styles.backButtonText}>← Back to Doctors</Text>
      </TouchableOpacity>

      {/* Selected Doctor Info */}
      <View style={styles.selectedDoctorCard}>
        <Image source={{ uri: selectedDoctor?.img }} style={styles.doctorImageLarge} />
        <View style={styles.selectedDoctorInfo}>
          <Text style={styles.selectedDoctorName}>{selectedDoctor?.name}</Text>
          <Text style={styles.selectedDoctorRole}>{selectedDoctor?.role}</Text>
          <View style={styles.onlineStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Available Now</Text>
          </View>
        </View>
      </View>

      {/* Pet Summary Card */}
      <View style={styles.petSummaryCard}>
        <View style={styles.petSummaryHeader}>
          <Image source={{ uri: pet.img }} style={styles.petImage} />
          <View style={styles.petBasicInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>{pet.breed}</Text>
          </View>
          <TouchableOpacity style={styles.viewRecordsBtn}>
            <Text style={styles.viewRecordsText}>View Records</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.petStatsGrid}>
          <View style={styles.petStatItem}>
            <Text style={styles.petStatLabel}>Age</Text>
            <Text style={styles.petStatValue}>{pet.age}</Text>
          </View>
          <View style={styles.petStatItem}>
            <Text style={styles.petStatLabel}>Weight</Text>
            <Text style={styles.petStatValue}>{pet.weight}</Text>
          </View>
          <View style={styles.petStatItem}>
            <Text style={styles.petStatLabel}>Last Visit</Text>
            <Text style={styles.petStatValue}>{pet.lastVisit}</Text>
          </View>
        </View>

        <View style={styles.concernSection}>
          <Text style={styles.concernLabel}>Today's Concern:</Text>
          <TextInput
            style={styles.concernInput}
            placeholder="Describe symptoms or concerns..."
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </View>

      {/* Photo Upload Section */}
      <View style={styles.photoUploadSection}>
        <Text style={styles.sectionTitle}>Share Photos with Vet</Text>
        <Text style={styles.sectionSubtitle}>
          Upload images of symptoms, skin conditions, or injuries
        </Text>

        <View style={styles.uploadButtons}>
          <TouchableOpacity style={styles.uploadBtn} onPress={takePhoto}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadBtnText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
            <Text style={styles.uploadIcon}>🖼️</Text>
            <Text style={styles.uploadBtnText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        {uploadedPhotos.length > 0 && (
          <View style={styles.photoGallery}>
            <Text style={styles.galleryTitle}>Uploaded ({uploadedPhotos.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {uploadedPhotos.map((photo, index) => (
                <View key={index} style={styles.photoThumb}>
                  <Image source={{ uri: photo }} style={styles.thumbImage} />
                  <TouchableOpacity
                    style={styles.removePhotoBtn}
                    onPress={() =>
                      setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index))
                    }
                  >
                    <Text style={styles.removePhotoText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Start Call Button */}
      <View style={styles.startCallSection}>
        <TouchableOpacity
          style={styles.startCallButton}
          onPress={startVideoCall}
          disabled={loadingToken}
        >
          {loadingToken ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.startCallIcon}>📹</Text>
              <Text style={styles.startCallText}>Start Video Consultation</Text>
              <Text style={styles.startCallSubtext}>₹{selectedDoctor?.price} • Connect instantly</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Render active video call
  const renderVideoCall = () => (
    <View style={styles.videoCallContainer}>
      {callActive && videoToken ? (
        <SimpleVideoCall
          token={videoToken.token}
          roomName={videoToken.roomName}
          onCallEnd={endVideoCall}
          doctorData={selectedDoctor}
        />
      ) : (
        <View style={styles.loadingCallScreen}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Connecting to Dr. {selectedDoctor?.name}...</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <CommonHeader 
        title={currentStep === 'selectDoctor' ? 'Video Consultation' : 
               currentStep === 'consultation' ? `Consult ${selectedDoctor?.name}` : 
               'Video Call'} 
      />

      {currentStep === 'selectDoctor' && renderDoctorSelection()}
      {currentStep === 'consultation' && renderConsultationPrep()}
      {currentStep === 'inCall' && renderVideoCall()}

      {/* Prescription Modal */}
      <Modal
        visible={showPrescription}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrescription(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.prescriptionModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Prescription</Text>
              <TouchableOpacity onPress={() => setShowPrescription(false)}>
                <Text style={styles.closeBtn}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.prescriptionContent}>
              <View style={styles.prescriptionSection}>
                <Text style={styles.prescriptionLabel}>Diagnosis</Text>
                <Text style={styles.prescriptionText}>{prescription.diagnosis}</Text>
              </View>

              <View style={styles.prescriptionSection}>
                <Text style={styles.prescriptionLabel}>Medications</Text>
                {prescription.medicines.map((med, index) => (
                  <View key={index} style={styles.medicineItem}>
                    <Text style={styles.medicineName}>
                      {index + 1}. {med.name}
                    </Text>
                    <Text style={styles.medicineDetail}>
                      Dosage: {med.dosage}
                    </Text>
                    <Text style={styles.medicineDetail}>
                      Frequency: {med.frequency}
                    </Text>
                    <Text style={styles.medicineDetail}>
                      Duration: {med.duration}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.prescriptionSection}>
                <Text style={styles.prescriptionLabel}>Special Instructions</Text>
                <Text style={styles.prescriptionText}>{prescription.instructions}</Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.downloadBtn}>
                <Text style={styles.downloadBtnText}>📥 Download PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={savePrescription}>
                <Text style={styles.saveBtnText}>💾 Save to Records</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Follow-up Modal */}
      <Modal
        visible={showFollowUp}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFollowUp(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.followUpModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Follow-up</Text>
              <TouchableOpacity onPress={() => setShowFollowUp(false)}>
                <Text style={styles.closeBtn}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.followUpOptions}>
              <TouchableOpacity
                style={styles.followUpOption}
                onPress={() => bookFollowUp('3 days')}
              >
                <Text style={styles.followUpOptionTitle}>3 Days</Text>
                <Text style={styles.followUpOptionSubtitle}>Check progress</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.followUpOption}
                onPress={() => bookFollowUp('1 week')}
              >
                <Text style={styles.followUpOptionTitle}>1 Week</Text>
                <Text style={styles.followUpOptionSubtitle}>Reassessment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.followUpOption}
                onPress={() => bookFollowUp('2 weeks')}
              >
                <Text style={styles.followUpOptionTitle}>2 Weeks</Text>
                <Text style={styles.followUpOptionSubtitle}>Final check</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.followUpOption}
                onPress={() => bookFollowUp('1 month')}
              >
                <Text style={styles.followUpOptionTitle}>1 Month</Text>
                <Text style={styles.followUpOptionSubtitle}>Routine visit</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.customDateBtn}>
              <Text style={styles.customDateBtnText}>Choose Custom Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },

  // Header Section
  headerSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },

  // Pet Info Card (Small)
  petInfoCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
    elevation: 2,
  },
  petImageSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  petInfoText: {
    flex: 1,
  },
  petNameSmall: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  petBreedSmall: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

  // Doctors Section
  doctorsSection: {
    paddingHorizontal: 15,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#666',
    marginTop: 10,
    fontSize: 14,
  },
  doctorCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    elevation: 3,
  },
  doctorCardOffline: {
    opacity: 0.6,
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  doctorRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  doctorExperience: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  doctorStats: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    color: '#FF9800',
    marginRight: 15,
  },
  consultations: {
    fontSize: 12,
    color: '#666',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 11,
    color: '#2D9CDB',
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },

  // Back Button
  backButton: {
    padding: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2D9CDB',
    fontWeight: '600',
  },

  // Selected Doctor Card
  selectedDoctorCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  doctorImageLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  selectedDoctorInfo: {
    flex: 1,
  },
  selectedDoctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  selectedDoctorRole: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },

  // Pet Summary Card Styles
  petSummaryCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
    elevation: 3,
  },
  petSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  petBasicInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  viewRecordsBtn: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewRecordsText: {
    color: '#2D9CDB',
    fontSize: 12,
    fontWeight: '600',
  },
  petStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  petStatItem: {
    alignItems: 'center',
  },
  petStatLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  petStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  concernSection: {
    marginTop: 15,
  },
  concernLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  concernInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
  },

  // Photo Upload Section
  photoUploadSection: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 15,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadBtn: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#2D9CDB',
    borderStyle: 'dashed',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadBtnText: {
    color: '#2D9CDB',
    fontSize: 13,
    fontWeight: '600',
  },
  photoGallery: {
    marginTop: 20,
  },
  galleryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  photoThumb: {
    position: 'relative',
    marginRight: 10,
  },
  thumbImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Start Call Section
  startCallSection: {
    padding: 15,
    paddingBottom: 30,
  },
  startCallButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
    elevation: 5,
  },
  startCallIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  startCallText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  startCallSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },

  // Video Call Container
  videoCallContainer: {
    flex: 1,
  },
  loadingCallScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  prescriptionModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeBtn: {
    fontSize: 32,
    color: '#888',
  },
  prescriptionContent: {
    padding: 20,
  },
  prescriptionSection: {
    marginBottom: 20,
  },
  prescriptionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D9CDB',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  prescriptionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  medicineItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  medicineDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  downloadBtn: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  downloadBtnText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Follow-up Modal
  followUpModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  followUpOptions: {
    padding: 20,
  },
  followUpOption: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#eee',
  },
  followUpOptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  followUpOptionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  customDateBtn: {
    marginHorizontal: 20,
    backgroundColor: '#2D9CDB',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  customDateBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoCallPage;