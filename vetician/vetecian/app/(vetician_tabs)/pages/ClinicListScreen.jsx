// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
//   Image,
//   Dimensions,
//   SafeAreaView,
//   Linking,
//   Modal,
//   Alert,
// } from 'react-native';
// import {
//   MaterialIcons,
//   FontAwesome5,
//   Ionicons,
//   MaterialCommunityIcons,
// } from '@expo/vector-icons';
// import { router } from 'expo-router';

// const { width } = Dimensions.get('window');

// // --- MOCK DATA ---
// const MOCK_CLINICS = [
//   {
//     clinicDetails: {
//       _id: '1',
//       clinicName: 'Happy Paws Vet Care',
//       city: 'Bangalore',
//       locality: 'Indiranagar',
//       establishmentType: 'Multi-speciality Clinic',
//       fees: '450',
//       verified: true,
//       phoneNumber: '9876543210',
//       address: '123, 5th Main Road, Indiranagar, Bangalore - 560038',
//       rating: 4.8,
//       totalReviews: 156,
//       amenities: ['Emergency Care', 'Surgery', 'Grooming', 'Vaccination'],
//     },
//     veterinarianDetails: {
//       name: 'Rahul Sharma',
//       experience: '12',
//       gender: 'Male',
//       specialization: 'Surgeon',
//       profilePhotoUrl:
//         'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop',
//       qualifications: 'BVSc, MVSc (Surgery)',
//       languages: ['English', 'Hindi', 'Kannada'],
//     },
//   },
//   {
//     clinicDetails: {
//       _id: '2',
//       clinicName: 'Pet Wellness Center',
//       city: 'Bangalore',
//       locality: 'Koramangala',
//       establishmentType: 'Pet Hospital',
//       fees: '600',
//       verified: true,
//       phoneNumber: '9876543211',
//       address: '45, 80 Feet Road, Koramangala, Bangalore - 560095',
//       rating: 4.6,
//       totalReviews: 98,
//       amenities: ['24/7 Emergency', 'ICU', 'Lab Services', 'Pet Pharmacy'],
//     },
//     veterinarianDetails: {
//       name: 'Aditi Rao',
//       experience: '8',
//       gender: 'Female',
//       specialization: 'Dermatologist',
//       profilePhotoUrl:
//         'https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=200&h=200&auto=format&fit=crop',
//       qualifications: 'BVSc, MVSc (Dermatology)',
//       languages: ['English', 'Hindi', 'Tamil'],
//     },
//   },
//   {
//     clinicDetails: {
//       _id: '3',
//       clinicName: 'Furry Friends Clinic',
//       city: 'Bangalore',
//       locality: 'Whitefield',
//       establishmentType: 'Clinic',
//       fees: '400',
//       verified: true,
//       phoneNumber: '9876543212',
//       address: 'ITPL Main Road, Whitefield, Bangalore - 560066',
//       rating: 4.7,
//       totalReviews: 203,
//       amenities: ['Vaccination', 'Dental Care', 'Nutrition Counseling'],
//     },
//     veterinarianDetails: {
//       name: 'Vikram Patel',
//       experience: '15',
//       gender: 'Male',
//       specialization: 'General Physician',
//       profilePhotoUrl:
//         'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&h=200&auto=format&fit=crop',
//       qualifications: 'BVSc, PhD (Veterinary Medicine)',
//       languages: ['English', 'Hindi', 'Gujarati'],
//     },
//   },
// ];

// // Generate next 7 days
// const generateDates = () => {
//   const dates = [];
//   const today = new Date();
//   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const months = [
//     'Jan',
//     'Feb',
//     'Mar',
//     'Apr',
//     'May',
//     'Jun',
//     'Jul',
//     'Aug',
//     'Sep',
//     'Oct',
//     'Nov',
//     'Dec',
//   ];

//   for (let i = 0; i < 7; i++) {
//     const date = new Date(today);
//     date.setDate(today.getDate() + i);
//     dates.push({
//       id: i,
//       day: days[date.getDay()],
//       date: date.getDate(),
//       month: months[date.getMonth()],
//       fullDate: date,
//       label:
//         i === 0
//           ? 'Today'
//           : i === 1
//             ? 'Tomorrow'
//             : `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`,
//     });
//   }
//   return dates;
// };

// // Generate time slots
// const generateTimeSlots = () => {
//   const slots = {
//     morning: [],
//     afternoon: [],
//     evening: [],
//   };

//   // Morning: 9 AM - 12 PM
//   for (let hour = 9; hour < 12; hour++) {
//     slots.morning.push({
//       id: `${hour}:00`,
//       time: `${hour}:00 AM`,
//       available: Math.random() > 0.3,
//     });
//     slots.morning.push({
//       id: `${hour}:30`,
//       time: `${hour}:30 AM`,
//       available: Math.random() > 0.3,
//     });
//   }

//   // Afternoon: 12 PM - 5 PM
//   for (let hour = 12; hour < 17; hour++) {
//     const displayHour = hour > 12 ? hour - 12 : hour;
//     const period = 'PM';
//     slots.afternoon.push({
//       id: `${hour}:00`,
//       time: `${displayHour}:00 ${period}`,
//       available: Math.random() > 0.3,
//     });
//     slots.afternoon.push({
//       id: `${hour}:30`,
//       time: `${displayHour}:30 ${period}`,
//       available: Math.random() > 0.3,
//     });
//   }

//   // Evening: 5 PM - 9 PM
//   for (let hour = 17; hour < 21; hour++) {
//     const displayHour = hour - 12;
//     slots.evening.push({
//       id: `${hour}:00`,
//       time: `${displayHour}:00 PM`,
//       available: Math.random() > 0.3,
//     });
//     slots.evening.push({
//       id: `${hour}:30`,
//       time: `${displayHour}:30 PM`,
//       available: Math.random() > 0.3,
//     });
//   }

//   return slots;
// };

// // Booking Modal Component
// const BookingModal = ({ visible, onClose, clinic }) => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [petName, setPetName] = useState('');
//   const [petType, setPetType] = useState('');
//   const [symptoms, setSymptoms] = useState('');
//   const [step, setStep] = useState(1); // 1: Date, 2: Time, 3: Pet Details

//   const dates = generateDates();
//   const timeSlots = generateTimeSlots();

//   const handleBooking = () => {
//     if (!petName || !petType) {
//       Alert.alert('Missing Information', 'Please enter your pet details');
//       return;
//     }

//     Alert.alert(
//       'Booking Confirmed! 🎉',
//       `Your appointment is confirmed for ${selectedDate.label} at ${selectedSlot.time}\n\nDoctor: Dr. ${clinic.veterinarianDetails.name}\nClinic: ${clinic.clinicDetails.clinicName}\nPet: ${petName} (${petType})\nConsultation Fee: ₹${clinic.clinicDetails.fees}`,
//       [
//         {
//           text: 'OK',
//           onPress: () => {
//             onClose();
//             // Reset form
//             setStep(1);
//             setSelectedDate(null);
//             setSelectedSlot(null);
//             setPetName('');
//             setPetType('');
//             setSymptoms('');
//           },
//         },
//       ],
//     );
//   };

//   const renderDateSelection = () => (
//     <View style={styles.modalSection}>
//       <Text style={styles.modalSectionTitle}>Select Date</Text>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         {dates.map((date) => (
//           <TouchableOpacity
//             key={date.id}
//             style={[
//               styles.dateCard,
//               selectedDate?.id === date.id && styles.dateCardSelected,
//             ]}
//             onPress={() => {
//               setSelectedDate(date);
//               setStep(2);
//             }}
//           >
//             <Text
//               style={[
//                 styles.dateDay,
//                 selectedDate?.id === date.id && styles.dateTextSelected,
//               ]}
//             >
//               {date.day}
//             </Text>
//             <Text
//               style={[
//                 styles.dateNumber,
//                 selectedDate?.id === date.id && styles.dateTextSelected,
//               ]}
//             >
//               {date.date}
//             </Text>
//             <Text
//               style={[
//                 styles.dateMonth,
//                 selectedDate?.id === date.id && styles.dateTextSelected,
//               ]}
//             >
//               {date.month}
//             </Text>
//             {date.id === 0 && (
//               <View style={styles.todayBadge}>
//                 <Text style={styles.todayText}>Today</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );

//   const renderTimeSlots = (slots, title) => (
//     <View style={styles.slotSection}>
//       <Text style={styles.slotTitle}>{title}</Text>
//       <View style={styles.slotGrid}>
//         {slots.map((slot) => (
//           <TouchableOpacity
//             key={slot.id}
//             style={[
//               styles.slotCard,
//               !slot.available && styles.slotDisabled,
//               selectedSlot?.id === slot.id && styles.slotSelected,
//             ]}
//             onPress={() => slot.available && setSelectedSlot(slot)}
//             disabled={!slot.available}
//           >
//             <Text
//               style={[
//                 styles.slotTime,
//                 !slot.available && styles.slotTimeDisabled,
//                 selectedSlot?.id === slot.id && styles.slotTimeSelected,
//               ]}
//             >
//               {slot.time}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );

//   const renderTimeSelection = () => (
//     <View style={styles.modalSection}>
//       <View style={styles.selectedDateHeader}>
//         <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#24A1DE" />
//         </TouchableOpacity>
//         <Text style={styles.selectedDateText}>{selectedDate?.label}</Text>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {renderTimeSlots(timeSlots.morning, '🌅 Morning')}
//         {renderTimeSlots(timeSlots.afternoon, '☀️ Afternoon')}
//         {renderTimeSlots(timeSlots.evening, '🌙 Evening')}
//       </ScrollView>

//       {selectedSlot && (
//         <TouchableOpacity style={styles.continueBtn} onPress={() => setStep(3)}>
//           <Text style={styles.continueBtnText}>Continue to Pet Details</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   const renderPetDetails = () => (
//     <View style={styles.modalSection}>
//       <View style={styles.selectedDateHeader}>
//         <TouchableOpacity onPress={() => setStep(2)} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#24A1DE" />
//         </TouchableOpacity>
//         <Text style={styles.selectedDateText}>Pet Details</Text>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.appointmentSummary}>
//           <Text style={styles.summaryTitle}>Appointment Summary</Text>
//           <View style={styles.summaryRow}>
//             <Ionicons name="calendar" size={16} color="#666" />
//             <Text style={styles.summaryText}>{selectedDate?.label}</Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Ionicons name="time" size={16} color="#666" />
//             <Text style={styles.summaryText}>{selectedSlot?.time}</Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <MaterialIcons name="person" size={16} color="#666" />
//             <Text style={styles.summaryText}>
//               Dr. {clinic.veterinarianDetails.name}
//             </Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <MaterialIcons name="location-on" size={16} color="#666" />
//             <Text style={styles.summaryText}>
//               {clinic.clinicDetails.clinicName}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.formSection}>
//           <Text style={styles.formLabel}>Pet Name *</Text>
//           <TextInput
//             style={styles.formInput}
//             placeholder="Enter your pet's name"
//             value={petName}
//             onChangeText={setPetName}
//           />

//           <Text style={styles.formLabel}>Pet Type *</Text>
//           <View style={styles.petTypeGrid}>
//             {['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map((type) => (
//               <TouchableOpacity
//                 key={type}
//                 style={[
//                   styles.petTypeCard,
//                   petType === type && styles.petTypeSelected,
//                 ]}
//                 onPress={() => setPetType(type)}
//               >
//                 <Text
//                   style={[
//                     styles.petTypeText,
//                     petType === type && styles.petTypeTextSelected,
//                   ]}
//                 >
//                   {type}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text style={styles.formLabel}>Symptoms / Reason for Visit</Text>
//           <TextInput
//             style={[styles.formInput, styles.textArea]}
//             placeholder="Describe symptoms or reason for consultation"
//             value={symptoms}
//             onChangeText={setSymptoms}
//             multiline
//             numberOfLines={4}
//           />
//         </View>

//         <View style={styles.feeBreakdown}>
//           <Text style={styles.feeTitle}>Fee Breakdown</Text>
//           <View style={styles.feeRow}>
//             <Text style={styles.feeLabel}>Consultation Fee</Text>
//             <Text style={styles.feeValue}>₹{clinic.clinicDetails.fees}</Text>
//           </View>
//           <View style={styles.feeRow}>
//             <Text style={styles.feeLabel}>Booking Fee</Text>
//             <Text style={styles.feeFree}>FREE</Text>
//           </View>
//           <View style={styles.feeDivider} />
//           <View style={styles.feeRow}>
//             <Text style={styles.feeTotalLabel}>Total Amount</Text>
//             <Text style={styles.feeTotalValue}>
//               ₹{clinic.clinicDetails.fees}
//             </Text>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.confirmBtn} onPress={handleBooking}>
//           <Text style={styles.confirmBtnText}>Confirm Booking</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={false}
//       onRequestClose={onClose}
//     >
//       <SafeAreaView style={styles.modalContainer}>
//         <View style={styles.modalHeader}>
//           <TouchableOpacity onPress={onClose}>
//             <Ionicons name="close" size={28} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.modalTitle}>Book Appointment</Text>
//           <View style={{ width: 28 }} />
//         </View>

//         <View style={styles.doctorInfoBar}>
//           <Image
//             source={{ uri: clinic.veterinarianDetails.profilePhotoUrl }}
//             style={styles.modalProfileImage}
//           />
//           <View style={styles.doctorInfoText}>
//             <Text style={styles.modalDoctorName}>
//               Dr. {clinic.veterinarianDetails.name}
//             </Text>
//             <Text style={styles.modalSpecialization}>
//               {clinic.veterinarianDetails.specialization} •{' '}
//               {clinic.veterinarianDetails.experience} yrs exp
//             </Text>
//           </View>
//         </View>

//         {step === 1 && renderDateSelection()}
//         {step === 2 && renderTimeSelection()}
//         {step === 3 && renderPetDetails()}
//       </SafeAreaView>
//     </Modal>
//   );
// };

// // Clinic Card Component
// const ClinicCard = ({ clinic, onPress, onBookPress }) => {
//   const { clinicDetails, veterinarianDetails: vet } = clinic;

//   const handleCall = () => {
//     Linking.openURL(`tel:${clinicDetails.phoneNumber}`);
//   };

//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress}>
//       <View style={styles.cardTopSection}>
//         <Image
//           source={{ uri: vet?.profilePhotoUrl }}
//           style={styles.profileImage}
//         />
//         <View style={styles.mainInfo}>
//           <View style={styles.nameRow}>
//             <Text style={styles.drName}>Dr. {vet.name}</Text>
//             {clinicDetails.verified && (
//               <MaterialIcons name="verified" size={18} color="#10B981" />
//             )}
//           </View>
//           <Text style={styles.specializationText}>
//             Pet {vet.specialization}
//           </Text>
//           <Text style={styles.qualificationText}>{vet.qualifications}</Text>
//           <Text style={styles.expText}>{vet.experience} years experience</Text>

//           <View style={styles.locationRow}>
//             <MaterialIcons name="location-on" size={14} color="#666" />
//             <Text style={styles.locationText}>
//               {clinicDetails.locality}, {clinicDetails.city}
//             </Text>
//           </View>

//           <View style={styles.ratingRow}>
//             <View style={styles.ratingBadge}>
//               <MaterialIcons name="star" size={14} color="#FFA500" />
//               <Text style={styles.ratingText}>{clinicDetails.rating}</Text>
//             </View>
//             <Text style={styles.reviewsText}>
//               ({clinicDetails.totalReviews} reviews)
//             </Text>
//           </View>

//           <View style={styles.amenitiesRow}>
//             {clinicDetails.amenities.slice(0, 2).map((amenity, idx) => (
//               <View key={idx} style={styles.amenityBadge}>
//                 <Text style={styles.amenityText}>{amenity}</Text>
//               </View>
//             ))}
//             {clinicDetails.amenities.length > 2 && (
//               <Text style={styles.moreText}>
//                 +{clinicDetails.amenities.length - 2} more
//               </Text>
//             )}
//           </View>
//         </View>
//       </View>

//       <View style={styles.feeSection}>
//         <View style={styles.feeBox}>
//           <Text style={styles.feeLabel}>Consultation Fee</Text>
//           <Text style={styles.feeAmount}>₹{clinicDetails.fees}</Text>
//         </View>
//         <View style={styles.feeBadge}>
//           <Text style={styles.noFeeText}>No Booking Fee</Text>
//         </View>
//       </View>

//       <View style={styles.buttonWrapper}>
//         <TouchableOpacity style={styles.bookClinicBtn} onPress={onBookPress}>
//           <Ionicons name="calendar" size={20} color="white" />
//           <Text style={styles.bookClinicBtnText}>Book Clinic Visit</Text>
//         </TouchableOpacity>

//         <View style={styles.secondaryButtonsRow}>
//           <TouchableOpacity style={styles.contactBtn} onPress={handleCall}>
//             <Ionicons name="call" size={18} color="#24A1DE" />
//             <Text style={styles.contactBtnText}>Contact</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.videoBtn}
//             onPress={() => router.push('/pages/VideoCall')}
//           >
//             <Ionicons name="videocam" size={18} color="#24A1DE" />
//             <Text style={styles.contactBtnText}>Video Call</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// // Main Component
// export default function ClinicListScreen() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [location, setLocation] = useState('Bangalore');
//   const [selectedClinic, setSelectedClinic] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [filterType, setFilterType] = useState('All'); // All, Verified, Emergency

//   const filteredData = MOCK_CLINICS.filter((item) => {
//     const matchesSearch =
//       item.clinicDetails.clinicName
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       item.veterinarianDetails.name
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       item.veterinarianDetails.specialization
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase());

//     const matchesFilter =
//       filterType === 'All' ||
//       (filterType === 'Verified' && item.clinicDetails.verified) ||
//       (filterType === 'Emergency' &&
//         item.clinicDetails.amenities.some((a) => a.includes('Emergency')));

//     return matchesSearch && matchesFilter;
//   });

//   const handleBookPress = (clinic) => {
//     setSelectedClinic(clinic);
//     setModalVisible(true);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.searchHeader}>
//         <View style={styles.searchBox}>
//           <View style={styles.locationInput}>
//             <Ionicons name="location-outline" size={18} color="#7D7D7D" />
//             <TextInput
//               style={styles.input}
//               value={location}
//               onChangeText={setLocation}
//               placeholder="Location"
//             />
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.serviceInput}>
//             <Ionicons name="search-outline" size={18} color="#7D7D7D" />
//             <TextInput
//               style={styles.input}
//               placeholder="Search Vets, Clinics..."
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//           </View>
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.filterContainer}
//         >
//           {['All', 'Verified', 'Emergency'].map((filter) => (
//             <TouchableOpacity
//               key={filter}
//               style={[
//                 styles.filterChip,
//                 filterType === filter && styles.filterChipActive,
//               ]}
//               onPress={() => setFilterType(filter)}
//             >
//               <Text
//                 style={[
//                   styles.filterText,
//                   filterType === filter && styles.filterTextActive,
//                 ]}
//               >
//                 {filter}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       <View style={styles.resultsHeader}>
//         <Text style={styles.resultsText}>
//           {filteredData.length}{' '}
//           {filteredData.length === 1 ? 'Clinic' : 'Clinics'} Found
//         </Text>
//       </View>

//       <FlatList
//         data={filteredData}
//         renderItem={({ item }) => (
//           <ClinicCard
//             clinic={item}
//             onPress={() =>
//               router.push({
//                 pathname: '/pages/ClinicDetailScreen',
//                 params: { clinic: JSON.stringify(item) },
//               })
//             }
//             onBookPress={() => handleBookPress(item)}
//           />
//         )}
//         keyExtractor={(item) => item.clinicDetails._id}
//         contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <MaterialCommunityIcons name="stethoscope" size={80} color="#ccc" />
//             <Text style={styles.emptyText}>No clinics found</Text>
//             <Text style={styles.emptySubtext}>
//               Try adjusting your search or filters
//             </Text>
//           </View>
//         )}
//       />

//       {selectedClinic && (
//         <BookingModal
//           visible={modalVisible}
//           onClose={() => setModalVisible(false)}
//           clinic={selectedClinic}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f0f0f5' },
//   searchHeader: {
//     backgroundColor: '#28328c',
//     paddingBottom: 12,
//     paddingTop: 40,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderRadius: 8,
//     height: 48,
//     alignItems: 'center',
//     marginHorizontal: 12,
//     elevation: 2,
//   },
//   locationInput: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingLeft: 12,
//   },
//   serviceInput: {
//     flex: 2,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingLeft: 12,
//   },
//   divider: { width: 1, height: '60%', backgroundColor: '#ddd' },
//   input: { flex: 1, marginLeft: 6, fontSize: 14, color: '#333' },

//   filterContainer: {
//     marginTop: 10,
//     paddingHorizontal: 12,
//   },
//   filterChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     marginRight: 8,
//   },
//   filterChipActive: {
//     backgroundColor: 'white',
//   },
//   filterText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   filterTextActive: {
//     color: '#28328c',
//     fontWeight: 'bold',
//   },

//   resultsHeader: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   resultsText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },

//   card: {
//     backgroundColor: 'white',
//     marginBottom: 16,
//     borderRadius: 12,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   cardTopSection: { flexDirection: 'row', padding: 16 },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     borderWidth: 2,
//     borderColor: '#24A1DE',
//   },
//   mainInfo: { flex: 1, marginLeft: 12 },
//   nameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   drName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#24A1DE',
//     marginRight: 6,
//   },
//   specializationText: { fontSize: 14, color: '#666', marginBottom: 2 },
//   qualificationText: { fontSize: 12, color: '#999', marginBottom: 2 },
//   expText: { fontSize: 13, color: '#666', marginBottom: 6 },
//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   locationText: {
//     fontSize: 13,
//     color: '#666',
//     marginLeft: 4,
//   },
//   ratingRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   ratingBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF3E0',
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 4,
//   },
//   ratingText: {
//     color: '#F57C00',
//     fontSize: 13,
//     fontWeight: 'bold',
//     marginLeft: 3,
//   },
//   reviewsText: {
//     fontSize: 12,
//     color: '#999',
//     marginLeft: 6,
//   },
//   amenitiesRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     alignItems: 'center',
//   },
//   amenityBadge: {
//     backgroundColor: '#E3F2FD',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//     marginRight: 6,
//     marginTop: 4,
//   },
//   amenityText: {
//     fontSize: 11,
//     color: '#1976D2',
//     fontWeight: '500',
//   },
//   moreText: {
//     fontSize: 11,
//     color: '#24A1DE',
//     marginTop: 4,
//   },

//   feeSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#F5F5F5',
//     borderTopWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   feeBox: {},
//   feeLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 2,
//   },
//   feeAmount: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#24A1DE',
//   },
//   feeBadge: {
//     backgroundColor: '#10B981',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//   },
//   noFeeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },

//   buttonWrapper: { padding: 16 },
//   bookClinicBtn: {
//     backgroundColor: '#24A1DE',
//     borderRadius: 8,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   bookClinicBtnText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   secondaryButtonsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 10,
//   },
//   contactBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     borderWidth: 1.5,
//     borderColor: '#24A1DE',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   videoBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     borderWidth: 1.5,
//     borderColor: '#24A1DE',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   contactBtnText: {
//     color: '#24A1DE',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginLeft: 6,
//   },

//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#666',
//     marginTop: 16,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#999',
//     marginTop: 8,
//   },

//   // Modal Styles
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   doctorInfoBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#F5F5F5',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//   },
//   modalProfileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   doctorInfoText: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   modalDoctorName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#24A1DE',
//   },
//   modalSpecialization: {
//     fontSize: 13,
//     color: '#666',
//     marginTop: 2,
//   },
//   modalSection: {
//     flex: 1,
//     padding: 16,
//   },
//   modalSectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 16,
//   },

//   // Date Selection
//   dateCard: {
//     width: 80,
//     padding: 12,
//     marginRight: 12,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#E0E0E0',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
//   dateCardSelected: {
//     borderColor: '#24A1DE',
//     backgroundColor: '#E3F2FD',
//   },
//   dateDay: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },
//   dateNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginVertical: 4,
//   },
//   dateMonth: {
//     fontSize: 12,
//     color: '#999',
//   },
//   dateTextSelected: {
//     color: '#24A1DE',
//   },
//   todayBadge: {
//     backgroundColor: '#10B981',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginTop: 4,
//   },
//   todayText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },

//   selectedDateHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   backButton: {
//     marginRight: 12,
//   },
//   selectedDateText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },

//   // Time Slots
//   slotSection: {
//     marginBottom: 24,
//   },
//   slotTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 12,
//   },
//   slotGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   slotCard: {
//     width: (width - 52) / 3,
//     paddingVertical: 12,
//     borderRadius: 8,
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
//   slotSelected: {
//     borderColor: '#24A1DE',
//     backgroundColor: '#E3F2FD',
//   },
//   slotDisabled: {
//     backgroundColor: '#F5F5F5',
//     borderColor: '#E0E0E0',
//   },
//   slotTime: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   slotTimeSelected: {
//     color: '#24A1DE',
//   },
//   slotTimeDisabled: {
//     color: '#ccc',
//   },

//   continueBtn: {
//     backgroundColor: '#24A1DE',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   continueBtnText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // Pet Details Form
//   appointmentSummary: {
//     backgroundColor: '#F5F5F5',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 20,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 12,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   summaryText: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 8,
//   },

//   formSection: {
//     marginBottom: 20,
//   },
//   formLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//     marginTop: 12,
//   },
//   formInput: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 14,
//     color: '#333',
//     backgroundColor: 'white',
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },

//   petTypeGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   petTypeCard: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     backgroundColor: 'white',
//   },
//   petTypeSelected: {
//     borderColor: '#24A1DE',
//     backgroundColor: '#E3F2FD',
//   },
//   petTypeText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },
//   petTypeTextSelected: {
//     color: '#24A1DE',
//     fontWeight: 'bold',
//   },

//   // Fee Breakdown
//   feeBreakdown: {
//     backgroundColor: '#F5F5F5',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 20,
//   },
//   feeTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 12,
//   },
//   feeRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   feeLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   feeValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   feeFree: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#10B981',
//   },
//   feeDivider: {
//     height: 1,
//     backgroundColor: '#E0E0E0',
//     marginVertical: 8,
//   },
//   feeTotalLabel: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   feeTotalValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#24A1DE',
//   },

//   confirmBtn: {
//     backgroundColor: '#10B981',
//     paddingVertical: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   confirmBtnText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  SafeAreaView,
  Linking,
  Modal,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { router } from 'expo-router';
import CommonHeader from '../../../components/CommonHeader';
import { useSelector, useDispatch } from 'react-redux';
import { getAllVerifiedClinics } from '../../../store/slices/authSlice';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

// --- MOCK DATA ---
const MOCK_CLINICS = [
  {
    clinicDetails: {
      _id: '1',
      clinicName: 'Happy Paws Vet Care',
      city: 'Bangalore',
      locality: 'Indiranagar',
      establishmentType: 'Multi-speciality Clinic',
      fees: '450',
      verified: true,
      phoneNumber: '9876543210',
      address: '123, 5th Main Road, Indiranagar, Bangalore - 560038',
      rating: 4.8,
      totalReviews: 156,
      amenities: ['Emergency Care', 'Surgery', 'Grooming', 'Vaccination'],
    },
    veterinarianDetails: {
      name: 'Rahul Sharma',
      experience: '12',
      gender: 'Male',
      specialization: 'Surgeon',
      profilePhotoUrl:
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop',
      qualifications: 'BVSc, MVSc (Surgery)',
      languages: ['English', 'Hindi', 'Kannada'],
    },
  },
  {
    clinicDetails: {
      _id: '2',
      clinicName: 'Pet Wellness Center',
      city: 'Bangalore',
      locality: 'Koramangala',
      establishmentType: 'Pet Hospital',
      fees: '600',
      verified: true,
      phoneNumber: '9876543211',
      address: '45, 80 Feet Road, Koramangala, Bangalore - 560095',
      rating: 4.6,
      totalReviews: 98,
      amenities: ['24/7 Emergency', 'ICU', 'Lab Services', 'Pet Pharmacy'],
    },
    veterinarianDetails: {
      name: 'Aditi Rao',
      experience: '8',
      gender: 'Female',
      specialization: 'Dermatologist',
      profilePhotoUrl:
        'https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=200&h=200&auto=format&fit=crop',
      qualifications: 'BVSc, MVSc (Dermatology)',
      languages: ['English', 'Hindi', 'Tamil'],
    },
  },
  {
    clinicDetails: {
      _id: '3',
      clinicName: 'Furry Friends Clinic',
      city: 'Bangalore',
      locality: 'Whitefield',
      establishmentType: 'Clinic',
      fees: '400',
      verified: true,
      phoneNumber: '9876543212',
      address: 'ITPL Main Road, Whitefield, Bangalore - 560066',
      rating: 4.7,
      totalReviews: 203,
      amenities: ['Vaccination', 'Dental Care', 'Nutrition Counseling'],
    },
    veterinarianDetails: {
      name: 'Vikram Patel',
      experience: '15',
      gender: 'Male',
      specialization: 'General Physician',
      profilePhotoUrl:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&h=200&auto=format&fit=crop',
      qualifications: 'BVSc, PhD (Veterinary Medicine)',
      languages: ['English', 'Hindi', 'Gujarati'],
    },
  },
];

// Generate next 30 days for calendar
const generateCalendarDays = () => {
  const days = [];
  const today = new Date();
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      id: i,
      dayName: dayNames[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      monthShort: months[date.getMonth()].substring(0, 3),
      fullDate: date,
      isToday: i === 0,
    });
  }
  return days;
};

// Generate time slots
const generateTimeSlots = () => {
  const slots = [];
  
  // Morning: 9 AM - 12 PM
  for (let hour = 9; hour < 12; hour++) {
    slots.push({
      id: `${hour}:00`,
      time: `${hour}:00 AM`,
      period: 'morning',
      available: Math.random() > 0.3,
    });
    slots.push({
      id: `${hour}:30`,
      time: `${hour}:30 AM`,
      period: 'morning',
      available: Math.random() > 0.3,
    });
  }

  // Afternoon: 12 PM - 5 PM
  for (let hour = 12; hour < 17; hour++) {
    const displayHour = hour > 12 ? hour - 12 : hour;
    const period = 'PM';
    slots.push({
      id: `${hour}:00`,
      time: `${displayHour}:00 ${period}`,
      period: 'afternoon',
      available: Math.random() > 0.3,
    });
    slots.push({
      id: `${hour}:30`,
      time: `${displayHour}:30 ${period}`,
      period: 'afternoon',
      available: Math.random() > 0.3,
    });
  }

  // Evening: 5 PM - 9 PM
  for (let hour = 17; hour < 21; hour++) {
    const displayHour = hour - 12;
    slots.push({
      id: `${hour}:00`,
      time: `${displayHour}:00 PM`,
      period: 'evening',
      available: Math.random() > 0.3,
    });
    slots.push({
      id: `${hour}:30`,
      time: `${displayHour}:30 PM`,
      period: 'evening',
      available: Math.random() > 0.3,
    });
  }

  return slots;
};

// Enhanced Booking Modal Component
const BookingModal = ({ visible, onClose, clinic }) => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [bookingReason, setBookingReason] = useState('');
  const [selectedVet, setSelectedVet] = useState(clinic.veterinarianDetails.name);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('February');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [additionalNote, setAdditionalNote] = useState('');
  const [usePawPoints, setUsePawPoints] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const calendarDays = generateCalendarDays();
  const timeSlots = generateTimeSlots();

  // Mock pets data
  const pets = [
    { id: 1, name: 'Buddy', type: 'Dog', icon: '🐕' },
    { id: 2, name: 'Whiskers', type: 'Cat', icon: '🐱' },
    { id: 3, name: 'Max', type: 'Dog', icon: '🐕' },
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  const calculateTotal = () => {
    const baseFee = parseInt(clinic.clinicDetails.fees);
    const discount = usePawPoints ? 50 : 0;
    const couponDiscount = couponCode ? 50 : 0;
    return baseFee - discount - couponDiscount;
  };

  const handleConfirmBooking = () => {
    if (!selectedPet || !selectedDate || !selectedSlot) {
      Alert.alert('Incomplete Information', 'Please fill all required fields');
      return;
    }

    Alert.alert(
      'Booking Confirmed! 🎉',
      `Your appointment has been confirmed!\n\nPet: ${selectedPet.name}\nDate: ${selectedDate.monthShort} ${selectedDate.date}\nTime: ${selectedSlot.time}\nDoctor: Dr. ${selectedVet}\nTotal: ₹${calculateTotal()}`,
      [
        {
          text: 'OK',
          onPress: () => {
            onClose();
            // Reset form
            setSelectedPet(null);
            setBookingReason('');
            setSelectedDate(null);
            setSelectedSlot(null);
            setAdditionalNote('');
            setUsePawPoints(false);
            setCouponCode('');
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={styles.headerTitle}>Pet Info</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Booking For Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Booking for</Text>
            <View style={styles.petSelectionRow}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petCard,
                    selectedPet?.id === pet.id && styles.petCardSelected,
                  ]}
                  onPress={() => setSelectedPet(pet)}
                >
                  <Text style={styles.petIcon}>{pet.icon}</Text>
                  <Text style={styles.petName}>{pet.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addPetCard}>
                <Ionicons name="add-circle-outline" size={32} color="#24A1DE" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Booking Reasons */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Booking reasons</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Type to search and select reasons"
              value={bookingReason}
              onChangeText={setBookingReason}
            />
          </View>

          {/* Additional Note */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Additional Note</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Type here"
              value={additionalNote}
              onChangeText={setAdditionalNote}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Select Vet */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Select Vet</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{selectedVet}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Appointment Date */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Appointment Date</Text>
              <TouchableOpacity style={styles.monthSelector}>
                <Text style={styles.monthText}>{selectedMonth}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.calendarScroll}
            >
              {calendarDays.map((day) => (
                <TouchableOpacity
                  key={day.id}
                  style={[
                    styles.calendarDay,
                    selectedDate?.id === day.id && styles.calendarDaySelected,
                  ]}
                  onPress={() => setSelectedDate(day)}
                >
                  <Text
                    style={[
                      styles.dayName,
                      selectedDate?.id === day.id && styles.dayNameSelected,
                    ]}
                  >
                    {day.dayName}
                  </Text>
                  <Text
                    style={[
                      styles.dayDate,
                      selectedDate?.id === day.id && styles.dayDateSelected,
                    ]}
                  >
                    {day.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Appointment Slot */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Appointment Slot</Text>
            <Text style={styles.helperText}>Please select vet first</Text>
            
            <View style={styles.slotsContainer}>
              {timeSlots.filter(slot => slot.available).slice(0, 8).map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlot,
                    selectedSlot?.id === slot.id && styles.timeSlotSelected,
                  ]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedSlot?.id === slot.id && styles.timeSlotTextSelected,
                    ]}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* PawPoints Section */}
          <TouchableOpacity
            style={styles.pawPointsSection}
            onPress={() => setUsePawPoints(!usePawPoints)}
          >
            <View style={styles.pawPointsLeft}>
              <View style={styles.checkbox}>
                {usePawPoints && (
                  <Ionicons name="checkmark" size={16} color="#24A1DE" />
                )}
              </View>
              <Text style={styles.pawPointsText}>Pay using PawPoints</Text>
            </View>
            <View style={styles.pawPointsRight}>
              <Text style={styles.balanceLabel}>Current Balance:</Text>
              <Text style={styles.balanceAmount}>₹0</Text>
            </View>
          </TouchableOpacity>

          {usePawPoints && (
            <View style={styles.savingsNotice}>
              <Text style={styles.savingsText}>
                You can save max ₹0 by using PawPoints
              </Text>
            </View>
          )}

          {/* Apply Coupon */}
          <TouchableOpacity style={styles.couponSection}>
            <Ionicons name="ticket-outline" size={20} color="#10B981" />
            <Text style={styles.couponText}>Apply Coupon</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          {/* Summary Section */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Summary:</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Clinic Consultation Fees:</Text>
              <Text style={styles.summaryValue}>₹{clinic.clinicDetails.fees}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discounts Applied</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summarySubLabel}>MRP Discount:</Text>
              <Text style={styles.discountValue}>-₹0</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summarySubLabel}>Coupon Discount:</Text>
              <Text style={styles.discountValue}>-₹0</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summarySubLabel}>PawPoints Discount:</Text>
              <Text style={styles.discountValue}>-₹{usePawPoints ? 50 : 0}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summarySubLabel}>Total Discount:</Text>
              <Text style={styles.discountValue}>-₹{usePawPoints ? 50 : 0}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summarySubLabel}>Instant Discount(75%):</Text>
              <Text style={styles.instantDiscount}>-₹{Math.floor(calculateTotal() * 0.05)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summarySubLabel}>Cashback PawPoints(5%):</Text>
              <Text style={styles.cashback}>+₹{Math.floor(calculateTotal() * 0.05)}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total:</Text>
              <Text style={styles.grandTotalValue}>₹{calculateTotal()}</Text>
            </View>
          </View>

          {/* Savings Banner */}
          <View style={styles.savingsBanner}>
            <Text style={styles.savingsBannerText}>
              Congratulations! You have saved ₹{usePawPoints ? 50 : 0}
            </Text>
          </View>

          {/* Payment Method */}
          <View style={styles.paymentSection}>
            <View style={styles.paymentRow}>
              <Ionicons name="card-outline" size={20} color="#666" />
              <Text style={styles.paymentLabel}>PAY USING</Text>
            </View>
            <View style={styles.paymentRow}>
              <Ionicons name="cash-outline" size={20} color="#666" />
              <Text style={styles.paymentMethod}>Razorpay</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmBooking}
          >
            <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Clinic Card Component
const ClinicCard = ({ clinic, onPress, userLocation, locationPermission }) => {
  const { clinicDetails, veterinarianDetails: vet } = clinic;

  if (!clinicDetails) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Header with Clinic Name and Badge */}
      <View style={styles.cardHeader}>
        <View style={styles.clinicHeaderLeft}>
          <Text style={styles.clinicName} numberOfLines={1}>
            {clinicDetails.clinicName}
          </Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{clinicDetails.establishmentType}</Text>
          </View>
        </View>
        {clinicDetails.verified && (
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={16} color="#10B981" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      {/* Doctor Information Section */}
      <View style={styles.doctorSection}>
        <Image
          source={{ 
            uri: vet?.profilePhotoUrl && vet.profilePhotoUrl.startsWith('http') 
              ? vet.profilePhotoUrl 
              : 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop'
          }}
          style={styles.profileImage}
        />
        <View style={styles.doctorInfo}>
          <Text style={styles.drName}>Dr. {vet?.name || 'Veterinarian'}</Text>
          <Text style={styles.specializationText}>
            {vet?.specialization || 'General'} • {vet?.experience || '0'} yrs exp
          </Text>
          <Text style={styles.qualificationText} numberOfLines={1}>
            {vet?.qualifications || 'BVSc'}
          </Text>
        </View>
      </View>

      {/* Location and Rating Row */}
      <View style={styles.infoRow}>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={16} color="#24A1DE" />
          <Text style={styles.locationText} numberOfLines={1}>
            {clinicDetails?.locality || clinicDetails?.city || 'Location'}
          </Text>
        </View>
        
        {/* Distance Display */}
        {clinicDetails?.distance && (
          <View style={styles.distanceContainer}>
            <MaterialIcons name="near-me" size={14} color="#1976D2" />
            <Text style={styles.distanceText}>{clinicDetails.distance} km</Text>
          </View>
        )}
        
        {/* Distance Unavailable */}
        {!clinicDetails?.distance && locationPermission && (
          <View style={[styles.distanceContainer, { backgroundColor: '#FFEBEE' }]}>
            <MaterialIcons name="location-off" size={14} color="#D32F2F" />
            <Text style={[styles.distanceText, { color: '#D32F2F' }]}>Distance unavailable</Text>
          </View>
        )}
        
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FFA500" />
          <Text style={styles.ratingText}>{clinicDetails?.rating || '4.5'}</Text>
          <Text style={styles.reviewsText}>({clinicDetails?.totalReviews || '0'})</Text>
        </View>
      </View>

      {/* Amenities Section */}
      <View style={styles.amenitiesSection}>
        <View style={styles.amenitiesRow}>
          {(clinicDetails?.amenities || []).slice(0, 3).map((amenity, idx) => (
            <View key={idx} style={styles.amenityChip}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
        {(clinicDetails?.amenities?.length || 0) > 3 && (
          <Text style={styles.moreAmenities}>
            +{clinicDetails.amenities.length - 3} more facilities
          </Text>
        )}
      </View>

      {/* Fee and Actions Section */}
      <View style={styles.footerSection}>
        <View style={styles.feeContainer}>
          <Text style={styles.feeLabel}>Consultation</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeAmount}>₹{clinicDetails?.fees || '500'}</Text>
            <View style={styles.noBookingFeeBadge}>
              <Text style={styles.noFeeText}>No Booking Fee</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Main Component
export default function ClinicListScreen() {
  const dispatch = useDispatch();
  const verifiedClinics = useSelector(state => state.auth?.verifiedClinics?.data || []);
  const loading = useSelector(state => state.auth?.verifiedClinics?.loading || false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  // Get user location
  const getUserLocation = async () => {
    try {
      console.log('📍 Getting user location...');
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('❌ Location permission denied');
        Alert.alert(
          'Location Permission',
          'Please enable location permission to see nearby clinics with distance.',
          [{ text: 'OK' }]
        );
        setLocationPermission(false);
        console.log('🚀 Dispatching API call without location...');
        dispatch(getAllVerifiedClinics());
        return null;
      }

      setLocationPermission(true);
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const userLoc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      console.log(`📍 User location obtained: ${userLoc.latitude}, ${userLoc.longitude}`);
      setUserLocation(userLoc);
      
      // Clear existing clinics data first
      console.log('🧹 Clearing existing clinics data...');
      
      // Dispatch API call with location immediately
      console.log('🚀 Dispatching API call with location...');
      const locationParams = {
        userLat: userLoc.latitude,
        userLon: userLoc.longitude
      };
      console.log('📊 Location params:', locationParams);
      
      await dispatch(getAllVerifiedClinics(locationParams));
      
      return userLoc;
    } catch (error) {
      console.error('❌ Error getting location:', error);
      setLocationPermission(false);
      // Dispatch API call without location
      console.log('🚀 Dispatching API call without location (error case)...');
      dispatch(getAllVerifiedClinics());
      return null;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 ClinicListScreen focused - calling getUserLocation');
      getUserLocation();
    }, [])
  );

  const filteredData = verifiedClinics.filter((item) => {
    if (!item.clinicDetails) return false;
    
    const clinicName = item.clinicDetails.clinicName?.toLowerCase() || '';
    const vetName = item.veterinarianDetails?.name?.toLowerCase() || '';
    const vetSpec = item.veterinarianDetails?.specialization?.toLowerCase() || '';
    const clinicCity = item.clinicDetails.city?.toLowerCase() || '';
    const clinicLocality = item.clinicDetails.locality?.toLowerCase() || '';
    
    const search = searchQuery.toLowerCase();
    const loc = location.toLowerCase();
    
    const matchesSearch = !searchQuery || 
      clinicName.includes(search) ||
      vetName.includes(search) ||
      vetSpec.includes(search);
    
    const matchesLocation = !location || location === 'All' ||
      clinicCity.includes(loc) ||
      clinicLocality.includes(loc);

    const matchesFilter =
      filterType === 'All' ||
      (filterType === 'Verified' && item.clinicDetails.verified) ||
      (filterType === 'Emergency' &&
        item.clinicDetails.amenities?.some((a) => a.includes('Emergency')));

    return matchesSearch && matchesLocation && matchesFilter;
  });

  const handleBookPress = (clinic) => {
    setSelectedClinic(clinic);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="Find Clinics" />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#24A1DE" />
          <Text style={styles.loadingText}>Loading clinics...</Text>
        </View>
      ) : (
        <>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <View style={styles.locationInput}>
            <Ionicons name="location-outline" size={20} color="#24A1DE" />
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Location"
              placeholderTextColor="#999"
              underlineColorAndroid="transparent"
              selectionColor="#24A1DE"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.serviceInput}>
            <Ionicons name="search-outline" size={20} color="#24A1DE" />
            <TextInput
              style={styles.input}
              placeholder="Search Vets, Clinics..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
              underlineColorAndroid="transparent"
              selectionColor="#24A1DE"
            />
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {['All', 'Verified', 'Emergency'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                filterType === filter && styles.filterChipActive,
              ]}
              onPress={() => setFilterType(filter)}
            >
              {filter === 'Verified' && filterType === filter && (
                <MaterialIcons name="verified" size={14} color="#24A1DE" style={{ marginRight: 4 }} />
              )}
              {filter === 'Emergency' && filterType === filter && (
                <MaterialIcons name="local-hospital" size={14} color="#24A1DE" style={{ marginRight: 4 }} />
              )}
              <Text
                style={[
                  styles.filterText,
                  filterType === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredData.length} {filteredData.length === 1 ? 'Clinic' : 'Clinics'}
        </Text>
        {location && <Text style={styles.resultsSubtext}>near {location}</Text>}
      </View>

      {/* Clinic List */}
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <ClinicCard
            clinic={item}
            userLocation={userLocation}
            locationPermission={locationPermission}
            onPress={() =>
              router.push({
                pathname: 'pages/ClinicDetailScreen',
                params: {
                  clinicId: item.clinicDetails?._id || item._id,
                  vetId: item.veterinarianDetails?.vetId || item.veterinarianDetails?._id || item.clinicDetails?._id,
                  clinicName: item.clinicDetails?.clinicName,
                  establishmentType: item.clinicDetails?.establishmentType,
                  city: item.clinicDetails?.city,
                  locality: item.clinicDetails?.locality,
                  streetAddress: item.clinicDetails?.streetAddress,
                  distance: item.clinicDetails?.distance || item.distance,
                  profilePhotoUrl: item.veterinarianDetails?.profilePhotoUrl || item.profilePhotoUrl,
                  fees: item.clinicDetails?.fees || '500',
                  vetName: item.veterinarianDetails?.name || 'Veterinarian',
                  specialization: item.veterinarianDetails?.specialization || 'General Practice',
                  experience: item.veterinarianDetails?.experience || '5'
                }
              })
            }
          />
        )}
        keyExtractor={(item) => item.clinicDetails._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="stethoscope" size={80} color="#E0E0E0" />
            <Text style={styles.emptyText}>No clinics found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      />

      {/* Booking Modal */}
      {selectedClinic && (
        <BookingModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          clinic={selectedClinic}
        />
      )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Search Header Styles
  searchHeader: {
    backgroundColor: 'white',
    paddingBottom: 16,
    paddingTop: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  locationInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  serviceInput: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#D0D0D0',
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    outlineStyle: 'none',
  },

  // Filter Chips
  filterContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#24A1DE',
  },
  filterText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#24A1DE',
    fontWeight: '700',
  },

  // Results Header
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  resultsSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },

  // List Content
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },

  // Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  clinicHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  clinicName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
    color: '#1976D2',
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 3,
  },

  // Doctor Section
  doctorSection: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 12,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: '#24A1DE',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  drName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#24A1DE',
    marginBottom: 4,
  },
  specializationText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
    fontWeight: '500',
  },
  qualificationText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976D2',
    marginLeft: 3,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F57C00',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },

  // Amenities Section
  amenitiesSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  amenityText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 4,
  },
  moreAmenities: {
    fontSize: 12,
    color: '#24A1DE',
    marginTop: 8,
    fontWeight: '600',
  },

  // Footer Section
  footerSection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#24A1DE',
    marginRight: 8,
  },
  noBookingFeeBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  noFeeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },



  // Empty State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },

  // === ENHANCED BOOKING MODAL STYLES ===
  modalContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  modalHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  modalContent: {
    flex: 1,
  },

  // Section Styles
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  // Pet Selection
  petSelectionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  petCard: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  petCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF4F0',
  },
  petIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  petName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  addPetCard: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#24A1DE',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
  },

  // Text Inputs
  textInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  // Dropdown
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  // Month Selector
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  monthText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },

  // Calendar
  calendarScroll: {
    marginTop: 8,
  },
  calendarDay: {
    width: 60,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  calendarDaySelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  dayNameSelected: {
    color: 'white',
  },
  dayDate: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  dayDateSelected: {
    color: 'white',
  },

  // Time Slots
  helperText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  timeSlotSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  timeSlotTextSelected: {
    color: 'white',
  },

  // PawPoints
  pawPointsSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pawPointsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#24A1DE',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawPointsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  pawPointsRight: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 11,
    color: '#999',
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },

  // Savings Notice
  savingsNotice: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  },

  // Coupon Section
  couponSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
    marginLeft: 10,
  },

  // Summary Section
  summarySection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  summarySubLabel: {
    fontSize: 13,
    color: '#666',
  },
  discountValue: {
    fontSize: 13,
    color: '#FF6B35',
    fontWeight: '600',
  },
  instantDiscount: {
    fontSize: 13,
    color: '#FF6B35',
    fontWeight: '600',
  },
  cashback: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF6B35',
  },

  // Savings Banner
  savingsBanner: {
    backgroundColor: '#10B981',
    padding: 14,
    marginBottom: 8,
  },
  savingsBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },

  // Payment Section
  paymentSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 80,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  paymentMethod: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
