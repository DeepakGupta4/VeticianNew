// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   RefreshControl,
//   Dimensions,
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import { LinearGradient } from 'expo-linear-gradient';
// import {
//   Menu,
//   Heart,
//   MapPin,
//   Calendar,
//   Bell,
//   Plus,
//   ChevronRight,
//   Activity,
//   Clock,
//   Stethoscope,
//   Users,
// } from 'lucide-react-native';
// import { useRouter, useFocusEffect } from 'expo-router';
// import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Location from 'expo-location';
// import ApiService from '../../../services/api';
// import PetDetailModal from '../../../components/petparent/home/PetDetailModal';
// import Sidebar from '../../../components/Sidebar';
// import socketService from '../../../services/socket';
// import IncomingCallScreen from '../../../components/IncomingCallScreen';
// import SimpleVideoCall from '../../../components/SimpleVideoCall';
// import { useDispatch } from 'react-redux';
// import { getPetsByUserId } from '../../../store/slices/authSlice';

// const { width } = Dimensions.get('window');

// export default function Home() {
//   const user = useSelector((state) => state.auth.user);
//   const pets = useSelector((state) => state.auth?.userPets?.data || []);
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const [parentData, setParentData] = useState(null);
//   const [dashboard, setDashboard] = useState(null);
//   const [clinics, setClinics] = useState([]);
//   const [paravets, setParavets] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedPet, setSelectedPet] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [userLocation, setUserLocation] = useState(null);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [showIncomingCall, setShowIncomingCall] = useState(false);
//   const [inVideoCall, setInVideoCall] = useState(false);
//   const [callToken, setCallToken] = useState(null);
//   const [roomName, setRoomName] = useState(null);

//   // Get user location
//   const getUserLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.log('⚠️ Location permission denied');
//         return;
//       }
//       const location = await Location.getCurrentPositionAsync({});
//       setUserLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//       console.log('📍 User Location:', location.coords.latitude, location.coords.longitude);
//     } catch (error) {
//       console.error('❌ Error getting location:', error);
//     }
//   };

//   // Calculate distance
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371;
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return (R * c).toFixed(1);
//   };

//   // Fetch Parent Data
//   const fetchParentData = async () => {
//     try {
//       const userId = await AsyncStorage.getItem('userId');
//       if (userId) {
//         const data = await ApiService.getParentById(userId);
//         if (data?.parent?.[0]) {
//           setParentData(data.parent[0]);
//         }
//       }
//     } catch (err) {
//       console.error('❌ Parent data fetch failed:', err.message);
//     }
//   };

//   // Fetch Dashboard Stats - Skip for non-veterinarians
//   const fetchDashboard = async () => {
//     try {
//       if (user?.role === 'veterinarian') {
//         const data = await ApiService.get('/users/dashboard-stats');
//         setDashboard(data);
//       }
//     } catch (err) {
//       console.error('❌ Dashboard fetch failed:', err.message);
//     }
//   };



//   // Fetch Nearby Clinics
//   const fetchClinics = async () => {
//     try {
//       console.log('🔍 Dashboard: Fetching clinics with location:', userLocation);
      
//       const locationParams = userLocation ? {
//         userLat: userLocation.latitude,
//         userLon: userLocation.longitude
//       } : {};
      
//       const data = await ApiService.getAllVerifiedClinics(locationParams);
//       console.log('📦 Raw API Response:', JSON.stringify(data, null, 2));
      
//       const clinicsList = Array.isArray(data) ? data : (data?.data || []);
      
//       const clinicsWithDistance = clinicsList.map(clinic => {
//         const distance = clinic.clinicDetails?.distance || 'N/A';
//         const clinicId = clinic.clinicDetails?.clinicId || clinic.clinicDetails?._id || clinic._id;
        
//         // HARDCODED FIX: Map clinic IDs to vet IDs
//         const clinicToVetMap = {
//           '699c3adfa1d9bd9c5e8f7316': '699bdb473b40fb36af74467e', // Deepak's Clinic -> Deepak's Vet ID
//           '699748685c663a0a76a231cb': '699bdb473b40fb36af74467e'  // TestClinic -> Same Vet ID
//         };
        
//         const vetId = clinic.veterinarianDetails?.vetId || clinicToVetMap[clinicId] || clinicId;
        
//         console.log(`🏥 Clinic: ${clinic.clinicDetails?.clinicName}, Clinic ID: ${clinicId}, Vet ID: ${vetId}`);
        
//         return { 
//           ...clinic, 
//           distance, 
//           clinicName: clinic.clinicDetails?.clinicName || clinic.clinicName, 
//           establishmentType: clinic.clinicDetails?.establishmentType || clinic.establishmentType, 
//           city: clinic.clinicDetails?.city || clinic.city, 
//           profilePhotoUrl: clinic.veterinarian?.profilePhotoUrl || clinic.veterinarianDetails?.profilePhotoUrl, 
//           _id: clinicId,
//           vetId: vetId
//         };
//       });

//       clinicsWithDistance.sort((a, b) => {
//         const distA = a.distance === 'N/A' ? Infinity : parseFloat(a.distance);
//         const distB = b.distance === 'N/A' ? Infinity : parseFloat(b.distance);
//         return distA - distB;
//       });
//       setClinics(clinicsWithDistance);
//       console.log(`📊 Dashboard: Total clinics loaded: ${clinicsWithDistance.length}`);
//     } catch (err) {
//       console.error('❌ Dashboard clinics fetch failed:', err.message);
//       setClinics([]);
//     }
//   };

//   // Fetch Upcoming Appointments - Skip for now
//   const fetchAppointments = async () => {
//     try {
//       setAppointments([]);
//     } catch (err) {
//       console.error('❌ Appointments fetch failed:', err.message);
//     }
//   };

//   const fetchNotificationCount = async () => {
//     try {
//       setNotificationCount(0);
//     } catch (err) {
//       setNotificationCount(0);
//     }
//   };

//   const loadData = async () => {
//     await Promise.all([
//       fetchDashboard(),
//       fetchClinics(),
//       fetchParavets(),
//       fetchAppointments(),
//       fetchNotificationCount(),
//     ]);
//   };

//   // Fetch Paravets
//   const fetchParavets = async () => {
//     try {
//       const locationParams = userLocation ? {
//         userLat: userLocation.latitude,
//         userLon: userLocation.longitude
//       } : {};
      
//       console.log('🔍 Fetching paravets with location:', locationParams);
//       const data = await ApiService.get('/paravet/verified', locationParams);
//       console.log('📦 Paravet API Response:', JSON.stringify(data, null, 2));
      
//       const paravetsList = Array.isArray(data) ? data : (data?.data || []);
      
//       // Calculate distance if not provided by backend
//       const paravetsWithDistance = paravetsList.map(paravet => {
//         let distance = paravet.distance || 'N/A';
        
//         // If backend didn't calculate distance, calculate it here
//         if (distance === 'N/A' && userLocation && paravet.location?.coordinates) {
//           const [lon, lat] = paravet.location.coordinates;
//           distance = calculateDistance(
//             userLocation.latitude,
//             userLocation.longitude,
//             lat,
//             lon
//           );
//         }
        
//         return { ...paravet, distance };
//       });
      
//       // Sort by distance
//       paravetsWithDistance.sort((a, b) => {
//         const distA = a.distance === 'N/A' ? Infinity : parseFloat(a.distance);
//         const distB = b.distance === 'N/A' ? Infinity : parseFloat(b.distance);
//         return distA - distB;
//       });
      
//       setParavets(paravetsWithDistance.slice(0, 4));
//       console.log(`📊 Dashboard: Total paravets loaded: ${paravetsWithDistance.length}`);
//     } catch (err) {
//       console.error('❌ Dashboard paravets fetch failed:', err.message);
//       setParavets([]);
//     }
//   };

//   useEffect(() => {
//     const init = async () => {
//       await getUserLocation();
//       await fetchParentData();
//       await loadData();
      
//       // Setup socket for incoming calls
//       const userId = await AsyncStorage.getItem('userId');
//       if (userId) {
//         socketService.connect(userId, 'petparent');
        
//         const handleIncomingCall = (callData) => {
//           console.log('📞 Incoming call received:', callData);
//           setIncomingCall(callData);
//           setShowIncomingCall(true);
//         };
        
//         socketService.onIncomingCall(handleIncomingCall);
//       }
//     };
//     init();

//     return () => {
//       if (socketService.socket) {
//         socketService.socket.off('incoming-call');
//       }
//     };
//   }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       console.log('🔄 Dashboard focused - fetching pets');
//       dispatch(getPetsByUserId()).then((result) => {
//         if (result.payload) {
//           console.log('✅ Pets fetched successfully:', result.payload.length, 'pets');
//         }
//       });
//     }, [])
//   );

//   useEffect(() => {
//     if (userLocation) {
//       fetchClinics();
//       fetchParavets();
//     }
//   }, [userLocation]);



//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadData();
//     setRefreshing(false);
//   };

//   const navigateTo = (screen) => router.push(screen);

//   const handlePetPress = (pet) => {
//     setSelectedPet(pet);
//     setModalVisible(true);
//   };

//   const handleClinicPress = (clinic) => {
//     console.log('👉 Clinic pressed:', clinic.clinicName);
//     console.log('👉 Clinic ID:', clinic._id);
//     console.log('👉 Vet ID:', clinic.vetId);
    
//     router.push({
//       pathname: 'pages/ClinicDetailScreen',
//       params: {
//         clinicId: clinic._id,
//         vetId: clinic.vetId,
//         clinicName: clinic.clinicName,
//         establishmentType: clinic.establishmentType,
//         city: clinic.clinicDetails?.city || clinic.city,
//         locality: clinic.clinicDetails?.locality,
//         streetAddress: clinic.clinicDetails?.streetAddress,
//         distance: clinic.distance,
//         profilePhotoUrl: clinic.profilePhotoUrl
//       }
//     });
//   };

//   const handleAppointmentPress = (appointment) => {
//     router.push({ pathname: 'AppointmentDetail', params: { appointment } });
//   };

//   const handleAcceptCall = () => {
//     setShowIncomingCall(false);
//     setCallToken(incomingCall?.token);
//     setRoomName(incomingCall?.roomName);
//     setInVideoCall(true);
    
//     socketService.emitCallResponse({
//       callId: incomingCall?.callId,
//       roomName: incomingCall?.roomName,
//       accepted: true,
//       userId: user?._id || user?.id
//     });

//     socketService.emitJoinCall({
//       roomName: incomingCall?.roomName,
//       userId: user?._id || user?.id
//     });
//   };

//   const handleRejectCall = () => {
//     setShowIncomingCall(false);
//     setIncomingCall(null);
    
//     socketService.emitCallResponse({
//       callId: incomingCall?.callId,
//       roomName: incomingCall?.roomName,
//       accepted: false,
//       userId: user?._id || user?.id
//     });
//   };

//   const handleCallEnd = () => {
//     setInVideoCall(false);
//     setCallToken(null);
//     setRoomName(null);
//     setIncomingCall(null);
//   };

//   if (inVideoCall && callToken && roomName) {
//     return (
//       <SimpleVideoCall
//         token={callToken}
//         roomName={roomName}
//         onCallEnd={handleCallEnd}
//         remoteUserData={incomingCall?.doctorData}
//         isInitiator={false}
//         callId={incomingCall?.callId}
//       />
//     );
//   }

//   // Render Pet Card - IMPROVED VERSION
//   const renderPetCard = ({ item }) => {
//     return (
//       <TouchableOpacity
//         style={styles.petCard}
//         onPress={() => handlePetPress(item)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.petImageContainer}>
//           {item.petPhoto || item.image || item.photoUrl ? (
//             <Image 
//               source={{ uri: item.petPhoto || item.image || item.photoUrl }} 
//               style={styles.petImage} 
//             />
//           ) : (
//             <LinearGradient
//               colors={['#4E8D7C', '#6BA896']}
//               style={styles.petImagePlaceholder}
//             >
//               <FontAwesome5 name="paw" size={28} color="#fff" />
//             </LinearGradient>
//           )}
//         </View>
//         <View style={styles.petInfo}>
//           <Text style={styles.petName} numberOfLines={1}>
//             {item.name || 'Unnamed Pet'}
//           </Text>
//           <Text style={styles.petBreed} numberOfLines={1}>
//             {item.breed || item.species || 'Unknown'}
//           </Text>
//           <View style={styles.petMetaRow}>
//             <View style={styles.petMeta}>
//               <Ionicons name="calendar-outline" size={12} color="#666" />
//               <Text style={styles.petMetaText}>
//                 {item.age || item.ageYears ? `${item.age || item.ageYears} yrs` : 'N/A'}
//               </Text>
//             </View>
//             <View style={styles.petMeta}>
//               <Ionicons
//                 name={item.gender?.toLowerCase() === 'male' ? 'male' : 'female'}
//                 size={12}
//                 color="#666"
//               />
//               <Text style={styles.petMetaText}>
//                 {item.gender ? item.gender.charAt(0).toUpperCase() : 'N/A'}
//               </Text>
//             </View>
//           </View>
//         </View>
//         <ChevronRight size={20} color="#999" />
//       </TouchableOpacity>
//     );
//   };

//   // Render Paravet Card
//   const renderParavetCard = ({ item }) => (
//     <TouchableOpacity
//       style={styles.clinicCard}
//       onPress={() => router.push({
//         pathname: 'pages/ParavetDetailScreen',
//         params: {
//           paravetId: item._id,
//           name: item.name,
//           photo: item.photo,
//           experience: item.experience,
//           city: item.city,
//           distance: item.distance,
//           services: JSON.stringify(item.experience?.areasOfExpertise?.value || [])
//         }
//       })}
//       activeOpacity={0.7}
//     >
//       <View style={styles.clinicImageContainer}>
//         {item.photo ? (
//           <Image source={{ uri: item.photo }} style={styles.clinicImage} />
//         ) : (
//           <LinearGradient
//             colors={['#E8F5E9', '#C8E6C9']}
//             style={styles.clinicImagePlaceholder}
//           >
//             <MaterialIcons name="person" size={40} color="#4E8D7C" />
//           </LinearGradient>
//         )}
//       </View>
//       <Text style={styles.clinicName} numberOfLines={2}>
//         {item.name}
//       </Text>
//       <Text style={styles.clinicType} numberOfLines={1}>
//         {item.specialization || 'Paravet'}
//       </Text>
//       <View style={styles.clinicDistance}>
//         <MapPin size={12} color={item.distance !== 'N/A' ? "#4E8D7C" : "#FF6B6B"} />
//         <Text style={[styles.clinicDistanceText, { 
//           color: item.distance !== 'N/A' ? "#4E8D7C" : "#FF6B6B" 
//         }]}>
//           {item.distance !== 'N/A' ? `${item.distance} km away` : 'Distance unavailable'}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   // Render Clinic Card
//   const renderClinicCard = ({ item }) => (
//     <TouchableOpacity
//       style={styles.clinicCard}
//       onPress={() => handleClinicPress(item)}
//       activeOpacity={0.7}
//     >
//       <View style={styles.clinicImageContainer}>
//         {item.profilePhotoUrl ? (
//           <Image source={{ uri: item.profilePhotoUrl }} style={styles.clinicImage} />
//         ) : (
//           <LinearGradient
//             colors={['#E8F5E9', '#C8E6C9']}
//             style={styles.clinicImagePlaceholder}
//           >
//             <MaterialIcons name="local-hospital" size={40} color="#4E8D7C" />
//           </LinearGradient>
//         )}
//       </View>
//       <Text style={styles.clinicName} numberOfLines={2}>
//         {item.clinicName}
//       </Text>
//       <Text style={styles.clinicType} numberOfLines={1}>
//         {item.establishmentType}
//       </Text>
//       <View style={styles.clinicDistance}>
//         <MapPin size={12} color={item.distance !== 'N/A' ? "#4E8D7C" : "#FF6B6B"} />
//         <Text style={[styles.clinicDistanceText, { 
//           color: item.distance !== 'N/A' ? "#4E8D7C" : "#FF6B6B" 
//         }]}>
//           {item.distance !== 'N/A' ? `${item.distance} km away` : 'Distance unavailable'}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   // Render Appointment Card
//   const renderAppointmentCard = ({ item }) => (
//     <TouchableOpacity
//       style={styles.appointmentCard}
//       onPress={() => handleAppointmentPress(item)}
//       activeOpacity={0.7}
//     >
//       <View style={styles.appointmentLeft}>
//         <View style={styles.appointmentDateBox}>
//           <Text style={styles.appointmentDay}>
//             {new Date(item.date).getDate()}
//           </Text>
//           <Text style={styles.appointmentMonth}>
//             {new Date(item.date).toLocaleString('default', { month: 'short' })}
//           </Text>
//         </View>
//       </View>
//       <View style={styles.appointmentMiddle}>
//         <Text style={styles.appointmentPet} numberOfLines={1}>
//           {item.petName || 'Pet'}
//         </Text>
//         <Text style={styles.appointmentClinic} numberOfLines={1}>
//           {item.clinicName}
//         </Text>
//         <View style={styles.appointmentTimeRow}>
//           <Clock size={12} color="#666" />
//           <Text style={styles.appointmentTime}>{item.time}</Text>
//         </View>
//       </View>
//       <View style={styles.appointmentRight}>
//         <View
//           style={[
//             styles.appointmentStatus,
//             { backgroundColor: item.status === 'confirmed' ? '#E8F5E9' : '#FFF3E0' },
//           ]}
//         >
//           <Text
//             style={[
//               styles.appointmentStatusText,
//               { color: item.status === 'confirmed' ? '#2E7D32' : '#F57C00' },
//             ]}
//           >
//             {item.status}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   // Render Quick Action Button
//   const QuickActionButton = ({ icon: Icon, label, onPress, gradient }) => (
//     <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
//       <LinearGradient colors={gradient} style={styles.quickActionGradient}>
//         <Icon size={32} color="#fff" />
//         <Text style={styles.quickActionLabel}>{label}</Text>
//       </LinearGradient>
//     </TouchableOpacity>
//   );

//   return (
//     <>
//       <ScrollView
//         style={styles.container}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4E8D7C']} />
//         }
//       >
//         {/* Header with Gradient */}
//         <LinearGradient colors={['#4E8D7C', '#6BA896']} style={styles.header}>
//           <View style={styles.headerTop}>
//             <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuButton}>
//               <Menu size={24} color="#fff" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => router.push('pages/Notifications')} style={styles.notificationButton}>
//               <Bell size={24} color="#fff" />
//               {notificationCount > 0 && (
//                 <View style={styles.notificationBadge}>
//                   <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>
//           <View style={styles.headerContent}>
//             <View style={styles.headerTextContainer}>
//               <Text style={styles.greeting}>Hello,</Text>
//               <Text style={styles.userName}>{parentData?.name || user?.name || 'Pet Parent'}!</Text>
//               <Text style={styles.subGreeting}>
//                 {pets.length > 0
//                   ? `You have ${pets.length} ${pets.length === 1 ? 'pet' : 'pets'}`
//                   : 'Add your first pet'}
//               </Text>
//             </View>
//             {parentData?.image && (
//               <Image source={{ uri: parentData.image }} style={styles.profileImage} />
//             )}
//           </View>
//         </LinearGradient>

//         {/* Quick Actions */}
//         <View style={styles.quickActionsContainer}>
//           <View style={styles.quickActionRow}>
//             <QuickActionButton
//               icon={Plus}
//               label="Add Pet"
//               onPress={() => navigateTo('pages/PetDetail')}
//               gradient={['#FF6B6B', '#FF8E8E']}
//             />
//             <QuickActionButton
//               icon={Calendar}
//               label="Book"
//               onPress={() => navigateTo('pages/BookScreen')}
//               gradient={['#4E8D7C', '#6BA896']}
//             />
//           </View>
//           <View style={styles.quickActionRow}>
//             <QuickActionButton
//               icon={MapPin}
//               label="Clinics"
//               onPress={() => navigateTo('pages/ClinicListScreen')}
//               gradient={['#5C6BC0', '#7986CB']}
//             />
//             <QuickActionButton
//               icon={Activity}
//               label="Records"
//               onPress={() => navigateTo('pages/MedicalRecords')}
//               gradient={['#FFA726', '#FFB74D']}
//             />
//           </View>
//         </View>

//         {/* Dashboard Stats */}
//         {dashboard && (
//           <View style={styles.statsContainer}>
//             <View style={styles.statCard}>
//               <View style={styles.statIconContainer}>
//                 <Heart size={24} color="#FF6B6B" />
//               </View>
//               <Text style={styles.statValue}>{pets.length}</Text>
//               <TouchableOpacity onPress={() => navigateTo('pages/PetList')}>
//                 <Text style={styles.seeAll}>My Pets</Text>
//               </TouchableOpacity>
//             </View>
            
//             <View style={styles.statCard}>
//               <View style={styles.statIconContainer}>
//                 <Calendar size={24} color="#4E8D7C" />
//               </View>
//               <Text style={styles.statValue}>{dashboard?.stats?.appointments || 0}</Text>
//               <TouchableOpacity onPress={() => navigateTo('pages/Appointments')}>
//                 <Text style={styles.seeAll}>Appointments</Text>
//               </TouchableOpacity>
//             </View>
            
//             <View style={styles.statCard}>
//               <View style={styles.statIconContainer}>
//                 <Stethoscope size={24} color="#5C6BC0" />
//               </View>
//               <Text style={styles.statValue}>{dashboard?.stats?.visits || 0}</Text>
//               <Text style={styles.statLabel}>Visits</Text>
//             </View>
//           </View>
//         )}

//         {/* Upcoming Appointments */}
//         {appointments.length > 0 && (
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
//               <TouchableOpacity onPress={() => navigateTo('pages/Appointments')}>
//                 <Text style={styles.seeAll}>See All</Text>
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={appointments.slice(0, 3)}
//               renderItem={renderAppointmentCard}
//               keyExtractor={(item, index) => item._id || index.toString()}
//               scrollEnabled={false}
//             />
//           </View>
//         )}

//         {/* My Pets - IMPROVED VERSION */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>My Pets</Text>
//             <View style={{ flexDirection: 'row', gap: 12 }}>
//               <TouchableOpacity onPress={() => navigateTo('pages/MyBookings')}>
//                 <Text style={styles.seeAll}>My Bookings</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => navigateTo('pages/PetList')}>
//                 <Text style={styles.seeAll}>See All</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
          
          
//           {pets.length > 0 ? (
//             <FlatList
//               data={pets}
//               renderItem={renderPetCard}
//               keyExtractor={(item, index) => item._id || item.id || index.toString()}
//               scrollEnabled={false}
//               extraData={pets} // Force re-render when pets change
//             />
//           ) : (
//             <View style={styles.emptyState}>
//               <FontAwesome5 name="paw" size={48} color="#ccc" />
//               <Text style={styles.emptyStateText}>No pets added yet</Text>
//               <TouchableOpacity
//                 style={styles.addPetButton}
//                 onPress={() => navigateTo('pages/PetDetail')}
//               >
//                 <Text style={styles.addPetButtonText}>Add Your First Pet</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Nearby Clinics */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Nearby Clinics</Text>
//             <TouchableOpacity onPress={() => navigateTo('pages/ClinicListScreen')}>
//               <Text style={styles.seeAll}>View All</Text>
//             </TouchableOpacity>
//           </View>
//           {clinics.length > 0 ? (
//             <FlatList
//               horizontal
//               data={clinics.slice(0, 4)}
//               renderItem={renderClinicCard}
//               keyExtractor={(item) => item._id}
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.clinicsList}
//             />
//           ) : (
//             <View style={styles.emptyState}>
//               <MaterialIcons name="local-hospital" size={48} color="#ccc" />
//               <Text style={styles.emptyStateText}>No verified clinics available yet</Text>
//               <Text style={styles.emptyStateSubText}>Clinics will appear here once verified by admin</Text>
//             </View>
//           )}
//         </View>

//         {/* Nearby Paravets */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Nearby Paravets</Text>
//             <TouchableOpacity onPress={() => navigateTo('pages/ParavetListScreen')}>
//               <Text style={styles.seeAll}>View All</Text>
//             </TouchableOpacity>
//           </View>
//           {paravets.length > 0 ? (
//             <FlatList
//               horizontal
//               data={paravets}
//               renderItem={renderParavetCard}
//               keyExtractor={(item) => item._id}
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.clinicsList}
//             />
//           ) : (
//             <TouchableOpacity 
//               style={styles.paravetBanner}
//               onPress={() => navigateTo('pages/ParavetListScreen')}
//             >
//               <View style={styles.paravetBannerContent}>
//                 <MaterialIcons name="person" size={40} color="#4E8D7C" />
//                 <View style={styles.paravetBannerText}>
//                   <Text style={styles.paravetBannerTitle}>Find Verified Paravets</Text>
//                   <Text style={styles.paravetBannerSubtitle}>Professional pet care at your doorstep</Text>
//                 </View>
//               </View>
//               <Ionicons name="chevron-forward" size={24} color="#4E8D7C" />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Parent Info Card (Optional) */}
//         {parentData && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>My Profile</Text>
//             <TouchableOpacity
//               style={styles.profileCard}
//               onPress={() => navigateTo('Profile')}
//             >
//               <View style={styles.profileCardLeft}>
//                 <Ionicons name="person-circle-outline" size={24} color="#4E8D7C" />
//                 <View style={styles.profileCardInfo}>
//                   <Text style={styles.profileCardName}>{parentData.name}</Text>
//                   <Text style={styles.profileCardEmail}>{parentData.email}</Text>
//                   <Text style={styles.profileCardPhone}>{parentData.phone}</Text>
//                 </View>
//               </View>
//               <ChevronRight size={20} color="#999" />
//             </TouchableOpacity>
//           </View>
//         )}

//         <View style={{ height: 30 }} />
//       </ScrollView>

//       <PetDetailModal
//         pet={selectedPet}
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//       />
//       <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
//       <IncomingCallScreen
//         visible={showIncomingCall}
//         callerData={incomingCall?.doctorData}
//         onAccept={handleAcceptCall}
//         onReject={handleRejectCall}
//       />
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F7FA',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F7FA',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   header: {
//     paddingTop: 50,
//     paddingBottom: 30,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   menuButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   notificationButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: '#FF6B6B',
//     borderRadius: 10,
//     width: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   notificationBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   greeting: {
//     fontSize: 16,
//     color: '#fff',
//     opacity: 0.9,
//   },
//   userName: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginTop: 4,
//   },
//   subGreeting: {
//     fontSize: 14,
//     color: '#fff',
//     opacity: 0.8,
//     marginTop: 4,
//   },
//   profileImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     borderWidth: 3,
//     borderColor: '#fff',
//   },
//   quickActionsContainer: {
//     paddingHorizontal: 16,
//     marginTop: -25,
//     marginBottom: 28,
//   },
//   quickActionRow: {
//     flexDirection: 'row',
//     gap: 14,
//     marginBottom: 14,
//   },
//   quickAction: {
//     flex: 1,
//     aspectRatio: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   quickActionGradient: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.2,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   quickActionLabel: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#fff',
//     fontWeight: '700',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     marginBottom: 24,
//     gap: 14,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   statIconContainer: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#F5F7FA',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//     marginTop: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   },
//   section: {
//     paddingHorizontal: 16,
//     marginBottom: 28,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//   },
//   seeAll: {
//     fontSize: 14,
//     color: '#4E8D7C',
//     fontWeight: '600',
//   },
//   petCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 18,
//     marginBottom: 14,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   petImageContainer: {
//     marginRight: 16,
//   },
//   petImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//   },
//   petImagePlaceholder: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   petInfo: {
//     flex: 1,
//   },
//   petName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//     marginBottom: 4,
//   },
//   petBreed: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 8,
//   },
//   petMetaRow: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   petMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   petMetaText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   clinicsList: {
//     paddingRight: 20,
//   },
//   clinicCard: {
//     width: 160,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 14,
//     marginRight: 14,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   clinicImageContainer: {
//     width: '100%',
//     height: 100,
//     borderRadius: 12,
//     marginBottom: 12,
//     overflow: 'hidden',
//   },
//   clinicImage: {
//     width: '100%',
//     height: '100%',
//   },
//   clinicImagePlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   clinicName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//     marginBottom: 4,
//     minHeight: 36,
//   },
//   clinicType: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//   },
//   clinicDistance: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   clinicDistanceText: {
//     fontSize: 12,
//     color: '#4E8D7C',
//     fontWeight: '600',
//   },
//   appointmentCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 18,
//     marginBottom: 14,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   appointmentLeft: {
//     marginRight: 16,
//   },
//   appointmentDateBox: {
//     width: 60,
//     height: 60,
//     borderRadius: 12,
//     backgroundColor: '#4E8D7C',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   appointmentDay: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   appointmentMonth: {
//     fontSize: 12,
//     color: '#fff',
//     textTransform: 'uppercase',
//   },
//   appointmentMiddle: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   appointmentPet: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//     marginBottom: 4,
//   },
//   appointmentClinic: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 6,
//   },
//   appointmentTimeRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   appointmentTime: {
//     fontSize: 12,
//     color: '#666',
//   },
//   appointmentRight: {
//     justifyContent: 'center',
//   },
//   appointmentStatus: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   appointmentStatusText: {
//     fontSize: 12,
//     fontWeight: '600',
//     textTransform: 'capitalize',
//   },
//   emptyState: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 40,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: '#999',
//     marginTop: 16,
//   },
//   emptyStateSubText: {
//     fontSize: 14,
//     color: '#bbb',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   addPetButton: {
//     marginTop: 16,
//     backgroundColor: '#4E8D7C',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 24,
//   },
//   addPetButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   profileCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 18,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   profileCardLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   profileCardInfo: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   profileCardName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1A1A1A',
//     marginBottom: 4,
//   },
//   profileCardEmail: {
//     fontSize: 13,
//     color: '#666',
//     marginBottom: 2,
//   },
//   profileCardPhone: {
//     fontSize: 13,
//     color: '#666',
//   },
//   paravetBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#E8F5E9',
//     padding: 18,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   paravetBannerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   paravetBannerText: {
//     marginLeft: 16,
//     flex: 1,
//   },
//   paravetBannerTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1A1A1A',
//     marginBottom: 4,
//   },
//   paravetBannerSubtitle: {
//     fontSize: 13,
//     color: '#666',
//   },
// });

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  Animated,
  Easing,
  SafeAreaView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Menu, MapPin, Search } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import ApiService from '../../../services/api';
import PetDetailModal from '../../../components/petparent/home/PetDetailModal';
import Sidebar from '../../../components/Sidebar';
import socketService from '../../../services/socket';
import IncomingCallScreen from '../../../components/IncomingCallScreen';
import SimpleVideoCall from '../../../components/SimpleVideoCall';
import { useDispatch } from 'react-redux';
import { getPetsByUserId } from '../../../store/slices/authSlice';

const { width, height } = Dimensions.get('window');

// Service data
const SERVICES = [
  {
    id: 1,
    name: 'Consultation',
    icon: 'medical-services',
    description: 'Talk to vets',
    image: 'https://media.istockphoto.com/id/885571364/photo/young-french-bulldog-on-the-visit-to-the-vet.jpg?s=2048x2048&w=is&k=20&c=VF7WbaIxHljhwCNbnBv2jtAwWsp9KG0VlqQRytzkpdA=',
  },
  {
    id: 2,
    name: 'Video Call',
    icon: 'videocam',
    description: 'Online consultation',
    image: 'https://media.istockphoto.com/id/1262282672/photo/smiling-indian-female-doctor-holding-phone-talk-to-patient-make-telemedicine-online.jpg?s=2048x2048&w=is&k=20&c=X1pSAAZ_UGzkChij6navw_fP0EyFWktBT6VOL1Rn1-Y=',
  },
  {
    id: 3,
    name: 'Pet Watching',
    icon: 'visibility',
    description: 'Pet care service',
    image: 'https://images.unsplash.com/photo-1770836037793-95bdbf190f71?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    name: 'Book Hostel',
    icon: 'home',
    description: 'Pet boarding',
    image: 'https://media.istockphoto.com/id/1212567968/photo/cute-jack-russell-dog-covered-with-ethnic-blanket-sitting-on-the-couch-at-home-lifestyle.jpg?s=2048x2048&w=is&k=20&c=5n-XNKsvJhf_TVADHOn508xgpOldNlF-hvxDD5YvspM=',
  },
  {
    id: 5,
    name: 'Day Care',
    icon: 'wb-sunny',
    description: 'Day care service',
    image: 'https://media.istockphoto.com/id/1355992960/photo/dog-boarding-concept-with-small-happy-pet-looking-out-of-carrier.jpg?s=2048x2048&w=is&k=20&c=PaZTqIX-_5XaUEFnhVY-bROUBBPs0wSKszOfQo0xlpo=',
  },
  {
    id: 6,
    name: 'Pet Training',
    icon: 'emoji-events',
    description: 'Training programs',
    image: 'https://media.istockphoto.com/id/1281120262/photo/up.jpg?s=2048x2048&w=is&k=20&c=4wapfGDWlucGmKPgqOEFrZF-DFni1ykUawyG1QBRb-8=',
  },
  {
    id: 7,
    name: 'Pet Grooming',
    icon: 'content-cut',
    description: 'Grooming service',
    image: 'https://media.istockphoto.com/id/1021301002/photo/pomeraninan-pet-groomer.jpg?s=2048x2048&w=is&k=20&c=g4AgX6GA1muepv-kxxAM4QJu9x-WyovPrY7m0VGgbts=',
  },
  {
    id: 8,
    name: 'Find Clinics',
    icon: 'add-circle',
    description: 'Nearby clinics',
    image: 'https://media.istockphoto.com/id/1545617758/photo/veterinarian-examines-a-cute-little-cat-at-the-animal-hospital.jpg?s=2048x2048&w=is&k=20&c=veZVtbQULHhdNFDpxiQ6Z71q32sNw5_x8tOYsOz-5Pk=',
  },
];

// Promotion cards
const PROMOTIONS = [
  {
    id: 1,
    title: '15% OFF',
    subtitle: 'ON GROOMING OR CONSULTATIONS',
    badge: 'LIMITED TIME',
    buttonText: 'Book Now',
    image: 'https://media.istockphoto.com/id/1355992960/photo/dog-boarding-concept-with-small-happy-pet-looking-out-of-carrier.jpg?s=2048x2048&w=is&k=20&c=PaZTqIX-_5XaUEFnhVY-bROUBBPs0wSKszOfQo0xlpo=',
  },
];

export default function VeticionHome() {
  const user = useSelector((state) => state.auth.user);
  const pets = useSelector((state) => state.auth?.userPets?.data || []);
  const router = useRouter();
  const dispatch = useDispatch();

  const [parentData, setParentData] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [inVideoCall, setInVideoCall] = useState(false);
  const [callToken, setCallToken] = useState(null);
  const [roomName, setRoomName] = useState(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const fetchParentData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const data = await ApiService.getParentById(userId);
        if (data?.parent?.[0]) {
          setParentData(data.parent[0]);
        }
      }
    } catch (err) {
      console.error('Parent data fetch failed:', err.message);
    }
  };

  const fetchClinics = async () => {
    try {
      const locationParams = userLocation
        ? {
            userLat: userLocation.latitude,
            userLon: userLocation.longitude,
          }
        : {};

      const data = await ApiService.getAllVerifiedClinics(locationParams);
      const clinicsList = Array.isArray(data) ? data : data?.data || [];

      const clinicsWithDistance = clinicsList
        .map((clinic) => ({
          ...clinic,
          distance: clinic.clinicDetails?.distance || 'N/A',
          clinicName: clinic.clinicDetails?.clinicName || clinic.clinicName,
          establishmentType: clinic.clinicDetails?.establishmentType || clinic.establishmentType,
          profilePhotoUrl:
            clinic.veterinarian?.profilePhotoUrl ||
            clinic.veterinarianDetails?.profilePhotoUrl,
          _id: clinic.clinicDetails?.clinicId || clinic._id,
        }))
        .sort((a, b) => {
          const distA = a.distance === 'N/A' ? Infinity : parseFloat(a.distance);
          const distB = b.distance === 'N/A' ? Infinity : parseFloat(b.distance);
          return distA - distB;
        });

      setClinics(clinicsWithDistance);
    } catch (err) {
      console.error('Clinics fetch failed:', err.message);
      setClinics([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      await getUserLocation();
      await fetchParentData();
      await fetchClinics();

      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        socketService.connect(userId, 'petparent');
        socketService.onIncomingCall((callData) => {
          setIncomingCall(callData);
          setShowIncomingCall(true);
        });
      }

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    };

    init();

    return () => {
      if (socketService.socket) {
        socketService.socket.off('incoming-call');
      }
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getPetsByUserId());
    }, [])
  );

  useEffect(() => {
    if (userLocation) {
      fetchClinics();
    }
  }, [userLocation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClinics();
    setRefreshing(false);
  };

  const handlePetPress = (pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const handleClinicPress = (clinic) => {
    router.push({
      pathname: 'pages/ClinicDetailScreen',
      params: {
        clinicId: clinic._id,
        clinicName: clinic.clinicName,
        establishmentType: clinic.establishmentType,
        distance: clinic.distance,
        profilePhotoUrl: clinic.profilePhotoUrl,
      },
    });
  };

  const handleAcceptCall = () => {
    setShowIncomingCall(false);
    setCallToken(incomingCall?.token);
    setRoomName(incomingCall?.roomName);
    setInVideoCall(true);
  };

  const handleRejectCall = () => {
    setShowIncomingCall(false);
    setIncomingCall(null);
  };

  const handleCallEnd = () => {
    setInVideoCall(false);
    setCallToken(null);
    setRoomName(null);
  };

  if (inVideoCall && callToken && roomName) {
    return (
      <SimpleVideoCall
        token={callToken}
        roomName={roomName}
        onCallEnd={handleCallEnd}
        isInitiator={false}
      />
    );
  }

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      activeOpacity={0.85}
      onPress={() => {
        switch (item.id) {
          case 1:
            router.push('pages/BookScreen');
            break;
          case 2:
            router.push('pages/VideoConsultation');
            break;
          case 4:
            router.push('pages/BookHostel');
            break;
          case 8:
            router.push('pages/ClinicListScreen');
            break;
          default:
            router.push('pages/Services');
        }
      }}
    >
      {item.image ? (
        <View style={styles.serviceCardWithImage}>
          <Image
            source={{ uri: item.image }}
            style={styles.serviceImage}
            resizeMode="cover"
          />
          <View style={styles.serviceImageOverlay}>
            <Text style={styles.serviceNameImage}>{item.name}</Text>
          </View>
        </View>
      ) : (
        <LinearGradient
          colors={['#7CB342', '#558B2F']}
          style={styles.serviceGradient}
        >
          <MaterialIcons name={item.icon} size={32} color="#fff" />
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.serviceDescription}>{item.description}</Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );

  const renderPromotionCard = ({ item }) => (
    <TouchableOpacity activeOpacity={0.85} style={styles.promotionCard}>
      <LinearGradient
        colors={['#7CB342', '#558B2F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.promotionGradient}
      >
        {/* Left side - Text Content */}
        <View style={styles.promotionContent}>
          <Text style={styles.promotionBadge}>{item.badge}</Text>
          <Text style={styles.promotionTitle}>{item.title}</Text>
          <Text style={styles.promotionSubtitle}>{item.subtitle}</Text>
          <TouchableOpacity style={styles.bookNowButton}>
            <Text style={styles.bookNowText}>{item.buttonText}</Text>
          </TouchableOpacity>
        </View>

        {/* Right side - Image */}
        {item.image && (
          <View style={styles.promotionImageContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.promotionImage}
              resizeMode="cover"
            />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const headerSlideStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
    opacity: fadeAnim,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7CB342']}
          />
        }
      >
        {/* Header */}
        <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => setSidebarVisible(true)}>
              <Menu size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.appName}>Vetician</Text>
            <TouchableOpacity onPress={() => router.push('Profile')}>
              <MaterialIcons name="person" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.locationBar}>
            <MapPin size={16} color="#7CB342" />
            <Text style={styles.locationLabel}>Near You</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.searchBar}>
            <Search size={16} color="#999" />
            <Text style={styles.searchPlaceholder}>Search for Clinics</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Best Services */}
        <Animated.View style={[styles.servicesSection, headerSlideStyle]}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Best Services</Text>
            <Text style={styles.sectionSubtitle}>Only for your pet</Text>
          </View>

          <View style={styles.servicesGrid}>
            {SERVICES.map((service) => (
              <View key={service.id} style={styles.gridItem}>
                {renderServiceCard({ item: service })}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Promotion */}
        <View style={styles.promotionSection}>
          <FlatList
            data={PROMOTIONS}
            renderItem={renderPromotionCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* My Pets */}
        {pets.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Pets</Text>
              <TouchableOpacity onPress={() => router.push('pages/PetList')}>
                <Text style={styles.seeAll}>See All →</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={pets.slice(0, 3)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.petCard}
                  onPress={() => handlePetPress(item)}
                >
                  <View style={styles.petImageContainer}>
                    {item.petPhoto || item.image || item.photoUrl ? (
                      <Image
                        source={{ uri: item.petPhoto || item.image || item.photoUrl }}
                        style={styles.petImage}
                      />
                    ) : (
                      <LinearGradient
                        colors={['#7CB342', '#558B2F']}
                        style={styles.petImagePlaceholder}
                      >
                        <FontAwesome5 name="paw" size={24} color="#fff" />
                      </LinearGradient>
                    )}
                  </View>
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{item.name}</Text>
                    <Text style={styles.petBreed}>{item.breed || 'Unknown'}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id || item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Nearby Clinics */}
        {clinics.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Clinics</Text>
              <TouchableOpacity onPress={() => router.push('pages/ClinicListScreen')}>
                <Text style={styles.seeAll}>View All →</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={clinics}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.clinicCardH}
                  onPress={() => handleClinicPress(item)}
                >
                  <View style={styles.clinicImageContainerH}>
                    {item.profilePhotoUrl ? (
                      <Image
                        source={{ uri: item.profilePhotoUrl }}
                        style={styles.clinicImageH}
                      />
                    ) : (
                      <LinearGradient
                        colors={['#E8F5E9', '#C8E6C9']}
                        style={styles.clinicImagePlaceholder}
                      >
                        <MaterialIcons name="local-hospital" size={32} color="#7CB342" />
                      </LinearGradient>
                    )}
                  </View>
                  <View style={styles.clinicInfoH}>
                    <Text style={styles.clinicNameH}>{item.clinicName}</Text>
                    <Text style={styles.clinicTypeH}>{item.establishmentType}</Text>
                    <View style={styles.clinicDistanceH}>
                      <MapPin size={10} color="#7CB342" />
                      <Text style={styles.clinicDistanceTextH}>
                        {item.distance !== 'N/A' ? `${item.distance} km` : 'N/A'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.clinicsListH}
              snapToInterval={width * 0.48}
              decelerationRate="fast"
              scrollEventThrottle={16}
            />
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modals */}
      <PetDetailModal
        pet={selectedPet}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      <IncomingCallScreen
        visible={showIncomingCall}
        callerData={incomingCall?.doctorData}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    gap: 8,
  },
  locationLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#999',
    flex: 1,
  },
  servicesSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#F5F5F5',
  },
  sectionTitleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '23.5%',
    marginBottom: 12,
  },
  serviceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  serviceCardWithImage: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    aspectRatio: 1,
  },
  serviceImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  serviceImageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    padding: 8,
    justifyContent: 'flex-end',
  },
  serviceNameImage: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  serviceGradient: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    aspectRatio: 1,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
  },
  serviceDescription: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  promotionSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
  },
  promotionCard: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  promotionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 0,
    height: 160,
    justifyContent: 'space-between',
  },
  promotionContent: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 16,
  },
  promotionBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  promotionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    lineHeight: 36,
  },
  promotionSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 12,
    lineHeight: 15,
  },
  bookNowButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  bookNowText: {
    color: '#7CB342',
    fontSize: 12,
    fontWeight: '700',
  },
  promotionImageContainer: {
    width: 150,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  promotionImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 13,
    color: '#7CB342',
    fontWeight: '600',
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  petImageContainer: {
    marginRight: 12,
  },
  petImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  petImagePlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 12,
    color: '#999',
  },
  clinicCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  clinicImageContainer: {
    width: '100%',
    height: 120,
    overflow: 'hidden',
  },
  clinicImage: {
    width: '100%',
    height: '100%',
  },
  clinicImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicInfo: {
    padding: 12,
  },
  clinicName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  clinicType: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6,
  },
  clinicDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clinicDistanceText: {
    fontSize: 11,
    color: '#7CB342',
    fontWeight: '600',
  },
  clinicsListH: {
    paddingHorizontal: 16,
    paddingRight: 20,
  },
  clinicCardH: {
    width: width * 0.44,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  clinicImageContainerH: {
    width: 100,
    height: 100,
    overflow: 'hidden',
  },
  clinicImageH: {
    width: '100%',
    height: '100%',
  },
  clinicInfoH: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  clinicNameH: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  clinicTypeH: {
    fontSize: 10,
    color: '#999',
    marginBottom: 5,
  },
  clinicDistanceH: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  clinicDistanceTextH: {
    fontSize: 10,
    color: '#7CB342',
    fontWeight: '600',
  },
});