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
// import { DrawerActions, useNavigation } from '@react-navigation/native';
// import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ApiService from '../../../services/api';
// import PetDetailModal from '../../../components/petparent/home/PetDetailModal';

// const { width } = Dimensions.get('window');

// export default function Home() {
//   const user = useSelector((state) => state.auth.user);
//   const navigation = useNavigation();

//   const [parentData, setParentData] = useState(null);
//   const [dashboard, setDashboard] = useState(null);
//   const [pets, setPets] = useState([]);
//   const [clinics, setClinics] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedPet, setSelectedPet] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   // Fetch Parent Data
//   const fetchParentData = async () => {
//     try {
//       const data = await ApiService.get('/parents/profile');
//       setParentData(data);
//     } catch (err) {
//       console.error('❌ Parent data fetch failed:', err.message);
//     }
//   };

//   // Fetch Dashboard Stats
//   const fetchDashboard = async () => {
//     try {
//       const data = await ApiService.get('/users/dashboard-stats');
//       setDashboard(data);
//     } catch (err) {
//       console.error('❌ Dashboard fetch failed:', err.message);
//     }
//   };

//   // Fetch Pets
//   const fetchPets = async () => {
//     try {
//       const userId = await AsyncStorage.getItem('userId');
//       if (userId) {
//         const data = await ApiService.getPetsByUserId(userId);
//         setPets(data?.pets || []);
//       }
//     } catch (err) {
//       console.error('❌ Pets fetch failed:', err.message);
//     }
//   };

//   // Fetch Nearby Clinics
//   const fetchClinics = async () => {
//     try {
//       const data = await ApiService.get('/clinics');
//       setClinics(data?.clinics || []);
//     } catch (err) {
//       console.error('❌ Clinics fetch failed:', err.message);
//     }
//   };

//   // Fetch Upcoming Appointments
//   const fetchAppointments = async () => {
//     try {
//       const data = await ApiService.get('/appointments/upcoming');
//       setAppointments(data?.appointments || []);
//     } catch (err) {
//       console.error('❌ Appointments fetch failed:', err.message);
//     }
//   };

//   const loadData = async () => {
//     await Promise.all([
//       fetchParentData(),
//       fetchDashboard(),
//       fetchPets(),
//       fetchClinics(),
//       fetchAppointments(),
//     ]);
//   };

//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       await loadData();
//       setLoading(false);
//     };
//     init();
//   }, []);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadData();
//     setRefreshing(false);
//   };

//   const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

//   const navigateTo = (screen) => navigation.navigate(screen);

//   const handlePetPress = (pet) => {
//     setSelectedPet(pet);
//     setModalVisible(true);
//   };

//   const handleClinicPress = (clinic) => {
//     navigation.navigate('ClinicDetailScreen', { clinic });
//   };

//   const handleAppointmentPress = (appointment) => {
//     navigation.navigate('AppointmentDetail', { appointment });
//   };

//   // Render Pet Card
//   const renderPetCard = ({ item }) => (
//     <TouchableOpacity
//       style={styles.petCard}
//       onPress={() => handlePetPress(item)}
//       activeOpacity={0.7}
//     >
//       <View style={styles.petImageContainer}>
//         {item.petPhoto ? (
//           <Image source={{ uri: item.petPhoto }} style={styles.petImage} />
//         ) : (
//           <LinearGradient
//             colors={['#4E8D7C', '#6BA896']}
//             style={styles.petImagePlaceholder}
//           >
//             <FontAwesome5 name="paw" size={28} color="#fff" />
//           </LinearGradient>
//         )}
//       </View>
//       <View style={styles.petInfo}>
//         <Text style={styles.petName} numberOfLines={1}>
//           {item.name}
//         </Text>
//         <Text style={styles.petBreed} numberOfLines={1}>
//           {item.breed || item.species}
//         </Text>
//         <View style={styles.petMetaRow}>
//           <View style={styles.petMeta}>
//             <Ionicons name="calendar-outline" size={12} color="#666" />
//             <Text style={styles.petMetaText}>{item.age || 'N/A'}</Text>
//           </View>
//           <View style={styles.petMeta}>
//             <Ionicons
//               name={item.gender === 'male' ? 'male' : 'female'}
//               size={12}
//               color="#666"
//             />
//             <Text style={styles.petMetaText}>
//               {item.gender?.charAt(0).toUpperCase()}
//             </Text>
//           </View>
//         </View>
//       </View>
//       <ChevronRight size={20} color="#999" />
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
//         <MapPin size={12} color="#4E8D7C" />
//         <Text style={styles.clinicDistanceText}>
//           {item.distance || '2.5'} km away
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
//         <Icon size={24} color="#fff" />
//       </LinearGradient>
//       <Text style={styles.quickActionLabel}>{label}</Text>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4E8D7C" />
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

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
//             <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
//               <Menu size={24} color="#fff" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => navigateTo('Notifications')} style={styles.notificationButton}>
//               <Bell size={24} color="#fff" />
//               <View style={styles.notificationBadge}>
//                 <Text style={styles.notificationBadgeText}>3</Text>
//               </View>
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
//           <QuickActionButton
//             icon={Plus}
//             label="Add Pet"
//             onPress={() => navigateTo('pages/PetDetail')}
//             gradient={['#FF6B6B', '#FF8E8E']}
//           />
//           <QuickActionButton
//             icon={Calendar}
//             label="Book"
//             onPress={() => navigateTo('pages/BookScreen')}
//             gradient={['#4E8D7C', '#6BA896']}
//           />
//           <QuickActionButton
//             icon={MapPin}
//             label="Clinics"
//             onPress={() => navigateTo('pages/ClinicListScreen')}
//             gradient={['#5C6BC0', '#7986CB']}
//           />
//           <QuickActionButton
//             icon={Activity}
//             label="Records"
//             onPress={() => navigateTo('MedicalRecords')}
//             gradient={['#FFA726', '#FFB74D']}
//           />
//         </View>

//         {/* Dashboard Stats */}
//         {dashboard && (
//           <View style={styles.statsContainer}>
//             <View style={styles.statCard}>
//               <View style={styles.statIconContainer}>
//                 <Heart size={24} color="#FF6B6B" />
//               </View>
//               <Text style={styles.statValue}>{dashboard?.stats?.pets || pets.length}</Text>
//               <TouchableOpacity onPress={() => navigateTo('pages/PetList')}>
//               <Text style={styles.seeAll}>My Pets</Text>
//             </TouchableOpacity>
//             </View>
//             {/* <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>My Pets</Text>
//             <TouchableOpacity onPress={() => navigateTo('pages/PetList')}>
//               <Text style={styles.seeAll}>See All</Text>
//             </TouchableOpacity>
//           </View> */}
            
//             <View style={styles.statCard}>
//               <View style={styles.statIconContainer}>
//                 <Calendar size={24} color="#4E8D7C" />
//               </View>
//               <Text style={styles.statValue}>{dashboard?.stats?.appointments || 0}</Text>
//               {/* <Text style={styles.statLabel}>Appointments</Text> */}
//               <TouchableOpacity onPress={() => navigateTo('pages/Appointments')}>
//               <Text style={styles.seeAll}>Appointments</Text>
//             </TouchableOpacity>
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
//               keyExtractor={(item) => item._id}
//               scrollEnabled={false}
//             />
//           </View>
//         )}

//         {/* My Pets */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>My Pets</Text>
//             <TouchableOpacity onPress={() => navigateTo('pages/PetList')}>
//               <Text style={styles.seeAll}>See All</Text>
//             </TouchableOpacity>
//           </View>
//           {pets.length > 0 ? (
//             <FlatList
//               data={pets}
//               renderItem={renderPetCard}
//               keyExtractor={(item) => item._id}
//               scrollEnabled={false}
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
//               <Text style={styles.seeAll}>See All</Text>
//             </TouchableOpacity>
//           </View>
//           {clinics.length > 0 ? (
//             <FlatList
//               horizontal
//               data={clinics}
//               renderItem={renderClinicCard}
//               keyExtractor={(item) => item._id}
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.clinicsList}
//             />
//           ) : (
//             <View style={styles.emptyState}>
//               <MaterialIcons name="location-off" size={48} color="#ccc" />
//               <Text style={styles.emptyStateText}>No clinics found nearby</Text>
//             </View>
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
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingHorizontal: 20,
//     marginTop: -25,
//     marginBottom: 20,
//   },
//   quickAction: {
//     alignItems: 'center',
//   },
//   quickActionGradient: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   quickActionLabel: {
//     marginTop: 8,
//     fontSize: 12,
//     color: '#333',
//     fontWeight: '600',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     marginBottom: 20,
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   statIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#F5F7FA',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
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
//     paddingHorizontal: 20,
//     marginBottom: 24,
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
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
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
//     borderRadius: 16,
//     padding: 12,
//     marginRight: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
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
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
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
//     borderRadius: 16,
//     padding: 40,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: '#999',
//     marginTop: 16,
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
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
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
// });

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Menu,
  Heart,
  MapPin,
  Calendar,
  Bell,
  Plus,
  ChevronRight,
  Activity,
  Clock,
  Stethoscope,
  Users,
} from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import ApiService from '../../../services/api';
import PetDetailModal from '../../../components/petparent/home/PetDetailModal';
import Sidebar from '../../../components/Sidebar';

const { width } = Dimensions.get('window');

export default function Home() {
  const user = useSelector((state) => state.auth.user);
  const pets = useSelector((state) => state.auth?.userPets?.data || []);
  const router = useRouter();

  const [parentData, setParentData] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [userLocation, setUserLocation] = useState(null);

  // Get user location
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('⚠️ Location permission denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log('📍 User Location:', location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('❌ Error getting location:', error);
    }
  };

  // Calculate distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  // Fetch Parent Data
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
      console.error('❌ Parent data fetch failed:', err.message);
    }
  };

  // Fetch Dashboard Stats - Skip for non-veterinarians
  const fetchDashboard = async () => {
    try {
      if (user?.role === 'veterinarian') {
        const data = await ApiService.get('/users/dashboard-stats');
        setDashboard(data);
      }
    } catch (err) {
      console.error('❌ Dashboard fetch failed:', err.message);
    }
  };



  // Fetch Nearby Clinics
  const fetchClinics = async () => {
    try {
      console.log('🔍 Dashboard: Fetching clinics with location:', userLocation);
      
      // Pass location parameters to API call
      const locationParams = userLocation ? {
        userLat: userLocation.latitude,
        userLon: userLocation.longitude
      } : {};
      
      const data = await ApiService.getAllVerifiedClinics(locationParams);
      const clinicsList = Array.isArray(data) ? data : (data?.data || []);
      
      const clinicsWithDistance = clinicsList.map(clinic => {
        const distance = clinic.clinicDetails?.distance || 'N/A';
        
        console.log(`🏥 Dashboard Clinic: ${clinic.clinicDetails?.clinicName}`);
        console.log(`   Distance from API: ${distance}`);
        
        return { 
          ...clinic, 
          distance, 
          clinicName: clinic.clinicDetails?.clinicName, 
          establishmentType: clinic.clinicDetails?.establishmentType, 
          city: clinic.clinicDetails?.city, 
          profilePhotoUrl: clinic.veterinarianDetails?.profilePhotoUrl, 
          _id: clinic.clinicDetails?.clinicId || clinic.clinicDetails?._id 
        };
      });

      clinicsWithDistance.sort((a, b) => {
        const distA = a.distance === 'N/A' ? Infinity : parseFloat(a.distance);
        const distB = b.distance === 'N/A' ? Infinity : parseFloat(b.distance);
        return distA - distB;
      });
      setClinics(clinicsWithDistance);
      console.log(`📊 Dashboard: Total clinics loaded: ${clinicsWithDistance.length}`);
    } catch (err) {
      console.error('❌ Dashboard clinics fetch failed:', err.message);
      setClinics([]);
    }
  };

  // Fetch Upcoming Appointments - Skip for now
  const fetchAppointments = async () => {
    try {
      setAppointments([]);
    } catch (err) {
      console.error('❌ Appointments fetch failed:', err.message);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      setNotificationCount(0);
    } catch (err) {
      setNotificationCount(0);
    }
  };

  const loadData = async () => {
    await Promise.all([
      fetchDashboard(),
      fetchClinics(), // This will now use parentData
      fetchAppointments(),
      fetchNotificationCount(),
    ]);
  };

  useEffect(() => {
    const init = async () => {
      await getUserLocation();
      await fetchParentData();
      await loadData();
    };
    init();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Pets Redux se automatically update ho jayenge
      console.log('🔄 Dashboard focused - pets:', pets.length);
    }, [pets])
  );

  useEffect(() => {
    if (userLocation) {
      fetchClinics();
    }
  }, [userLocation]);



  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const navigateTo = (screen) => router.push(screen);

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
        city: clinic.clinicDetails?.city || clinic.city,
        locality: clinic.clinicDetails?.locality,
        streetAddress: clinic.clinicDetails?.streetAddress,
        distance: clinic.distance,
        profilePhotoUrl: clinic.profilePhotoUrl
      }
    });
  };

  const handleAppointmentPress = (appointment) => {
    router.push({ pathname: 'AppointmentDetail', params: { appointment } });
  };

  // Render Pet Card - IMPROVED VERSION
  const renderPetCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.petCard}
        onPress={() => handlePetPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.petImageContainer}>
          {item.petPhoto || item.image || item.photoUrl ? (
            <Image 
              source={{ uri: item.petPhoto || item.image || item.photoUrl }} 
              style={styles.petImage} 
            />
          ) : (
            <LinearGradient
              colors={['#4E8D7C', '#6BA896']}
              style={styles.petImagePlaceholder}
            >
              <FontAwesome5 name="paw" size={28} color="#fff" />
            </LinearGradient>
          )}
        </View>
        <View style={styles.petInfo}>
          <Text style={styles.petName} numberOfLines={1}>
            {item.name || 'Unnamed Pet'}
          </Text>
          <Text style={styles.petBreed} numberOfLines={1}>
            {item.breed || item.species || 'Unknown'}
          </Text>
          <View style={styles.petMetaRow}>
            <View style={styles.petMeta}>
              <Ionicons name="calendar-outline" size={12} color="#666" />
              <Text style={styles.petMetaText}>
                {item.age || item.ageYears ? `${item.age || item.ageYears} yrs` : 'N/A'}
              </Text>
            </View>
            <View style={styles.petMeta}>
              <Ionicons
                name={item.gender?.toLowerCase() === 'male' ? 'male' : 'female'}
                size={12}
                color="#666"
              />
              <Text style={styles.petMetaText}>
                {item.gender ? item.gender.charAt(0).toUpperCase() : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
        <ChevronRight size={20} color="#999" />
      </TouchableOpacity>
    );
  };

  // Render Clinic Card
  const renderClinicCard = ({ item }) => (
    <TouchableOpacity
      style={styles.clinicCard}
      onPress={() => handleClinicPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.clinicImageContainer}>
        {item.profilePhotoUrl ? (
          <Image source={{ uri: item.profilePhotoUrl }} style={styles.clinicImage} />
        ) : (
          <LinearGradient
            colors={['#E8F5E9', '#C8E6C9']}
            style={styles.clinicImagePlaceholder}
          >
            <MaterialIcons name="local-hospital" size={40} color="#4E8D7C" />
          </LinearGradient>
        )}
      </View>
      <Text style={styles.clinicName} numberOfLines={2}>
        {item.clinicName}
      </Text>
      <Text style={styles.clinicType} numberOfLines={1}>
        {item.establishmentType}
      </Text>
      <View style={styles.clinicDistance}>
        <MapPin size={12} color={item.distance !== 'N/A' ? "#4E8D7C" : "#FF6B6B"} />
        <Text style={[styles.clinicDistanceText, { 
          color: item.distance !== 'N/A' ? "#4E8D7C" : "#FF6B6B" 
        }]}>
          {item.distance !== 'N/A' ? `${item.distance} km away` : 'Distance unavailable'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render Appointment Card
  const renderAppointmentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={() => handleAppointmentPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.appointmentLeft}>
        <View style={styles.appointmentDateBox}>
          <Text style={styles.appointmentDay}>
            {new Date(item.date).getDate()}
          </Text>
          <Text style={styles.appointmentMonth}>
            {new Date(item.date).toLocaleString('default', { month: 'short' })}
          </Text>
        </View>
      </View>
      <View style={styles.appointmentMiddle}>
        <Text style={styles.appointmentPet} numberOfLines={1}>
          {item.petName || 'Pet'}
        </Text>
        <Text style={styles.appointmentClinic} numberOfLines={1}>
          {item.clinicName}
        </Text>
        <View style={styles.appointmentTimeRow}>
          <Clock size={12} color="#666" />
          <Text style={styles.appointmentTime}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.appointmentRight}>
        <View
          style={[
            styles.appointmentStatus,
            { backgroundColor: item.status === 'confirmed' ? '#E8F5E9' : '#FFF3E0' },
          ]}
        >
          <Text
            style={[
              styles.appointmentStatusText,
              { color: item.status === 'confirmed' ? '#2E7D32' : '#F57C00' },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render Quick Action Button
  const QuickActionButton = ({ icon: Icon, label, onPress, gradient }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
      <LinearGradient colors={gradient} style={styles.quickActionGradient}>
        <Icon size={32} color="#fff" />
        <Text style={styles.quickActionLabel}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4E8D7C']} />
        }
      >
        {/* Header with Gradient */}
        <LinearGradient colors={['#4E8D7C', '#6BA896']} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuButton}>
              <Menu size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('pages/Notifications')} style={styles.notificationButton}>
              <Bell size={24} color="#fff" />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName}>{parentData?.name || user?.name || 'Pet Parent'}!</Text>
              <Text style={styles.subGreeting}>
                {pets.length > 0
                  ? `You have ${pets.length} ${pets.length === 1 ? 'pet' : 'pets'}`
                  : 'Add your first pet'}
              </Text>
            </View>
            {parentData?.image && (
              <Image source={{ uri: parentData.image }} style={styles.profileImage} />
            )}
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <View style={styles.quickActionRow}>
            <QuickActionButton
              icon={Plus}
              label="Add Pet"
              onPress={() => navigateTo('pages/PetDetail')}
              gradient={['#FF6B6B', '#FF8E8E']}
            />
            <QuickActionButton
              icon={Calendar}
              label="Book"
              onPress={() => navigateTo('pages/BookScreen')}
              gradient={['#4E8D7C', '#6BA896']}
            />
          </View>
          <View style={styles.quickActionRow}>
            <QuickActionButton
              icon={MapPin}
              label="Clinics"
              onPress={() => navigateTo('pages/ClinicListScreen')}
              gradient={['#5C6BC0', '#7986CB']}
            />
            <QuickActionButton
              icon={Activity}
              label="Records"
              onPress={() => navigateTo('pages/MedicalRecords')}
              gradient={['#FFA726', '#FFB74D']}
            />
          </View>
        </View>

        {/* Dashboard Stats */}
        {dashboard && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Heart size={24} color="#FF6B6B" />
              </View>
              <Text style={styles.statValue}>{pets.length}</Text>
              <TouchableOpacity onPress={() => navigateTo('pages/PetList')}>
                <Text style={styles.seeAll}>My Pets</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Calendar size={24} color="#4E8D7C" />
              </View>
              <Text style={styles.statValue}>{dashboard?.stats?.appointments || 0}</Text>
              <TouchableOpacity onPress={() => navigateTo('pages/Appointments')}>
                <Text style={styles.seeAll}>Appointments</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Stethoscope size={24} color="#5C6BC0" />
              </View>
              <Text style={styles.statValue}>{dashboard?.stats?.visits || 0}</Text>
              <Text style={styles.statLabel}>Visits</Text>
            </View>
          </View>
        )}

        {/* Upcoming Appointments */}
        {appointments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
              <TouchableOpacity onPress={() => navigateTo('pages/Appointments')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={appointments.slice(0, 3)}
              renderItem={renderAppointmentCard}
              keyExtractor={(item, index) => item._id || index.toString()}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* My Pets - IMPROVED VERSION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={() => navigateTo('pages/MyBookings')}>
                <Text style={styles.seeAll}>My Bookings</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigateTo('pages/PetList')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          
          {pets.length > 0 ? (
            <FlatList
              data={pets}
              renderItem={renderPetCard}
              keyExtractor={(item, index) => item._id || item.id || index.toString()}
              scrollEnabled={false}
              extraData={pets} // Force re-render when pets change
            />
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome5 name="paw" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No pets added yet</Text>
              <TouchableOpacity
                style={styles.addPetButton}
                onPress={() => navigateTo('pages/PetDetail')}
              >
                <Text style={styles.addPetButtonText}>Add Your First Pet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Nearby Clinics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Clinics</Text>
            <TouchableOpacity onPress={() => navigateTo('pages/ClinicListScreen')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {clinics.length > 0 ? (
            <FlatList
              horizontal
              data={clinics.slice(0, 4)}
              renderItem={renderClinicCard}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.clinicsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="local-hospital" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No verified clinics available yet</Text>
              <Text style={styles.emptyStateSubText}>Clinics will appear here once verified by admin</Text>
            </View>
          )}
        </View>

        {/* Parent Info Card (Optional) */}
        {parentData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Profile</Text>
            <TouchableOpacity
              style={styles.profileCard}
              onPress={() => navigateTo('Profile')}
            >
              <View style={styles.profileCardLeft}>
                <Ionicons name="person-circle-outline" size={24} color="#4E8D7C" />
                <View style={styles.profileCardInfo}>
                  <Text style={styles.profileCardName}>{parentData.name}</Text>
                  <Text style={styles.profileCardEmail}>{parentData.email}</Text>
                  <Text style={styles.profileCardPhone}>{parentData.phone}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#999" />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      <PetDetailModal
        pet={selectedPet}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginTop: -25,
    marginBottom: 28,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  quickAction: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  quickActionLabel: {
    marginTop: 12,
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seeAll: {
    fontSize: 14,
    color: '#4E8D7C',
    fontWeight: '600',
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  petImageContainer: {
    marginRight: 16,
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  petImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  petMetaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  petMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  petMetaText: {
    fontSize: 12,
    color: '#666',
  },
  clinicsList: {
    paddingRight: 20,
  },
  clinicCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  clinicImageContainer: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
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
  clinicName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
    minHeight: 36,
  },
  clinicType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  clinicDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clinicDistanceText: {
    fontSize: 12,
    color: '#4E8D7C',
    fontWeight: '600',
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  appointmentLeft: {
    marginRight: 16,
  },
  appointmentDateBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#4E8D7C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  appointmentMonth: {
    fontSize: 12,
    color: '#fff',
    textTransform: 'uppercase',
  },
  appointmentMiddle: {
    flex: 1,
    justifyContent: 'center',
  },
  appointmentPet: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  appointmentClinic: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  appointmentTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  appointmentTime: {
    fontSize: 12,
    color: '#666',
  },
  appointmentRight: {
    justifyContent: 'center',
  },
  appointmentStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  appointmentStatusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
  addPetButton: {
    marginTop: 16,
    backgroundColor: '#4E8D7C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addPetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  profileCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileCardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileCardEmail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  profileCardPhone: {
    fontSize: 13,
    color: '#666',
  },
});
