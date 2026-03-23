

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   ScrollView,
//   FlatList,
//   Image,
//   Dimensions,
//   SafeAreaView,
//   Linking,
//   Modal,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';
// import {
//   MaterialIcons,
//   FontAwesome5,
//   Ionicons,
//   MaterialCommunityIcons,
// } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import CommonHeader from '../../../components/CommonHeader';
// import { useSelector, useDispatch } from 'react-redux';
// import { getAllVerifiedClinics } from '../../../store/slices/authSlice';
// import { useFocusEffect } from 'expo-router';
// import * as Location from 'expo-location';
// import {
//   Card,
//   Text,
//   Button,
//   Switch,
//   TextInput,
//   Provider as PaperProvider,
//   MD3LightTheme as DefaultTheme,
//   Chip,
//   Surface,
//   Divider,
//   ActivityIndicator,
//   Searchbar,
//   IconButton,
// } from 'react-native-paper';

// const { width } = Dimensions.get('window');

// const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#7CB342',
//     secondary: '#558B2F',
//     tertiary: '#558B2F',
//     error: '#EF4444',
//     background: '#F5F7FA',
//   },
// };

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

// // Generate next 30 days for calendar
// const generateCalendarDays = () => {
//   const days = [];
//   const today = new Date();
//   const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
//   const months = ['January', 'February', 'March', 'April', 'May', 'June', 
//                   'July', 'August', 'September', 'October', 'November', 'December'];

//   for (let i = 0; i < 30; i++) {
//     const date = new Date(today);
//     date.setDate(today.getDate() + i);
//     days.push({
//       id: i,
//       dayName: dayNames[date.getDay()],
//       date: date.getDate(),
//       month: months[date.getMonth()],
//       monthShort: months[date.getMonth()].substring(0, 3),
//       fullDate: date,
//       isToday: i === 0,
//     });
//   }
//   return days;
// };

// // Generate time slots
// const generateTimeSlots = () => {
//   const slots = [];
  
//   // Morning: 9 AM - 12 PM
//   for (let hour = 9; hour < 12; hour++) {
//     slots.push({
//       id: `${hour}:00`,
//       time: `${hour}:00 AM`,
//       period: 'morning',
//       available: Math.random() > 0.3,
//     });
//     slots.push({
//       id: `${hour}:30`,
//       time: `${hour}:30 AM`,
//       period: 'morning',
//       available: Math.random() > 0.3,
//     });
//   }

//   // Afternoon: 12 PM - 5 PM
//   for (let hour = 12; hour < 17; hour++) {
//     const displayHour = hour > 12 ? hour - 12 : hour;
//     const period = 'PM';
//     slots.push({
//       id: `${hour}:00`,
//       time: `${displayHour}:00 ${period}`,
//       period: 'afternoon',
//       available: Math.random() > 0.3,
//     });
//     slots.push({
//       id: `${hour}:30`,
//       time: `${displayHour}:30 ${period}`,
//       period: 'afternoon',
//       available: Math.random() > 0.3,
//     });
//   }

//   // Evening: 5 PM - 9 PM
//   for (let hour = 17; hour < 21; hour++) {
//     const displayHour = hour - 12;
//     slots.push({
//       id: `${hour}:00`,
//       time: `${displayHour}:00 PM`,
//       period: 'evening',
//       available: Math.random() > 0.3,
//     });
//     slots.push({
//       id: `${hour}:30`,
//       time: `${displayHour}:30 PM`,
//       period: 'evening',
//       available: Math.random() > 0.3,
//     });
//   }

//   return slots;
// };

// // Enhanced Booking Modal Component
// const BookingModal = ({ visible, onClose, clinic }) => {
//   const [selectedPet, setSelectedPet] = useState(null);
//   const [bookingReason, setBookingReason] = useState('');
//   const [selectedVet, setSelectedVet] = useState(clinic?.veterinarianDetails?.name || '');
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedMonth, setSelectedMonth] = useState('February');
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [additionalNote, setAdditionalNote] = useState('');
//   const [usePawPoints, setUsePawPoints] = useState(false);
//   const [couponCode, setCouponCode] = useState('');

//   const calendarDays = generateCalendarDays();
//   const timeSlots = generateTimeSlots();

//   // Mock pets data
//   const pets = [
//     { id: 1, name: 'Buddy', type: 'Dog', icon: '🐕' },
//     { id: 2, name: 'Whiskers', type: 'Cat', icon: '🐱' },
//     { id: 3, name: 'Max', type: 'Dog', icon: '🐕' },
//   ];

//   const calculateTotal = () => {
//     const baseFee = parseInt(clinic?.clinicDetails?.fees || 500);
//     const discount = usePawPoints ? 50 : 0;
//     const couponDiscount = couponCode ? 50 : 0;
//     return baseFee - discount - couponDiscount;
//   };

//   const handleConfirmBooking = () => {
//     if (!selectedPet || !selectedDate || !selectedSlot) {
//       Alert.alert('Incomplete Information', 'Please fill all required fields');
//       return;
//     }

//     Alert.alert(
//       'Booking Confirmed! 🎉',
//       `Your appointment has been confirmed!\n\nPet: ${selectedPet.name}\nDate: ${selectedDate.monthShort} ${selectedDate.date}\nTime: ${selectedSlot.time}\nDoctor: Dr. ${selectedVet}\nTotal: ₹${calculateTotal()}`,
//       [
//         {
//           text: 'OK',
//           onPress: () => {
//             onClose();
//             setSelectedPet(null);
//             setBookingReason('');
//             setSelectedDate(null);
//             setSelectedSlot(null);
//             setAdditionalNote('');
//             setUsePawPoints(false);
//             setCouponCode('');
//           },
//         },
//       ],
//     );
//   };

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={false}
//       onRequestClose={onClose}
//     >
//       <SafeAreaView style={styles.modalContainer}>
//         {/* Header */}
//         <View style={styles.modalHeader}>
//           <TouchableOpacity onPress={onClose} style={styles.backButton}>
//             <Ionicons name="arrow-back" size={24} color="#333" />
//             <Text variant="headlineSmall" style={styles.modalHeaderTitle}>Pet Info</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
//           {/* Booking For Section */}
//           <Surface style={styles.modalSection}>
//             <Text variant="labelLarge" style={styles.sectionLabel}>
//               Booking for
//             </Text>
//             <View style={styles.petSelectionRow}>
//               {pets.map((pet) => (
//                 <TouchableOpacity
//                   key={pet.id}
//                   style={[
//                     styles.petCard,
//                     selectedPet?.id === pet.id && styles.petCardSelected,
//                   ]}
//                   onPress={() => setSelectedPet(pet)}
//                 >
//                   <Text style={styles.petIcon}>{pet.icon}</Text>
//                   <Text style={styles.petName}>{pet.name}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </Surface>

          

          

          

//           {/* Appointment Date */}
//           <Surface style={styles.modalSection}>
//             <View style={styles.sectionHeaderRow}>
//               <Text variant="labelLarge" style={styles.sectionLabel}>
//                 Appointment Date
//               </Text>
//               <Chip
//                 label={selectedMonth}
//                 icon="calendar"
//                 style={styles.monthChip}
//                 compact
//               />
//             </View>

//             <ScrollView 
//               horizontal 
//               showsHorizontalScrollIndicator={false}
//               style={styles.calendarScroll}
//             >
//               {calendarDays.map((day) => (
//                 <TouchableOpacity
//                   key={day.id}
//                   style={[
//                     styles.calendarDay,
//                     selectedDate?.id === day.id && styles.calendarDaySelected,
//                   ]}
//                   onPress={() => setSelectedDate(day)}
//                 >
//                   <Text
//                     variant="labelSmall"
//                     style={[
//                       styles.dayName,
//                       selectedDate?.id === day.id && styles.dayNameSelected,
//                     ]}
//                   >
//                     {day.dayName}
//                   </Text>
//                   <Text
//                     variant="headlineMedium"
//                     style={[
//                       styles.dayDate,
//                       selectedDate?.id === day.id && styles.dayDateSelected,
//                     ]}
//                   >
//                     {day.date}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </Surface>

//           {/* Appointment Slot */}
//           <Surface style={styles.modalSection}>
//             <Text variant="labelLarge" style={styles.sectionLabel}>
//               Appointment Slot
//             </Text>
//             <Text variant="labelSmall" style={styles.helperText}>
//               Select an available time
//             </Text>
            
//             <View style={styles.slotsContainer}>
//               {timeSlots.filter(slot => slot.available).slice(0, 8).map((slot) => (
//                 <TouchableOpacity
//                   key={slot.id}
//                   style={[
//                     styles.timeSlot,
//                     selectedSlot?.id === slot.id && styles.timeSlotSelected,
//                   ]}
//                   onPress={() => setSelectedSlot(slot)}
//                 >
//                   <Text
//                     variant="labelMedium"
//                     style={[
//                       styles.timeSlotText,
//                       selectedSlot?.id === slot.id && styles.timeSlotTextSelected,
//                     ]}
//                   >
//                     {slot.time}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </Surface>

//           {/* PawPoints Section */}
//           <Surface style={styles.modalSection}>
//             <View style={styles.pawPointsRow}>
//               <View style={styles.pawPointsLeft}>
//                 <Switch
//                   value={usePawPoints}
//                   onValueChange={setUsePawPoints}
//                   color={theme.colors.primary}
//                 />
//                 <Text variant="labelLarge" style={styles.pawPointsText}>
//                   Pay using PawPoints
//                 </Text>
//               </View>
//               <View style={styles.pawPointsRight}>
//                 <Text variant="labelSmall" style={styles.balanceLabel}>
//                   Balance:
//                 </Text>
//                 <Text variant="titleMedium" style={styles.balanceAmount}>
//                   ₹0
//                 </Text>
//               </View>
//             </View>
//           </Surface>

//           {usePawPoints && (
//             <Surface style={styles.savingsNotice}>
//               <MaterialIcons name="info" size={16} color={theme.colors.primary} />
//               <Text variant="labelSmall" style={styles.savingsText}>
//                 You can save max ₹50 by using PawPoints
//               </Text>
//             </Surface>
//           )}

//           {/* Apply Coupon */}
//           <Surface style={styles.couponSection}>
//             <MaterialIcons name="local-offer" size={20} color={theme.colors.primary} />
//             <Text variant="labelLarge" style={styles.couponText}>
//               Apply Coupon Code
//             </Text>
//             <MaterialIcons name="chevron-right" size={20} color="#666" />
//           </Surface>

//           {/* Summary Section */}
//           <Card style={styles.summaryCard}>
//             <Card.Content style={styles.summaryContent}>
//               <Text variant="titleMedium" style={styles.summaryTitle}>
//                 Summary
//               </Text>
              
//               <View style={styles.summaryRow}>
//                 <Text variant="bodySmall" style={styles.summaryLabel}>
//                   Consultation Fees
//                 </Text>
//                 <Text variant="bodySmall" style={styles.summaryValue}>
//                   ₹{clinic?.clinicDetails?.fees || '500'}
//                 </Text>
//               </View>

//               <View style={styles.summaryRow}>
//                 <Text variant="labelSmall" style={styles.discountLabel}>
//                   PawPoints Discount
//                 </Text>
//                 <Text variant="labelSmall" style={styles.discountValue}>
//                   -₹{usePawPoints ? 50 : 0}
//                 </Text>
//               </View>

//               <Divider style={styles.summaryDivider} />

//               <View style={styles.summaryRow}>
//                 <Text variant="titleSmall" style={styles.totalLabel}>
//                   Total Amount
//                 </Text>
//                 <Text variant="displaySmall" style={styles.totalValue}>
//                   ₹{calculateTotal()}
//                 </Text>
//               </View>
//             </Card.Content>
//           </Card>

//           {/* Savings Banner */}
//           <Surface style={styles.savingsBanner}>
//             <MaterialIcons name="check-circle" size={20} color="#fff" />
//             <Text variant="labelMedium" style={styles.savingsBannerText}>
//               You saved ₹{usePawPoints ? 50 : 0} on this booking!
//             </Text>
//           </Surface>
//         </ScrollView>

//         {/* Bottom Action Button */}
//         <Surface style={styles.bottomBar}>
//           <Button
//             mode="contained"
//             buttonColor={theme.colors.primary}
//             onPress={handleConfirmBooking}
//             style={styles.confirmButton}
//             contentStyle={styles.confirmButtonContent}
//           >
//             Confirm & Pay
//           </Button>
//         </Surface>
//       </SafeAreaView>
//     </Modal>
//   );
// };

// // Clinic Card Component
// const ClinicCard = ({ clinic, onPress, onBookPress, userLocation, locationPermission }) => {
//   const { clinicDetails, veterinarianDetails: vet } = clinic;

//   if (!clinicDetails) {
//     return null;
//   }

//   const handleCall = () => {
//     Linking.openURL(`tel:${clinicDetails.phoneNumber}`);
//   };

//   return (
//     <Card style={styles.card} onPress={onPress}>
//       <Card.Content style={styles.cardContent}>
//         {/* Header Section */}
//         <View style={styles.cardHeader}>
//           <View style={styles.clinicHeaderLeft}>
//             <Text variant="titleMedium" style={styles.clinicName} numberOfLines={1}>
//               {clinicDetails.clinicName}
//             </Text>
//             <Chip
//               label={clinicDetails.establishmentType}
//               size="small"
//               style={styles.typeBadge}
//               textStyle={styles.typeBadgeText}
//             />
//           </View>
//           {clinicDetails.verified && (
//             <Chip
//               label="Verified"
//               icon="check-circle"
//               size="small"
//               style={styles.verifiedChip}
//               textStyle={styles.verifiedChipText}
//             />
//           )}
//         </View>

//         {/* Doctor Information */}
//         <View style={styles.doctorSection}>
//           <Image
//             source={{ uri: vet?.profilePhotoUrl }}
//             style={styles.profileImage}
//           />
//           <View style={styles.doctorInfo}>
//             <Text variant="titleSmall" style={styles.drName}>
//               Dr. {vet?.name || 'Veterinarian'}
//             </Text>
//             <Text variant="labelSmall" style={styles.specializationText}>
//               {vet?.specialization || 'General'} • {vet?.experience || '0'} yrs
//             </Text>
//             <Text variant="labelSmall" style={styles.qualificationText} numberOfLines={1}>
//               {vet?.qualifications || 'BVSc'}
//             </Text>
//           </View>
//         </View>

//         {/* Info Row - Location and Rating */}
//         <View style={styles.infoRow}>
//           <View style={styles.locationContainer}>
//             <MaterialIcons name="location-on" size={14} color={theme.colors.primary} />
//             <Text variant="labelSmall" style={styles.locationText} numberOfLines={1}>
//               {clinicDetails?.locality || clinicDetails?.city || 'Location'}
//             </Text>
//           </View>
          
//           <Surface style={styles.ratingContainer}>
//             <MaterialIcons name="star" size={14} color="#FFA500" />
//             <Text variant="labelSmall" style={styles.ratingText}>
//               {clinicDetails?.rating || '4.5'}
//             </Text>
//             <Text variant="labelSmall" style={styles.reviewsText}>
//               ({clinicDetails?.totalReviews || '0'})
//             </Text>
//           </Surface>
//         </View>

//         {/* Amenities */}
//         <View style={styles.amenitiesSection}>
//           <View style={styles.amenitiesRow}>
//             {(clinicDetails?.amenities || []).slice(0, 2).map((amenity, idx) => (
//               <Chip
//                 key={idx}
//                 label={amenity}
//                 icon="check-circle"
//                 size="small"
//                 style={styles.amenityChip}
//                 textStyle={styles.amenityChipText}
//               />
//             ))}
//             {(clinicDetails?.amenities?.length || 0) > 2 && (
//               <Chip
//                 label={`+${clinicDetails.amenities.length - 2} more`}
//                 size="small"
//                 style={styles.moreAmenityChip}
//                 textStyle={styles.moreAmenityChipText}
//               />
//             )}
//           </View>
//         </View>

//         {/* Fee Section */}
//         <Divider style={styles.divider} />
//         <View style={styles.feeSection}>
//           <View>
//             <Text variant="labelSmall" style={styles.feeLabel}>
//               Consultation Fee
//             </Text>
//             <Text variant="headlineSmall" style={styles.feeAmount}>
//               ₹{clinicDetails?.fees || '500'}
//             </Text>
//           </View>
//           <Chip
//             label="No Booking Fee"
//             icon="check"
//             size="small"
//             style={styles.noFeeChip}
//             textStyle={styles.noFeeChipText}
//           />
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionButtons}>
//           <Button
//             mode="contained"
//             buttonColor={theme.colors.primary}
//             onPress={onBookPress}
//             style={styles.bookButton}
//             contentStyle={styles.buttonContent}
//             labelStyle={styles.bookButtonLabel}
//             icon="calendar"
//           >
//             Book Now
//           </Button>

//           <View style={styles.secondaryActions}>
//             <IconButton
//               icon="phone"
//               iconColor={theme.colors.primary}
//               size={20}
//               onPress={handleCall}
//               style={styles.iconButton}
//             />
//             <IconButton
//               icon="video"
//               iconColor={theme.colors.primary}
//               size={20}
//               onPress={() => router.push('/pages/VideoCall')}
//               style={styles.iconButton}
//             />
//           </View>
//         </View>
//       </Card.Content>
//     </Card>
//   );
// };

// // Main Component
// export default function ClinicListScreen() {
//   const dispatch = useDispatch();
//   const verifiedClinics = useSelector(state => state.auth?.verifiedClinics?.data || []);
//   const loading = useSelector(state => state.auth?.verifiedClinics?.loading || false);
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [location, setLocation] = useState('');
//   const [selectedClinic, setSelectedClinic] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [filterType, setFilterType] = useState('All');
//   const [userLocation, setUserLocation] = useState(null);
//   const [locationPermission, setLocationPermission] = useState(false);

//   // Get user location
//   const getUserLocation = async () => {
//     try {
//       console.log('📍 Getting user location...');
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.log('❌ Location permission denied');
//         Alert.alert(
//           'Location Permission',
//           'Please enable location permission to see nearby clinics with distance.',
//           [{ text: 'OK' }]
//         );
//         setLocationPermission(false);
//         console.log('🚀 Dispatching API call without location...');
//         dispatch(getAllVerifiedClinics());
//         return null;
//       }

//       setLocationPermission(true);
//       let location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Balanced,
//       });
      
//       const userLoc = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       };
      
//       console.log(`📍 User location obtained: ${userLoc.latitude}, ${userLoc.longitude}`);
//       setUserLocation(userLoc);
      
//       console.log('🚀 Dispatching API call with location...');
//       const locationParams = {
//         userLat: userLoc.latitude,
//         userLon: userLoc.longitude
//       };
//       console.log('📊 Location params:', locationParams);
      
//       await dispatch(getAllVerifiedClinics(locationParams));
      
//       return userLoc;
//     } catch (error) {
//       console.error('❌ Error getting location:', error);
//       setLocationPermission(false);
//       console.log('🚀 Dispatching API call without location (error case)...');
//       dispatch(getAllVerifiedClinics());
//       return null;
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       console.log('🔄 ClinicListScreen focused - calling getUserLocation');
//       getUserLocation();
//     }, [])
//   );

//   const filteredData = verifiedClinics.filter((item) => {
//     if (!item.clinicDetails) return false;
    
//     const clinicName = item.clinicDetails.clinicName?.toLowerCase() || '';
//     const vetName = item.veterinarianDetails?.name?.toLowerCase() || '';
//     const vetSpec = item.veterinarianDetails?.specialization?.toLowerCase() || '';
//     const clinicCity = item.clinicDetails.city?.toLowerCase() || '';
//     const clinicLocality = item.clinicDetails.locality?.toLowerCase() || '';
    
//     const search = searchQuery.toLowerCase();
//     const loc = location.toLowerCase();
    
//     const matchesSearch = !searchQuery || 
//       clinicName.includes(search) ||
//       vetName.includes(search) ||
//       vetSpec.includes(search);
    
//     const matchesLocation = !location || location === 'All' ||
//       clinicCity.includes(loc) ||
//       clinicLocality.includes(loc);

//     const matchesFilter =
//       filterType === 'All' ||
//       (filterType === 'Verified' && item.clinicDetails.verified) ||
//       (filterType === 'Emergency' &&
//         item.clinicDetails.amenities?.some((a) => a.includes('Emergency')));

//     return matchesSearch && matchesLocation && matchesFilter;
//   });

//   const handleBookPress = (clinic) => {
//     setSelectedClinic(clinic);
//     setModalVisible(true);
//   };

//   return (
//     <PaperProvider theme={theme}>
//       <SafeAreaView style={styles.container}>
//         <CommonHeader title="Find Clinics" />
        
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={theme.colors.primary} />
//             <Text variant="bodyMedium" style={styles.loadingText}>
//               Loading clinics...
//             </Text>
//           </View>
//         ) : (
//           <>
//             {/* Search Section */}
//             <Surface style={styles.searchHeader}>
//               <View style={styles.searchInputContainer}>
//                 <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Location"
//                   placeholderTextColor="#999"
//                   value={location}
//                   onChangeText={setLocation}
//                   mode="flat"
//                   underlineColor="transparent"
//                   activeUnderlineColor="transparent"
//                 />
//               </View>
              
//               <Divider style={styles.inputDivider} />
              
//               <View style={styles.searchInputContainer}>
//                 <Ionicons name="search-outline" size={20} color={theme.colors.primary} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Search Vets, Clinics..."
//                   placeholderTextColor="#999"
//                   value={searchQuery}
//                   onChangeText={setSearchQuery}
//                   mode="flat"
//                   underlineColor="transparent"
//                   activeUnderlineColor="transparent"
//                 />
//               </View>
//             </Surface>

//             {/* Filter Chips */}
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               style={styles.filterContainer}
//             >
//               {['All', 'Verified', 'Emergency'].map((filter) => (
//                 <Chip
//                   key={filter}
//                   label={filter}
//                   icon={filter === 'Verified' ? 'check-circle' : filter === 'Emergency' ? 'hospital-box' : undefined}
//                   selected={filterType === filter}
//                   onPress={() => setFilterType(filter)}
//                   style={[
//                     styles.filterChip,
//                     filterType === filter && styles.filterChipActive,
//                   ]}
//                   textStyle={[
//                     styles.filterText,
//                     filterType === filter && styles.filterTextActive,
//                   ]}
//                   selectedColor={theme.colors.primary}
//                 />
//               ))}
//             </ScrollView>

//             {/* Results Header */}
//             <Surface style={styles.resultsHeader}>
//               <Text variant="titleMedium" style={styles.resultsCount}>
//                 {filteredData.length} {filteredData.length === 1 ? 'Clinic' : 'Clinics'}
//               </Text>
//               {location && (
//                 <Text variant="labelSmall" style={styles.resultsSubtext}>
//                   near {location}
//                 </Text>
//               )}
//             </Surface>

//             {/* Clinic List */}
//             <FlatList
//               data={filteredData}
//               renderItem={({ item }) => (
//                 <ClinicCard
//                   clinic={item}
//                   userLocation={userLocation}
//                   locationPermission={locationPermission}
//                   onPress={() =>
//                     router.push({
//                       pathname: '/pages/ClinicDetailScreen',
//                       params: { clinic: JSON.stringify(item) },
//                     })
//                   }
//                   onBookPress={() => handleBookPress(item)}
//                 />
//               )}
//               keyExtractor={(item) => item.clinicDetails._id}
//               contentContainerStyle={styles.listContent}
//               showsVerticalScrollIndicator={false}
//               ListEmptyComponent={() => (
//                 <View style={styles.emptyContainer}>
//                   <MaterialCommunityIcons 
//                     name="hospital-box" 
//                     size={64} 
//                     color="#DDD" 
//                   />
//                   <Text variant="titleMedium" style={styles.emptyText}>
//                     No clinics found
//                   </Text>
//                   <Text variant="labelSmall" style={styles.emptySubtext}>
//                     Try adjusting your search or filters
//                   </Text>
//                 </View>
//               )}
//             />

//             {/* Booking Modal */}
//             {selectedClinic && (
//               <BookingModal
//                 visible={modalVisible}
//                 onClose={() => setModalVisible(false)}
//                 clinic={selectedClinic}
//               />
//             )}
//           </>
//         )}
//       </SafeAreaView>
//     </PaperProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },

//   // Search Header
//   searchHeader: {
//     backgroundColor: '#fff',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     elevation: 2,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E8E8E8',
//   },
//   searchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 6,
//   },
//   input: {
//     flex: 1,
//     marginLeft: 10,
//     backgroundColor: '#fff',
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//   },
//   inputDivider: {
//     height: 1,
//     backgroundColor: '#E8E8E8',
//     marginVertical: 8,
//   },

//   // Filter Container
//   filterContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//   },
//   filterChip: {
//     marginRight: 8,
//     backgroundColor: '#F5F5F5',
//   },
//   filterChipActive: {
//     backgroundColor: theme.colors.primary,
//   },
//   filterText: {
//     color: '#666',
//     fontWeight: '600',
//   },
//   filterTextActive: {
//     color: '#fff',
//   },

//   // Results Header
//   resultsHeader: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E8E8E8',
//   },
//   resultsCount: {
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   resultsSubtext: {
//     color: '#666',
//     marginTop: 4,
//   },

//   // List Content
//   listContent: {
//     padding: 12,
//     paddingBottom: 24,
//   },

//   // Card Styles
//   card: {
//     marginBottom: 12,
//     borderRadius: 16,
//     elevation: 2,
//   },
//   cardContent: {
//     padding: 0,
//   },

//   // Card Header
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E8E8E8',
//   },
//   clinicHeaderLeft: {
//     flex: 1,
//     marginRight: 8,
//   },
//   clinicName: {
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 6,
//   },
//   typeBadge: {
//     alignSelf: 'flex-start',
//   },
//   typeBadgeText: {
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   verifiedChip: {
//     backgroundColor: '#E8F5E9',
//   },
//   verifiedChipText: {
//     color: '#10B981',
//     fontWeight: '600',
//   },

//   // Doctor Section
//   doctorSection: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   profileImage: {
//     width: 65,
//     height: 65,
//     borderRadius: 32.5,
//     borderWidth: 2,
//     borderColor: theme.colors.primary,
//   },
//   doctorInfo: {
//     flex: 1,
//     marginLeft: 12,
//     justifyContent: 'center',
//   },
//   drName: {
//     fontWeight: '700',
//     color: theme.colors.primary,
//     marginBottom: 2,
//   },
//   specializationText: {
//     color: '#666',
//     marginBottom: 2,
//     fontWeight: '500',
//   },
//   qualificationText: {
//     color: '#999',
//     fontStyle: 'italic',
//     fontSize: 11,
//   },

//   // Info Row
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     gap: 8,
//   },
//   locationContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   locationText: {
//     color: '#666',
//     marginLeft: 4,
//     fontWeight: '500',
//     flex: 1,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   ratingText: {
//     fontWeight: '700',
//     color: '#FFA500',
//     marginLeft: 3,
//     marginRight: 2,
//   },
//   reviewsText: {
//     color: '#999',
//     fontSize: 11,
//   },

//   // Amenities
//   amenitiesSection: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },
//   amenitiesRow: {
//     flexDirection: 'row',
//     gap: 6,
//   },
//   amenityChip: {
//     height: 28,
//   },
//   amenityChipText: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   moreAmenityChip: {
//     height: 28,
//   },
//   moreAmenityChipText: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: theme.colors.primary,
//   },

//   // Divider
//   divider: {
//     marginHorizontal: 16,
//     marginVertical: 8,
//   },

//   // Fee Section
//   feeSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },
//   feeLabel: {
//     color: '#666',
//     fontWeight: '500',
//     marginBottom: 2,
//   },
//   feeAmount: {
//     fontWeight: '800',
//     color: theme.colors.primary,
//   },
//   noFeeChip: {
//     height: 28,
//     backgroundColor: '#10B981',
//   },
//   noFeeChipText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '700',
//   },

//   // Action Buttons
//   actionButtons: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     gap: 8,
//   },
//   bookButton: {
//     flex: 1,
//     borderRadius: 10,
//   },
//   buttonContent: {
//     paddingVertical: 2,
//   },
//   bookButtonLabel: {
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   secondaryActions: {
//     flexDirection: 'row',
//     gap: 6,
//   },
//   iconButton: {
//     borderRadius: 10,
//     borderWidth: 1.5,
//     borderColor: theme.colors.primary,
//     backgroundColor: '#fff',
//   },

//   // Empty State
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: '#666',
//     marginTop: 12,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//   },
//   emptyText: {
//     color: '#666',
//     marginTop: 12,
//   },
//   emptySubtext: {
//     color: '#999',
//     marginTop: 6,
//   },

//   // Modal Styles
//   modalContainer: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   modalHeader: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E8E8E8',
//     elevation: 2,
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   modalHeaderTitle: {
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginLeft: 12,
//   },
//   modalContent: {
//     flex: 1,
//   },

//   // Modal Sections
//   modalSection: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginBottom: 8,
//   },
//   sectionLabel: {
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 10,
//   },
//   sectionHeaderRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   monthChip: {
//     backgroundColor: '#E8F5E9',
//   },

//   // Pet Selection
//   petSelectionRow: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   petCard: {
//     width: 75,
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#E0E0E0',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   petCardSelected: {
//     borderColor: theme.colors.primary,
//     backgroundColor: '#F1F8E9',
//   },
//   petIcon: {
//     fontSize: 28,
//     marginBottom: 4,
//   },
//   petName: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#333',
//   },

//   // Dropdown
//   dropdownContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     backgroundColor: '#F8F9FA',
//   },
//   dropdownText: {
//     color: '#333',
//     fontWeight: '500',
//   },

//   // Calendar
//   calendarScroll: {
//     marginTop: 6,
//   },
//   calendarDay: {
//     width: 58,
//     paddingVertical: 10,
//     marginRight: 8,
//     borderRadius: 10,
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   calendarDaySelected: {
//     backgroundColor: theme.colors.primary,
//     borderColor: theme.colors.primary,
//   },
//   dayName: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 3,
//   },
//   dayNameSelected: {
//     color: '#fff',
//   },
//   dayDate: {
//     color: '#1a1a1a',
//     fontWeight: '700',
//   },
//   dayDateSelected: {
//     color: '#fff',
//   },

//   // Time Slots
//   helperText: {
//     color: '#999',
//     marginBottom: 10,
//   },
//   slotsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   timeSlot: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 8,
//     borderWidth: 1.5,
//     borderColor: '#E0E0E0',
//     backgroundColor: '#fff',
//   },
//   timeSlotSelected: {
//     backgroundColor: theme.colors.primary,
//     borderColor: theme.colors.primary,
//   },
//   timeSlotText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#333',
//   },
//   timeSlotTextSelected: {
//     color: '#fff',
//   },

//   // PawPoints
//   pawPointsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   pawPointsLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   pawPointsText: {
//     marginLeft: 10,
//     fontWeight: '600',
//     color: '#333',
//   },
//   pawPointsRight: {
//     alignItems: 'flex-end',
//   },
//   balanceLabel: {
//     color: '#999',
//     fontSize: 11,
//   },
//   balanceAmount: {
//     fontWeight: '700',
//     color: theme.colors.primary,
//     marginTop: 2,
//   },

//   // Savings Notice
//   savingsNotice: {
//     backgroundColor: '#F1F8E9',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     marginBottom: 8,
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   savingsText: {
//     color: '#7CB342',
//     fontWeight: '500',
//     flex: 1,
//   },

//   // Coupon Section
//   couponSection: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginBottom: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   couponText: {
//     flex: 1,
//     marginLeft: 10,
//     fontWeight: '600',
//     color: theme.colors.primary,
//   },

//   // Summary Card
//   summaryCard: {
//     marginHorizontal: 16,
//     marginBottom: 8,
//     borderRadius: 12,
//   },
//   summaryContent: {
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//   },
//   summaryTitle: {
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 12,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   summaryLabel: {
//     color: '#666',
//     fontWeight: '500',
//   },
//   summaryValue: {
//     fontWeight: '600',
//     color: '#1a1a1a',
//   },
//   discountLabel: {
//     color: '#666',
//   },
//   discountValue: {
//     fontWeight: '600',
//     color: theme.colors.primary,
//   },
//   summaryDivider: {
//     marginVertical: 10,
//   },
//   totalLabel: {
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   totalValue: {
//     fontWeight: '800',
//     color: theme.colors.primary,
//   },

//   // Savings Banner
//   savingsBanner: {
//     backgroundColor: theme.colors.primary,
//     marginHorizontal: 16,
//     marginBottom: 80,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   savingsBannerText: {
//     color: '#fff',
//     fontWeight: '600',
//     flex: 1,
//   },

//   // Bottom Bar
//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#E8E8E8',
//     elevation: 8,
//   },
//   confirmButton: {
//     borderRadius: 10,
//   },
//   confirmButtonContent: {
//     paddingVertical: 4,
//   },
// });



import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Text,
  Surface,
  Card,
  Chip,
  Searchbar,
  IconButton,
  Button,
  Divider,
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7CB342',
    secondary: '#558B2F',
    tertiary: '#558B2F',
    error: '#EF4444',
    background: '#F5F7FA',
  },
};

// Mock clinic data with real images
const MOCK_CLINICS = [
  {
    id: 1,
    name: 'Vetic',
    location: 'Kalyani Nagar, Pune',
    distance: 561.3,
    rating: 5.0,
    reviews: 156,
    hours: 'Open 24 hours',
    image: 'https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.jpg?s=2048x2048&w=is&k=20&c=15TsJBPquZtgf8ciMtV6wlEAccnI5RJoNcqzFY9qe80=',
    images: [
      'https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.jpg?s=2048x2048&w=is&k=20&c=15TsJBPquZtgf8ciMtV6wlEAccnI5RJoNcqzFY9qe80=',
      'https://media.istockphoto.com/id/1312706504/photo/modern-hospital-building.jpg?s=612x612&w=0&k=20&c=DT6YDRZMH5G5dL-Qv6VwPpVDpIDxJqkAY4Gg0ojGi58=',
      'https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.jpg?s=2048x2048&w=is&k=20&c=15TsJBPquZtgf8ciMtV6wlEAccnI5RJoNcqzFY9qe80=',
    ],
    categories: [
      { name: 'Entrance', icon: 'door-open' },
      { name: 'Medical', icon: 'hospital-box' },
      { name: 'Grooming', icon: 'scissors-cutting' },
      { name: 'Happy Pets', icon: 'paw' },
    ],
    amenities: ['Emergency Care', 'Surgery', 'Grooming', 'Vaccination'],
    phone: '+91 98765 43210',
    email: 'vetic.kalyani@vetician.com',
    verified: true,
  },
  {
    id: 2,
    name: 'Vetic Premium',
    location: 'NIBM, Pune',
    distance: 567.0,
    rating: 5.0,
    reviews: 98,
    hours: 'Open 24 hours',
    image: 'https://media.istockphoto.com/id/1312706504/photo/modern-hospital-building.jpg?s=612x612&w=0&k=20&c=DT6YDRZMH5G5dL-Qv6VwPpVDpIDxJqkAY4Gg0ojGi58=',
    images: [
      'https://media.istockphoto.com/id/1312706504/photo/modern-hospital-building.jpg?s=612x612&w=0&k=20&c=DT6YDRZMH5G5dL-Qv6VwPpVDpIDxJqkAY4Gg0ojGi58=',
      'https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.jpg?s=2048x2048&w=is&k=20&c=15TsJBPquZtgf8ciMtV6wlEAccnI5RJoNcqzFY9qe80=',
      'https://media.istockphoto.com/id/1312706504/photo/modern-hospital-building.jpg?s=612x612&w=0&k=20&c=DT6YDRZMH5G5dL-Qv6VwPpVDpIDxJqkAY4Gg0ojGi58=',
    ],
    categories: [
      { name: 'Entrance', icon: 'door-open' },
      { name: 'Medical', icon: 'hospital-box' },
      { name: 'Grooming', icon: 'scissors-cutting' },
      { name: 'Happy Pets', icon: 'paw' },
    ],
    amenities: ['24/7 Emergency', 'ICU', 'Lab Services', 'Pet Pharmacy'],
    phone: '+91 98765 43211',
    email: 'vetic.nibm@vetician.com',
    verified: true,
  },
  {
    id: 3,
    name: 'Pet Care Hospital',
    location: 'Whitefield, Bangalore',
    distance: 320.5,
    rating: 4.8,
    reviews: 203,
    hours: 'Open 24 hours',
    image: 'https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.jpg?s=2048x2048&w=is&k=20&c=15TsJBPquZtgf8ciMtV6wlEAccnI5RJoNcqzFY9qe80=',
    images: [
      'https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.jpg?s=2048x2048&w=is&k=20&c=15TsJBPquZtgf8ciMtV6wlEAccnI5RJoNcqzFY9qe80=',
      'https://media.istockphoto.com/id/1312706504/photo/modern-hospital-building.jpg?s=612x612&w=0&k=20&c=DT6YDRZMH5G5dL-Qv6VwPpVDpIDxJqkAY4Gg0ojGi58=',
      'https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.jpg?s=2048x2048&w=is&k=20&c=15TsJBPquZtgf8ciMtV6wlEAccnI5RJoNcqzFY9qe80=',
    ],
    categories: [
      { name: 'Entrance', icon: 'door-open' },
      { name: 'Medical', icon: 'hospital-box' },
      { name: 'Grooming', icon: 'scissors-cutting' },
      { name: 'Happy Pets', icon: 'paw' },
    ],
    amenities: ['Vaccination', 'Dental Care', 'Nutrition Counseling', 'Surgery'],
    phone: '+91 98765 43212',
    email: 'petcare.whitefield@vetician.com',
    verified: true,
  },
  {
    id: 4,
    name: 'Happy Paws Clinic',
    location: 'Koramangala, Bangalore',
    distance: 285.8,
    rating: 4.9,
    reviews: 142,
    hours: 'Open 24 hours',
    image: 'https://media.istockphoto.com/id/1312706504/photo/modern-hospital-building.jpg?s=612x612&w=0&k=20&c=DT6YDRZMH5G5dL-Qv6VwPpVDpIDxJqkAY4Gg0ojGi58=',
    images: [
      'https://media.istockphoto.com/id/1312706504/photo/modern-hospital-building.jpg?s=612x612&w=0&k=20&c=DT6YDRZMH5G5dL-Qv6VwPpVDpIDxJqkAY4Gg0ojGi58=',
      'https://media.istockphoto.com/id/1312706413/photo/modern-hospital-building.jpg?s=2048x2048&w=is&k=20&c=15TsJBPquZtgf8ciMtV6wlEAccnI5RJoNcqzFY9qe80=',
      'https://media.istockphoto.com/id/1312706504/photo/modern-hospital-building.jpg?s=612x612&w=0&k=20&c=DT6YDRZMH5G5dL-Qv6VwPpVDpIDxJqkAY4Gg0ojGi58=',
    ],
    categories: [
      { name: 'Entrance', icon: 'door-open' },
      { name: 'Medical', icon: 'hospital-box' },
      { name: 'Grooming', icon: 'scissors-cutting' },
      { name: 'Happy Pets', icon: 'paw' },
    ],
    amenities: ['Emergency Care', 'Surgery', 'Dental Care', 'Lab Services'],
    phone: '+91 98765 43213',
    email: 'happypaws.koramangala@vetician.com',
    verified: true,
  },
];

export default function ClinicDetailScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClinics, setFilteredClinics] = useState(MOCK_CLINICS);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState({});

  // Filter clinics based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClinics(MOCK_CLINICS);
    } else {
      const filtered = MOCK_CLINICS.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clinic.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClinics(filtered);
    }
  }, [searchQuery]);

  const handleClinicPress = (clinic) => {
    setSelectedClinic(clinic);
  };

  const handleCollapse = () => {
    setSelectedClinic(null);
  };

  // Clinic Card Component
  const ClinicCard = ({ clinic, isExpanded }) => (
    <Card
      style={[
        styles.clinicCard,
        isExpanded && styles.clinicCardExpanded,
      ]}
      onPress={() => handleClinicPress(clinic)}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: clinic.image }}
          style={styles.clinicImage}
          resizeMode="cover"
        />

        {/* Rating Badge */}
        <Surface style={styles.ratingBadge}>
          <MaterialIcons name="star" size={16} color="#FFA500" />
          <Text style={styles.ratingText}>{clinic.rating}</Text>
        </Surface>

        {/* Verified Badge */}
        {clinic.verified && (
          <Surface style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={14} color="#10B981" />
            <Text style={styles.verifiedText}>Verified</Text>
          </Surface>
        )}

        {/* Distance Badge */}
        <Surface style={styles.distanceBadge}>
          <MaterialIcons name="location-on" size={14} color={theme.colors.primary} />
          <Text style={styles.distanceText}>{clinic.distance} KM</Text>
        </Surface>
      </View>

      {/* Info Section */}
      <Card.Content style={styles.cardContent}>
        {/* Clinic Name and Location */}
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={styles.clinicName}>
              {clinic.name}
            </Text>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={14} color="#999" />
              <Text variant="labelSmall" style={styles.location}>
                {clinic.location}
              </Text>
            </View>
          </View>
        </View>

        {/* Hours and Status */}
        <View style={styles.hoursSection}>
          <MaterialIcons name="access-time" size={14} color={theme.colors.primary} />
          <Text style={styles.hoursText}>{clinic.hours}</Text>
        </View>

        {/* Category Tabs */}
        <View style={styles.categorySection}>
          {clinic.categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryTab}
            >
              <MaterialCommunityIcons
                name={category.icon}
                size={16}
                color={theme.colors.primary}
              />
              <Text variant="labelSmall" style={styles.categoryTabText}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amenities (shown when expanded) */}
        {isExpanded && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.amenitiesSection}>
              <Text variant="titleSmall" style={styles.amenitiesTitle}>
                Amenities
              </Text>
              <View style={styles.amenitiesGrid}>
                {clinic.amenities.map((amenity, index) => (
                  <Chip
                    key={index}
                    label={amenity}
                    size="small"
                    icon="check-circle"
                    style={styles.amenityChip}
                    textStyle={styles.amenityChipText}
                  />
                ))}
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.contactSection}>
              <Text variant="titleSmall" style={styles.contactTitle}>
                Contact
              </Text>
              <View style={styles.contactItem}>
                <MaterialIcons name="phone" size={16} color={theme.colors.primary} />
                <Text variant="labelSmall" style={styles.contactText}>
                  {clinic.phone}
                </Text>
              </View>
              <View style={styles.contactItem}>
                <MaterialIcons name="email" size={16} color={theme.colors.primary} />
                <Text variant="labelSmall" style={styles.contactText}>
                  {clinic.email}
                </Text>
              </View>
            </View>

            {/* Image Gallery */}
            <View style={styles.gallerySection}>
              <Text variant="titleSmall" style={styles.galleryTitle}>
                Gallery
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.galleryScroll}
              >
                {clinic.images.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.galleryImage,
                      activeImageIndex[clinic.id] === index && styles.galleryImageActive,
                    ]}
                    onPress={() => setActiveImageIndex({ ...activeImageIndex, [clinic.id]: index })}
                  >
                    <Image
                      source={{ uri: image }}
                      style={styles.galleryImageInner}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                buttonColor={theme.colors.primary}
                style={styles.bookButton}
                contentStyle={styles.bookButtonContent}
                labelStyle={styles.bookButtonLabel}
                icon="calendar"
              >
                Book Appointment
              </Button>
              <Button
                mode="outlined"
                textColor={theme.colors.primary}
                style={styles.callButton}
                contentStyle={styles.callButtonContent}
                labelStyle={styles.callButtonLabel}
                icon="phone"
              >
                Call Now
              </Button>
            </View>
          </>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        {/* Header with Search Bar and Back Button */}
        <Surface style={styles.header}>
          <View style={styles.headerContent}>
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor={theme.colors.primary}
              onPress={() => router.back()}
              style={styles.backButton}
            />
            <Searchbar
              placeholder="Search clinics..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchBar}
              icon="magnify"
              clearIcon="close"
              inputStyle={styles.searchBarInput}
            />
          </View>
        </Surface>

        {/* Results Count */}
        {filteredClinics.length > 0 && (
          <View style={styles.resultsHeader}>
            <Text variant="labelMedium" style={styles.resultsCount}>
              {filteredClinics.length} clinic{filteredClinics.length !== 1 ? 's' : ''} found
            </Text>
          </View>
        )}

        {/* Clinics List */}
        {filteredClinics.length > 0 ? (
          <FlatList
            data={filteredClinics}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <ClinicCard
                  clinic={item}
                  isExpanded={selectedClinic?.id === item.id}
                />
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={!selectedClinic}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="hospital-box" size={64} color="#DDD" />
            <Text variant="titleMedium" style={styles.emptyText}>
              No clinics found
            </Text>
            <Text variant="labelSmall" style={styles.emptySubtext}>
              Try searching with a different keyword
            </Text>
          </View>
        )}

        {/* Close Expanded Card */}
        {selectedClinic && (
          <TouchableOpacity
            style={styles.overlay}
            onPress={handleCollapse}
            activeOpacity={0.3}
          />
        )}
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header Styles
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 12,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    margin: 0,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    height: 44,
  },
  searchBarInput: {
    fontSize: 14,
  },

  // Results Header
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  resultsCount: {
    color: '#666',
    fontWeight: '600',
  },

  // List Content
  listContent: {
    padding: 12,
    paddingBottom: 20,
  },
  cardWrapper: {
    marginBottom: 12,
  },

  // Clinic Card Styles
  clinicCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
  },
  clinicCardExpanded: {
    elevation: 8,
  },

  // Image Container
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#000',
  },
  clinicImage: {
    width: '100%',
    height: '100%',
  },

  // Badges
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  ratingText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  verifiedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  verifiedText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 12,
  },

  distanceBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  distanceText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },

  // Card Content
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  // Header Section
  headerSection: {
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
  },
  clinicName: {
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    color: '#999',
    fontWeight: '500',
  },

  // Hours Section
  hoursSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  hoursText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },

  // Category Tabs
  categorySection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 10,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  categoryTabText: {
    color: '#666',
    fontWeight: '600',
  },

  // Divider
  divider: {
    marginVertical: 14,
  },

  // Amenities Section
  amenitiesSection: {
    marginBottom: 16,
  },
  amenitiesTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    backgroundColor: '#F1F8E9',
    height: 32,
  },
  amenityChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  // Contact Section
  contactSection: {
    marginBottom: 16,
  },
  contactTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    paddingVertical: 8,
  },
  contactText: {
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },

  // Gallery Section
  gallerySection: {
    marginBottom: 16,
  },
  galleryTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  galleryScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  galleryImage: {
    width: 120,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  galleryImageActive: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },
  galleryImageInner: {
    width: '100%',
    height: '100%',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  bookButton: {
    flex: 1,
    borderRadius: 10,
  },
  bookButtonContent: {
    paddingVertical: 6,
  },
  bookButtonLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  callButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  callButtonContent: {
    paddingVertical: 6,
  },
  callButtonLabel: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#999',
    marginTop: 8,
  },

  // Overlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: -1,
  },
});
