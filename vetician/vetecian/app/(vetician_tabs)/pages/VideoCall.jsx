// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   Dimensions,
// } from 'react-native';

// const { width } = Dimensions.get('window');

// // Mock Data - Screenshots ke hisab se
// const SPECIALITIES = [
//   { id: '1', title: 'General Vet', price: '₹399', icon: '🩺' },
//   { id: '2', title: 'Skin & Coat', price: '₹449', icon: '🐕' },
//   { id: '3', title: 'Behavior', price: '₹499', icon: '🧠' },
//   { id: '4', title: 'Digestion', price: '₹399', icon: '🦴' },
// ];

// const DOCTORS = [
//   {
//     id: '1',
//     name: 'Dr. Prateeksha B S',
//     role: 'Senior Vet, Surgeon',
//     exp: '7 years experience',
//     consults: '13337 consults done',
//     img: 'https://via.placeholder.com/100',
//   },
//   {
//     id: '2',
//     name: 'Dr. Anshuman Gupta',
//     role: 'Pet Cardiologist',
//     exp: '11 years experience',
//     consults: '13587 consults done',
//     img: 'https://via.placeholder.com/100',
//   },
// ];

// const VideoConsultTab = () => {
//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
//       {/* SECTION 1: HERO BANNER (Screenshot 1) */}
//       <View style={styles.heroSection}>
//         <View style={styles.heroTextContent}>
//           <Text style={styles.heroTitle}>Skip the travel!</Text>
//           <Text style={styles.heroSubTitle}>Take Online Vet Consultation</Text>
//           <Text style={styles.heroTagline}>Private consultation + Video call • Starts at just ₹199</Text>
          
//           <View style={styles.onlineStatus}>
//              <Text style={styles.onlineText}>🟢 +126 Vets are online</Text>
//           </View>

//           <TouchableOpacity style={styles.consultNowBtn}>
//             <Text style={styles.consultNowText}>Consult Now</Text>
//           </TouchableOpacity>
//         </View>
//         <Image 
//           source={{uri: 'https://img.freepik.com/free-photo/happy-woman-holding-her-dog-home_23-2149129707.jpg'}} 
//           style={styles.heroImage} 
//         />
//       </View>

//       {/* SECTION 2: SPECIALITIES (Screenshot 2) */}
//       <View style={styles.whiteSection}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>25+ Specialities</Text>
//           <TouchableOpacity><Text style={styles.seeAll}>See all Specialities</Text></TouchableOpacity>
//         </View>
//         <FlatList
//           horizontal
//           data={SPECIALITIES}
//           showsHorizontalScrollIndicator={false}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.specCard}>
//               <View style={styles.iconCircle}><Text style={{fontSize: 30}}>{item.icon}</Text></View>
//               <Text style={styles.specName}>{item.title}</Text>
//               <Text style={styles.specPrice}>{item.price}</Text>
//               <TouchableOpacity><Text style={styles.consultLink}>Consult now ›</Text></TouchableOpacity>
//             </View>
//           )}
//         />
//       </View>

//       {/* SECTION 3: OFFERS (Screenshot 3) */}
//       <View style={styles.offerContainer}>
//         <View style={[styles.offerCard, {backgroundColor: '#E0F2F1'}]}>
//           <Text style={styles.offerTag}>OFFER</Text>
//           <Text style={styles.offerText}>Download App & get ₹200 HealthCash</Text>
//         </View>
//         <View style={[styles.offerCard, {backgroundColor: '#FFF3E0'}]}>
//           <Text style={styles.offerTag}>OFFER</Text>
//           <Text style={styles.offerText}>Consult with specialists at just ₹199</Text>
//         </View>
//       </View>

//       {/* SECTION 4: OUR DOCTORS (Screenshot 3 bottom) */}
//       <View style={styles.whiteSection}>
//         <Text style={styles.sectionTitle}>Our Vets</Text>
//         {DOCTORS.map((doc) => (
//           <View key={doc.id} style={styles.docCard}>
//             <Image source={{uri: doc.img}} style={styles.docImg} />
//             <View style={styles.docInfo}>
//               <Text style={styles.docName}>{doc.name}</Text>
//               <Text style={styles.docSub}>{doc.role}</Text>
//               <Text style={styles.docSub}>{doc.exp}</Text>
//               <Text style={styles.docConsults}>{doc.consults}</Text>
//             </View>
//           </View>
//         ))}
//       </View>

//       {/* SECTION 5: STATS (Screenshot 4) */}
//       <View style={styles.statsBar}>
//         <View style={styles.statItem}><Text style={styles.statNum}>20,000+</Text><Text style={styles.statLab}>Verified Vets</Text></View>
//         <View style={styles.statItem}><Text style={styles.statNum}>4.5 / 5</Text><Text style={styles.statLab}>App Rating</Text></View>
//       </View>

//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f0f0f0' },
//   // Hero Styles
//   heroSection: { backgroundColor: '#FDECE9', padding: 20, flexDirection: 'row', minHeight: 250 },
//   heroTextContent: { flex: 1, zIndex: 1 },
//   heroTitle: { fontSize: 18, color: '#444' },
//   heroSubTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 5 },
//   heroTagline: { fontSize: 13, color: '#666', marginBottom: 15 },
//   consultNowBtn: { backgroundColor: '#2D9CDB', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 5, alignSelf: 'flex-start' },
//   consultNowText: { color: '#fff', fontWeight: 'bold' },
//   heroImage: { width: 150, height: 200, position: 'absolute', right: 0, bottom: 0, opacity: 0.8 },
//   onlineText: { fontSize: 12, marginBottom: 10, color: '#444' },
//   // Section Styles
//   whiteSection: { backgroundColor: '#fff', padding: 20, marginBottom: 10 },
//   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold' },
//   seeAll: { color: '#2D9CDB', fontSize: 13 },
//   // Speciality Card
//   specCard: { width: 130, alignItems: 'center', padding: 15, borderHorizontalWidth: 1, borderColor: '#eee' },
//   iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
//   specName: { fontWeight: 'bold', fontSize: 14 },
//   specPrice: { color: '#777', marginVertical: 5 },
//   consultLink: { color: '#2D9CDB', fontWeight: 'bold' },
//   // Offer Cards
//   offerContainer: { flexDirection: 'row', padding: 10, justifyContent: 'space-between' },
//   offerCard: { width: '48%', padding: 15, borderRadius: 8 },
//   offerTag: { backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 5, fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
//   offerText: { fontSize: 12, fontWeight: 'bold' },
//   // Doctor Card
//   docCard: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
//   docImg: { width: 60, height: 60, borderRadius: 30 },
//   docInfo: { marginLeft: 15 },
//   docName: { fontWeight: 'bold', fontSize: 16 },
//   docSub: { color: '#666', fontSize: 12 },
//   docConsults: { color: '#888', fontSize: 11, marginTop: 4 },
//   // Stats
//   statsBar: { backgroundColor: '#2C2D33', padding: 20, flexDirection: 'row', justifyContent: 'space-around' },
//   statNum: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
//   statLab: { color: '#aaa', fontSize: 12, textAlign: 'center' }
// });

// export default VideoConsultTab;

import React, { useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const VideoCallPage = ({ route }) => {
  // Mock data - replace with actual props
  const { doctor, pet } = route?.params || {
    doctor: {
      name: 'Dr. Prateeksha B S',
      role: 'Senior Vet, Surgeon',
      img: 'https://via.placeholder.com/100',
    },
    pet: {
      name: 'Bruno',
      breed: 'Golden Retriever',
      age: '3 years',
      weight: '28 kg',
      lastVisit: '15 Jan 2026',
      img: 'https://via.placeholder.com/80',
    },
  };

  const [callActive, setCallActive] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [notes, setNotes] = useState('');

  // Mock prescription data
  const [prescription, setPrescription] = useState({
    diagnosis: 'Seasonal Allergies',
    medicines: [
      { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '7 days' },
      { name: 'Skin Ointment', dosage: 'Apply thin layer', frequency: 'Once daily', duration: '10 days' },
    ],
    instructions: 'Keep the pet indoors during high pollen days. Bathe weekly with medicated shampoo.',
  });

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Consultation</Text>
        <TouchableOpacity>
          <Text style={styles.menuBtn}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. PET SUMMARY CARD */}
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

        {/* Video Call Area */}
        <View style={styles.videoSection}>
          <View style={styles.mainVideoContainer}>
            {!callActive ? (
              <View style={styles.prCallScreen}>
                <Image source={{ uri: doctor.img }} style={styles.doctorAvatar} />
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorRole}>{doctor.role}</Text>
                <TouchableOpacity
                  style={styles.startCallBtn}
                  onPress={() => setCallActive(true)}
                >
                  <Text style={styles.startCallText}>📹 Start Video Call</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.activeCallScreen}>
                <Image source={{ uri: doctor.img }} style={styles.fullscreenDoctor} />
                <View style={styles.selfViewContainer}>
                  <View style={styles.selfView}>
                    <Text style={styles.selfViewText}>You</Text>
                  </View>
                </View>
                <View style={styles.callControls}>
                  <TouchableOpacity style={styles.controlBtn}>
                    <Text style={styles.controlIcon}>🎤</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlBtn}>
                    <Text style={styles.controlIcon}>📹</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlBtn, styles.endCallBtn]}
                    onPress={() => setCallActive(false)}
                  >
                    <Text style={styles.controlIcon}>📞</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* 2. UPLOAD PHOTOS DURING CALL */}
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

        {/* 3. PRESCRIPTION + SAVE TO RECORDS */}
        <TouchableOpacity
          style={styles.prescriptionCard}
          onPress={() => setShowPrescription(true)}
        >
          <View style={styles.prescriptionHeader}>
            <Text style={styles.prescriptionIcon}>📋</Text>
            <View style={styles.prescriptionInfo}>
              <Text style={styles.prescriptionTitle}>Prescription Ready</Text>
              <Text style={styles.prescriptionSubtitle}>
                Tap to view and save to records
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>

        {/* 4. FOLLOW-UP BOOKING */}
        <View style={styles.followUpSection}>
          <Text style={styles.sectionTitle}>Need a Follow-up?</Text>
          <Text style={styles.sectionSubtitle}>
            Book your next consultation in advance
          </Text>
          <TouchableOpacity
            style={styles.followUpBtn}
            onPress={() => setShowFollowUp(true)}
          >
            <Text style={styles.followUpBtnText}>📅 Schedule Follow-up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* PRESCRIPTION MODAL */}
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

      {/* FOLLOW-UP MODAL */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuBtn: {
    fontSize: 24,
    color: '#333',
  },

  // Pet Summary Card Styles
  petSummaryCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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

  // Video Section Styles
  videoSection: {
    margin: 15,
  },
  mainVideoContainer: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  prCallScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  doctorAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  doctorRole: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 30,
  },
  startCallBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startCallText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeCallScreen: {
    flex: 1,
    position: 'relative',
  },
  fullscreenDoctor: {
    width: '100%',
    height: '100%',
  },
  selfViewContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  selfView: {
    width: 100,
    height: 130,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  selfViewText: {
    color: '#fff',
    fontSize: 12,
  },
  callControls: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  controlBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  endCallBtn: {
    backgroundColor: '#F44336',
  },
  controlIcon: {
    fontSize: 24,
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

  // Prescription Card
  prescriptionCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  prescriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prescriptionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  prescriptionInfo: {
    flex: 1,
  },
  prescriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  prescriptionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#ccc',
  },

  // Follow-up Section
  followUpSection: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 30,
    borderRadius: 12,
    padding: 20,
  },
  followUpBtn: {
    backgroundColor: '#2D9CDB',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  followUpBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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