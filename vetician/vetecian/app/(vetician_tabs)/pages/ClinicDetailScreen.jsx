// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   Alert,
//   Pressable,
//   StyleSheet,
//   Platform,
//   FlatList,
//   ActivityIndicator
// } from 'react-native';
// import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
// import { router, useLocalSearchParams } from 'expo-router';
// import { useDispatch, useSelector } from 'react-redux';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Camera } from 'lucide-react-native';
// import { X } from 'lucide-react-native';
// import { bookAppointment } from '../../../store/slices/authSlice';
// import { getPetsByUserId } from '../../../store/slices/authSlice';

// const PET_TYPES = {
//   Dog: 'dog',
//   Cat: 'cat',
//   Bird: 'crow',
//   Fish: 'fish',
//   Rabbit: 'rabbit',
//   Hamster: 'hamster',
//   default: 'paw'
// };

// const PetCard = ({ pet, selected, onPress }) => {
//   const getPetIcon = () => {
//     return PET_TYPES[pet.species] || PET_TYPES.default;
//   };

//   return (
//     <TouchableOpacity 
//       style={[styles.petCard, selected && styles.selectedPetCard]} 
//       onPress={onPress}
//     >
//       <View style={styles.petImageContainer}>
//         {pet?.petPhoto ? (
//           <Image source={{ uri: pet.petPhoto }} style={styles.petImage} />
//         ) : (
//           <View style={styles.petImagePlaceholder}>
//             <FontAwesome5
//               name={getPetIcon()}
//               size={24}
//               color="#4E8D7C"
//             />
//           </View>
//         )}
//       </View>

//       <View style={styles.petInfo}>
//         <Text style={styles.petName}>{pet.name}</Text>
//         <View style={styles.petDetails}>
//           <Text style={styles.petType}>{pet.species}</Text>
//           {pet.breed && <Text style={styles.petBreed}> • {pet.breed}</Text>}
//         </View>
//       </View>

//       {selected && (
//         <View style={styles.selectedIndicator}>
//           <MaterialIcons name="check-circle" size={24} color="#4E8D7C" />
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// };

// const ClinicDetailScreen = () => {
//   const dispatch = useDispatch();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [bookingType, setBookingType] = useState('in-clinic');
//   const [errors, setErrors] = useState({});
//   const [selectedPets, setSelectedPets] = useState([]);
//   const [loadingPets, setLoadingPets] = useState(false);
//   const [petModalVisible, setPetModalVisible] = useState(false);

//   const [formData, setFormData] = useState({
//     illness: '',
//     date: new Date(),
//     contactInfo: '',
//   });

//   const pets = useSelector(state => state.auth?.userPets?.data || []);

//   const params = useLocalSearchParams();
//   let clinic;
//   try {
//     clinic = params?.clinic ? JSON.parse(params.clinic) : null;
//   } catch (e) {
//     console.error("Error parsing clinic data:", e);
//   }

//   useEffect(() => {
//     if (petModalVisible) {
//       fetchPets();
//     }
//   }, [petModalVisible]);

//   const fetchPets = async () => {
//     try {
//       setLoadingPets(true);
//       await dispatch(getPetsByUserId()).unwrap();
//     } catch (err) {
//       Alert.alert('Error', 'Failed to load pets');
//     } finally {
//       setLoadingPets(false);
//     }
//   };

//   const handleInputChange = (name, value) => {
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: null,
//       });
//     }
//   };

//   const handleDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || formData.date;
//     setShowDatePicker(Platform.OS === 'ios');
//     setFormData({
//       ...formData,
//       date: currentDate,
//     });
//   };

//   const togglePetSelection = (petId) => {
//     setSelectedPets(prev => 
//       prev.includes(petId) 
//         ? prev.filter(id => id !== petId) 
//         : [...prev, petId]
//     );
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (selectedPets.length === 0) newErrors.pets = 'Please select at least one pet';
//     if (!formData.contactInfo) newErrors.contactInfo = 'Contact info is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       const bookingData = {
//         clinicId: clinic.clinicDetails.clinicId,
//         veterinarianId: clinic.veterinarianDetails?.vetId,
//         petIds: selectedPets,
//         illness: formData.illness.trim(),
//         date: formData.date.toISOString(),
//         bookingType,
//         contactInfo: formData.contactInfo.trim(),
//       };
      
//       console.log("bookingData =>", bookingData);
      
//       // In a real app, you would dispatch the booking action here
//       // const result = await dispatch(bookAppointment(bookingData)).unwrap();
      
//       // For now, just navigate to payment
//       router.navigate('/pages/paymentSection');
      
//     } catch (error) {
//       Alert.alert('Error', error.message || 'An error occurred while booking the appointment');
//     }
//   };

//   const renderTimings = () => {
//     if (!clinic?.clinicDetails?.timings) return null;

//     const days = [
//       { key: 'mon', label: 'Monday' },
//       { key: 'tue', label: 'Tuesday' },
//       { key: 'wed', label: 'Wednesday' },
//       { key: 'thu', label: 'Thursday' },
//       { key: 'fri', label: 'Friday' },
//       { key: 'sat', label: 'Saturday' },
//       { key: 'sun', label: 'Sunday' }
//     ];

//     return days.map(day => {
//       const timing = clinic.clinicDetails.timings[day.key];
//       if (!timing || !timing.start) return null;

//       return (
//         <View key={day.key} style={styles.timingRow}>
//           <Text style={styles.timingDay}>{day.label}</Text>
//           <Text style={styles.timingHours}>
//             {timing.start} - {timing.end}
//           </Text>
//           <Text style={styles.timingType}>
//             ({timing.type})
//           </Text>
//         </View>
//       );
//     });
//   };

//   if (!clinic?.clinicDetails) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>Clinic data not available</Text>
//       </View>
//     );
//   }

//   const clinicDetails = clinic.clinicDetails;
//   const vetDetails = clinic.veterinarianDetails;

//   return (
//     <View style={styles.fullContainer}>
//       <View style={styles.headerContainer}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <MaterialIcons name="arrow-back" size={24} color="#4E8D7C" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.clinicName}>{clinicDetails.clinicName}</Text>
//           <View style={styles.verifiedBadge}>
//             <MaterialIcons
//               name="verified"
//               size={18}
//               color={clinicDetails.verified ? "#4E8D7C" : "#E67C00"}
//             />
//             <Text style={styles.verifiedText}>
//               {clinicDetails.verified ? "Verified Clinic" : "Verification Pending"}
//             </Text>
//           </View>
//         </View>

//         <Text style={styles.establishmentType}>
//           {clinicDetails.establishmentType}
//         </Text>

//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <MaterialIcons name="location-on" size={20} color="#4E8D7C" />
//             <Text style={styles.sectionTitle}>Address</Text>
//           </View>
//           <Text style={styles.address}>
//             {clinicDetails.streetAddress || 'Address not specified'}
//           </Text>
//           <Text style={styles.location}>
//             {clinicDetails.locality}, {clinicDetails.city}
//           </Text>
//         </View>

//         {vetDetails && (
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <MaterialIcons name="person" size={20} color="#4E8D7C" />
//               <Text style={styles.sectionTitle}>Veterinarian</Text>
//             </View>

//             <View style={styles.vetContainer}>
//               {vetDetails.profilePhotoUrl ? (
//                 <Image
//                   source={{ uri: vetDetails.profilePhotoUrl }}
//                   style={styles.vetImage}
//                 />
//               ) : (
//                 <View style={styles.vetPlaceholder}>
//                   <MaterialIcons name="person" size={32} color="#4E8D7C" />
//                 </View>
//               )}

//               <View style={styles.vetInfo}>
//                 <Text style={styles.vetName}>
//                   {vetDetails.title} {vetDetails.name}
//                 </Text>
//                 <Text style={styles.vetSpecialty}>
//                   {vetDetails.specialization}
//                 </Text>
//                 <Text style={styles.vetExperience}>
//                   {vetDetails.experience} years experience
//                 </Text>
//               </View>
//             </View>
//           </View>
//         )}

//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <MaterialIcons name="currency-rupee" size={20} color="#4E8D7C" />
//             <Text style={styles.sectionTitle}>Consultation Fees</Text>
//           </View>
//           <Text style={styles.fees}>
//             ₹{clinicDetails.fees || 'Not specified'}
//           </Text>
//         </View>

//         {clinicDetails.timings && (
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <MaterialIcons name="access-time" size={20} color="#4E8D7C" />
//               <Text style={styles.sectionTitle}>Consultation Hours</Text>
//             </View>
//             {renderTimings()}
//           </View>
//         )}
//       </ScrollView>

//       <TouchableOpacity
//         style={styles.bookButton}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.bookButtonText}>Book Appointment</Text>
//       </TouchableOpacity>

//       {/* Booking Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Book Appointment</Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <MaterialIcons name="close" size={24} color="#4E8D7C" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.modalBody}>
//               <Text style={styles.inputLabel}>Select Pets *</Text>
//               <TouchableOpacity 
//                 style={styles.selectPetsButton}
//                 onPress={() => setPetModalVisible(true)}
//               >
//                 <Text style={styles.selectPetsButtonText}>
//                   {selectedPets.length > 0 
//                     ? `${selectedPets.length} pet${selectedPets.length > 1 ? 's' : ''} selected`
//                     : 'Tap to select pets'}
//                 </Text>
//                 <MaterialIcons name="pets" size={20} color="#4E8D7C" />
//               </TouchableOpacity>
//               {errors.pets && (
//                 <Text style={styles.errorText}>{errors.pets}</Text>
//               )}

//               <Text style={styles.inputLabel}>Illness/Issue</Text>
//               <TextInput
//                 style={[styles.input, styles.multilineInput]}
//                 placeholder="Describe what's happening with your pet(s)"
//                 value={formData.illness}
//                 onChangeText={(text) => handleInputChange('illness', text)}
//                 multiline
//                 numberOfLines={4}
//               />

//               <Text style={styles.inputLabel}>Appointment Date *</Text>
//               <Pressable
//                 style={styles.dateInput}
//                 onPress={() => setShowDatePicker(true)}
//               >
//                 <Text>{formData.date.toLocaleDateString()}</Text>
//                 <MaterialIcons
//                   name="calendar-today"
//                   size={24}
//                   color="#4E8D7C"
//                 />
//               </Pressable>

//               {showDatePicker && (
//                 <DateTimePicker
//                   value={formData.date}
//                   mode="date"
//                   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                   onChange={handleDateChange}
//                   minimumDate={new Date()}
//                   style={styles.datePicker}
//                 />
//               )}

//               <Text style={styles.inputLabel}>Consultation Type *</Text>
//               <View style={styles.radioGroup}>
//                 <TouchableOpacity
//                   style={[
//                     styles.radioButton,
//                     bookingType === 'in-clinic' && styles.radioButtonSelected
//                   ]}
//                   onPress={() => setBookingType('in-clinic')}
//                 >
//                   <Text style={[
//                     styles.radioButtonText,
//                     bookingType === 'in-clinic' && styles.radioButtonTextSelected
//                   ]}>
//                     In-Clinic
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.radioButton,
//                     bookingType === 'video' && styles.radioButtonSelected
//                   ]}
//                   onPress={() => setBookingType('video')}
//                 >
//                   <Text style={[
//                     styles.radioButtonText,
//                     bookingType === 'video' && styles.radioButtonTextSelected
//                   ]}>
//                     Video Consultation
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <Text style={styles.inputLabel}>Contact Info *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Phone number or email"
//                 value={formData.contactInfo}
//                 onChangeText={(text) => handleInputChange('contactInfo', text)}
//                 keyboardType="phone-pad"
//               />
//               {errors.contactInfo && (
//                 <Text style={styles.errorText}>{errors.contactInfo}</Text>
//               )}
//             </ScrollView>

//             <View style={styles.modalFooter}>
//               <TouchableOpacity
//                 style={styles.submitButton}
//                 onPress={handleSubmit}
//               >
//                 <Text style={styles.submitButtonText}>
//                   Proceed to Payment
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Pet Selection Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={petModalVisible}
//         onRequestClose={() => setPetModalVisible(false)}
//       >
//         <View style={styles.petModalContainer}>
//           <View style={styles.petModalContent}>
//             <View style={styles.petModalHeader}>
//               <Text style={styles.petModalTitle}>Select Pets</Text>
//               <TouchableOpacity onPress={() => setPetModalVisible(false)}>
//                 <MaterialIcons name="close" size={24} color="#4E8D7C" />
//               </TouchableOpacity>
//             </View>

//             {loadingPets ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#4E8D7C" />
//               </View>
//             ) : pets.length === 0 ? (
//               <View style={styles.emptyPetsContainer}>
//                 <FontAwesome5 name="paw" size={40} color="#E0E0E0" />
//                 <Text style={styles.emptyPetsText}>No pets registered</Text>
//                 <TouchableOpacity 
//                   style={styles.addPetButton}
//                   onPress={() => {
//                     setPetModalVisible(false);
//                     router.navigate('/pages/PetDetail');
//                   }}
//                 >
//                   <Text style={styles.addPetButtonText}>Add a Pet</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <FlatList
//                 data={pets}
//                 renderItem={({ item }) => (
//                   <PetCard
//                     pet={item}
//                     selected={selectedPets.includes(item._id)}
//                     onPress={() => togglePetSelection(item._id)}
//                   />
//                 )}
//                 keyExtractor={item => item._id}
//                 contentContainerStyle={styles.petList}
//               />
//             )}

//             <View style={styles.petModalFooter}>
//               <TouchableOpacity
//                 style={styles.doneButton}
//                 onPress={() => setPetModalVisible(false)}
//               >
//                 <Text style={styles.doneButtonText}>Done</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   fullContainer: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   headerContainer: {
//     paddingTop: 55,
//     paddingHorizontal: 16,
//     backgroundColor: '#F8F9FA',
//   },
//   backButton: {
//     padding: 8,
//     marginBottom: 12,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//     paddingHorizontal: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   clinicName: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#2C3E50',
//     flex: 1,
//   },
//   verifiedBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0F7F4',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginLeft: 10,
//   },
//   verifiedText: {
//     fontSize: 14,
//     color: '#4E8D7C',
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   establishmentType: {
//     fontSize: 16,
//     color: '#7D7D7D',
//     marginBottom: 20,
//     fontStyle: 'italic',
//   },
//   section: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2C3E50',
//     marginLeft: 8,
//   },
//   address: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 4,
//   },
//   location: {
//     fontSize: 14,
//     color: '#7D7D7D',
//   },
//   vetContainer: {
//     flexDirection: 'row',
//     marginTop: 8,
//   },
//   vetImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     marginRight: 16,
//   },
//   vetPlaceholder: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     backgroundColor: '#F0F7F4',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   vetInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   vetName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2C3E50',
//     marginBottom: 4,
//   },
//   vetSpecialty: {
//     fontSize: 16,
//     color: '#4E8D7C',
//     marginBottom: 4,
//   },
//   vetExperience: {
//     fontSize: 14,
//     color: '#7D7D7D',
//   },
//   fees: {
//     fontSize: 16,
//     color: '#555',
//   },
//   timingRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEE',
//   },
//   timingDay: {
//     fontSize: 16,
//     color: '#555',
//     flex: 1,
//   },
//   timingHours: {
//     fontSize: 16,
//     color: '#2C3E50',
//     fontWeight: '500',
//     marginRight: 8,
//   },
//   timingType: {
//     fontSize: 14,
//     color: '#7D7D7D',
//     fontStyle: 'italic',
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#EF4444',
//     marginTop: 4,
//   },
//   bookButton: {
//     backgroundColor: '#4E8D7C',
//     padding: 16,
//     margin: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   bookButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '80%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEE',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#2C3E50',
//   },
//   modalBody: {
//     padding: 16,
//   },
//   modalFooter: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#EEE',
//   },
//   inputLabel: {
//     fontSize: 16,
//     color: '#2C3E50',
//     marginBottom: 8,
//     marginTop: 12,
//     fontWeight: '500',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#DDD',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//   },
//   multilineInput: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   dateInput: {
//     borderWidth: 1,
//     borderColor: '#DDD',
//     borderRadius: 8,
//     padding: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   datePicker: {
//     marginVertical: 10,
//   },
//   radioGroup: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 8,
//   },
//   radioButton: {
//     borderWidth: 1,
//     borderColor: '#DDD',
//     borderRadius: 8,
//     padding: 12,
//     width: '48%',
//     alignItems: 'center',
//   },
//   radioButtonSelected: {
//     borderColor: '#4E8D7C',
//     backgroundColor: '#F0F7F4',
//   },
//   radioButtonText: {
//     color: '#555',
//   },
//   radioButtonTextSelected: {
//     color: '#4E8D7C',
//     fontWeight: '500',
//   },
//   submitButton: {
//     backgroundColor: '#4E8D7C',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   selectPetsButton: {
//     borderWidth: 1,
//     borderColor: '#DDD',
//     borderRadius: 8,
//     padding: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   selectPetsButtonText: {
//     color: '#2C3E50',
//   },
  
//   // Pet Modal Styles
//   petModalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   petModalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '80%',
//   },
//   petModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEE',
//   },
//   petModalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#2C3E50',
//   },
//   petModalFooter: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#EEE',
//   },
//   petList: {
//     padding: 16,
//   },
//   petCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     marginBottom: 12,
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#EEE',
//   },
//   selectedPetCard: {
//     borderColor: '#4E8D7C',
//     backgroundColor: '#F0F7F4',
//   },
//   petImageContainer: {
//     marginRight: 12,
//   },
//   petImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   petImagePlaceholder: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#F0F7F4',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   petInfo: {
//     flex: 1,
//   },
//   petName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2C3E50',
//     marginBottom: 4,
//   },
//   petDetails: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   petType: {
//     fontSize: 14,
//     color: '#4E8D7C',
//   },
//   petBreed: {
//     fontSize: 14,
//     color: '#7D7D7D',
//   },
//   selectedIndicator: {
//     marginLeft: 8,
//   },
//   doneButton: {
//     backgroundColor: '#4E8D7C',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   doneButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   loadingContainer: {
//     padding: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyPetsContainer: {
//     padding: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyPetsText: {
//     fontSize: 16,
//     color: '#7D7D7D',
//     marginTop: 16,
//     marginBottom: 24,
//   },
//   addPetButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     backgroundColor: '#4E8D7C',
//     borderRadius: 8,
//   },
//   addPetButtonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
// });

// export default ClinicDetailScreen;

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, SafeAreaView, Modal, Alert, Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  MaterialIcons, FontAwesome5, Ionicons, 
  MaterialCommunityIcons, Feather 
} from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ClinicDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('Info');
  const [isBookingVisible, setBookingVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const clinicData = params.clinic ? JSON.parse(params.clinic) : null;
  if (!clinicData) return <View style={styles.center}><Text>Loading Profile...</Text></View>;

  const { clinicDetails, veterinarianDetails: vet } = clinicData;

  const timeSlots = ["09:30 AM", "11:00 AM", "12:30 PM", "04:00 PM", "05:30 PM", "07:00 PM"];

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <Feather name="share-2" size={22} color="#333" />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Top Doctor Profile Section (As per your Screenshot 3) */}
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <Image source={{ uri: vet?.profilePhotoUrl }} style={styles.doctorImage} />
            <View style={styles.doctorMainInfo}>
              <Text style={styles.drName}>Dr. {vet.name} <Text style={styles.claimed}>Profile claimed</Text></Text>
              <Text style={styles.qualifications}>BVSc, MVSc - Veterinary Medicine</Text>
              <Text style={styles.specialties}>{vet.specialization}, Pet Surgeon, General Physician</Text>
              <Text style={styles.expText}>{vet.experience} Years Experience Overall</Text>
            </View>
          </View>

          <View style={styles.trustedBadge}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#24A1DE" />
            <Text style={styles.trustedText}>Trusted Care. Lasting Paws.</Text>
          </View>

          <View style={styles.verificationRow}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.verifyText}>Medical Registration Verified</Text>
          </View>

          <View style={styles.ratingRow}>
            <MaterialIcons name="thumb-up" size={18} color="#10B981" />
            <Text style={styles.ratingPercent}>92% <Text style={styles.patientCount}>(120 patients)</Text></Text>
          </View>

          <Text style={styles.shortBio}>
            Dr. {vet.name} is a renowned Veterinarian in {clinicDetails.locality}, {clinicDetails.city}. 
            The doctor provides high-quality medical care for all types of pets including dogs, cats, and birds.
          </Text>
        </View>

        {/* Tab Selection (As per your Screenshot 4) */}
        <View style={styles.tabBar}>
          {['Info', 'Stories', 'Consult Q&A', 'Healthfeed'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Content Section */}
        <View style={styles.infoContent}>
          <Text style={styles.locationTitle}>{clinicDetails.locality}, {clinicDetails.city}</Text>
          
          <View style={styles.clinicCard}>
            <View style={styles.clinicDetailsLeft}>
              <Text style={styles.clinicNameLink}>{clinicDetails.clinicName}</Text>
              <View style={styles.starRow}>
                <Text style={styles.starText}>4.5</Text>
                {[1,2,3,4].map(i => <MaterialIcons key={i} name="star" size={14} color="#10B981" />)}
                <MaterialIcons name="star-half" size={14} color="#10B981" />
              </View>
              <Text style={styles.fullAddress}>
                {clinicDetails.streetAddress || 'Plot No. 45, Near Main Market'}, {clinicDetails.locality}, Landmark: Opposite Green Park.
              </Text>
              <TouchableOpacity><Text style={styles.getDirections}>Get Directions</Text></TouchableOpacity>
            </View>

            <View style={styles.clinicDetailsRight}>
              <Text style={styles.days}>Mon - Sun</Text>
              <Text style={styles.timings}>09:30 AM - 08:00 PM</Text>
              <Text style={styles.price}>₹{clinicDetails.fees}</Text>
              <View style={styles.primeBadge}>
                <MaterialIcons name="verified" size={14} color="#7C4DFF" />
                <Text style={styles.primeText}>Prime Verified</Text>
              </View>
            </View>
          </View>

          {/* Services Section */}
          <View style={styles.servicesBox}>
            <Text style={styles.subHeading}>Services</Text>
            <View style={styles.serviceGrid}>
              {['Vaccinations', 'Pet Grooming', 'Surgery', 'Deworming', 'General Checkup'].map(s => (
                <Text key={s} style={styles.serviceTag}>• {s}</Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Button */}
      <View style={styles.bottomFixed}>
        <TouchableOpacity style={styles.bookBtn} onPress={() => setBookingVisible(true)}>
          <LightningIcon />
          <View>
            <Text style={styles.bookBtnText}>Book Appointment</Text>
            <Text style={styles.subBookText}>Instant Confirmation</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <Modal visible={isBookingVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Available Slots</Text>
              <TouchableOpacity onPress={() => setBookingVisible(false)}><MaterialIcons name="close" size={24} /></TouchableOpacity>
            </View>
            <View style={styles.slotGrid}>
              {timeSlots.map(slot => (
                <TouchableOpacity 
                  key={slot} 
                  style={[styles.slot, selectedTime === slot && styles.activeSlot]} 
                  onPress={() => setSelectedTime(slot)}
                >
                  <Text style={{color: selectedTime === slot ? 'white' : 'black'}}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              style={styles.confirmBtn} 
              onPress={() => {
                if(!selectedTime) return Alert.alert("Error", "Select a time");
                Alert.alert("Success", `Appointment fixed for ${selectedTime}`);
                setBookingVisible(false);
              }}
            >
              <Text style={styles.confirmText}>Confirm Appointment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const LightningIcon = () => (
  <MaterialCommunityIcons name="lightning-bolt" size={20} color="white" style={{marginRight: 8}} />
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' 
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  
  // Profile Section
  profileSection: { padding: 15 },
  profileRow: { flexDirection: 'row' },
  doctorImage: { width: 90, height: 90, borderRadius: 8 },
  doctorMainInfo: { flex: 1, marginLeft: 15 },
  drName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  claimed: { fontSize: 12, color: '#777', fontWeight: '400' },
  qualifications: { fontSize: 14, color: '#444', marginTop: 2 },
  specialties: { fontSize: 13, color: '#666', marginTop: 2 },
  expText: { fontSize: 13, fontWeight: '500', color: '#333', marginTop: 4 },
  
  trustedBadge: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', 
    padding: 10, borderRadius: 6, marginTop: 15, borderWidth: 1, borderColor: '#e0f2fe'
  },
  trustedText: { marginLeft: 8, color: '#24A1DE', fontWeight: '600', fontSize: 14 },
  
  verificationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  verifyText: { marginLeft: 8, color: '#444', fontWeight: '500' },
  
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  ratingPercent: { marginLeft: 8, color: '#10B981', fontWeight: 'bold', fontSize: 15 },
  patientCount: { color: '#777', fontWeight: '400', fontSize: 13 },
  
  shortBio: { color: '#555', lineHeight: 20, marginTop: 15, fontSize: 14 },

  // Tabs
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', marginTop: 10 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  activeTabItem: { borderBottomWidth: 3, borderBottomColor: '#24A1DE' },
  tabText: { color: '#777', fontWeight: '500' },
  activeTabText: { color: '#24A1DE', fontWeight: 'bold' },

  // Info Content
  infoContent: { padding: 15, backgroundColor: '#f9f9f9' },
  locationTitle: { fontSize: 14, color: '#666', marginBottom: 10 },
  clinicCard: { backgroundColor: 'white', padding: 15, borderRadius: 8, flexDirection: 'row' },
  clinicDetailsLeft: { flex: 1.5 },
  clinicDetailsRight: { flex: 1, alignItems: 'flex-end' },
  clinicNameLink: { color: '#24A1DE', fontSize: 16, fontWeight: 'bold' },
  starRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  starText: { color: '#10B981', fontWeight: 'bold', marginRight: 4, fontSize: 12 },
  fullAddress: { fontSize: 13, color: '#666', lineHeight: 18 },
  getDirections: { color: '#24A1DE', fontWeight: '600', marginTop: 5, fontSize: 13 },
  
  days: { fontWeight: 'bold', color: '#333', fontSize: 13 },
  timings: { fontSize: 12, color: '#666', marginTop: 2 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10 },
  primeBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  primeText: { color: '#7C4DFF', fontSize: 11, fontWeight: 'bold', marginLeft: 3 },

  servicesBox: { marginTop: 20 },
  subHeading: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  serviceTag: { width: '50%', fontSize: 14, color: '#555', marginBottom: 8 },

  // Bottom Fixed Button
  bottomFixed: { 
    padding: 15, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: 'white',
    ...Platform.select({ ios: { paddingBottom: 30 } })
  },
  bookBtn: { 
    backgroundColor: '#24A1DE', borderRadius: 8, paddingVertical: 12, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center' 
  },
  bookBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  subBookText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, textAlign: 'center' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold' },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: { padding: 12, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, width: '30%', alignItems: 'center' },
  activeSlot: { backgroundColor: '#24A1DE', borderColor: '#24A1DE' },
  confirmBtn: { backgroundColor: '#2D3192', padding: 15, borderRadius: 10, marginTop: 25, alignItems: 'center' },
  confirmText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default ClinicDetailScreen;