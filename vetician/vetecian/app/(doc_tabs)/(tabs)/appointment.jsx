// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   TouchableOpacity, 
//   ActivityIndicator,
//   RefreshControl,
//   Animated,
//   Modal
// } from 'react-native';
// import { 
//   Calendar, 
//   Clock, 
//   Video, 
//   MapPin, 
//   Phone, 
//   User, 
//   Stethoscope,
//   ChevronLeft,
//   X
// } from 'lucide-react-native';
// import { router } from 'expo-router';
// import api from '../../../services/api';

// const AppointmentCard = ({ appointment, onPress }) => {
//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', { 
//       weekday: 'short', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   const formatTime = (date) => {
//     return new Date(date).toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
//       confirmed: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
//       cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
//       completed: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' }
//     };
//     return colors[status] || { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
//   };

//   const statusColors = getStatusColor(appointment.status);

//   return (
//     <TouchableOpacity 
//       style={styles.appointmentCard}
//       onPress={onPress}
//       activeOpacity={0.7}
//     >
//       <View style={styles.cardHeader}>
//         <View style={styles.petInfo}>
//           <Text style={styles.petEmoji}>{appointment.petPic}</Text>
//           <View>
//             <Text style={styles.petName}>{appointment.petName}</Text>
//             <Text style={styles.petBreed}>{appointment.breed || appointment.petType}</Text>
//           </View>
//         </View>
//         <View style={[styles.statusBadge, { backgroundColor: statusColors.bg, borderColor: statusColors.border }]}>
//           <Text style={[styles.statusText, { color: statusColors.text }]}>
//             {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.cardDetails}>
//         <View style={styles.detailRow}>
//           <Calendar size={16} color="#9CA3AF" />
//           <Text style={styles.detailText}>
//             {formatDate(appointment.date)} at {formatTime(appointment.date)}
//           </Text>
//         </View>
        
//         <View style={styles.detailRow}>
//           <Stethoscope size={16} color="#9CA3AF" />
//           <Text style={styles.detailText}>{appointment.illness || 'General checkup'}</Text>
//         </View>

//         <View style={styles.detailRow}>
//           {appointment.bookingType === 'video' ? (
//             <>
//               <Video size={16} color="#3B82F6" />
//               <Text style={[styles.detailText, { color: '#3B82F6', fontWeight: '500' }]}>
//                 Video Consultation
//               </Text>
//             </>
//           ) : (
//             <>
//               <MapPin size={16} color="#10B981" />
//               <Text style={[styles.detailText, { color: '#10B981', fontWeight: '500' }]}>
//                 In-Clinic Visit
//               </Text>
//             </>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const AppointmentDetail = ({ appointment, visible, onClose }) => {
//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', { 
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   const formatTime = (date) => {
//     return new Date(date).toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
//       confirmed: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
//       cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
//       completed: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' }
//     };
//     return colors[status] || { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
//   };

//   const statusColors = getStatusColor(appointment.status);

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       presentationStyle="pageSheet"
//       onRequestClose={onClose}
//     >
//       <View style={styles.detailContainer}>
//         {/* Header */}
//         <View style={styles.detailHeader}>
//           <TouchableOpacity onPress={onClose} style={styles.backButton}>
//             <ChevronLeft size={24} color="#4B5563" />
//           </TouchableOpacity>
//           <Text style={styles.detailTitle}>Appointment Details</Text>
//         </View>

//         <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
//           {/* Pet Info Card */}
//           <View style={styles.detailCard}>
//             <View style={styles.petDetailHeader}>
//               <Text style={styles.petEmojiLarge}>{appointment.petPic}</Text>
//               <View style={styles.petDetailInfo}>
//                 <Text style={styles.petNameLarge}>{appointment.petName}</Text>
//                 <Text style={styles.petBreedLarge}>{appointment.breed || appointment.petType}</Text>
//               </View>
//               <View style={[styles.statusBadgeLarge, { backgroundColor: statusColors.bg, borderColor: statusColors.border }]}>
//                 <Text style={[styles.statusTextLarge, { color: statusColors.text }]}>
//                   {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Appointment Info */}
//           <View style={styles.detailCard}>
//             <Text style={styles.sectionTitle}>Appointment Information</Text>
            
//             <View style={styles.infoRow}>
//               <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
//                 <Calendar size={20} color="#2563EB" />
//               </View>
//               <View style={styles.infoContent}>
//                 <Text style={styles.infoLabel}>Date & Time</Text>
//                 <Text style={styles.infoValue}>{formatDate(appointment.date)}</Text>
//                 <Text style={styles.infoValue}>{formatTime(appointment.date)}</Text>
//               </View>
//             </View>

//             <View style={styles.infoRow}>
//               <View style={[styles.iconBox, { backgroundColor: '#E9D5FF' }]}>
//                 <Stethoscope size={20} color="#9333EA" />
//               </View>
//               <View style={styles.infoContent}>
//                 <Text style={styles.infoLabel}>Reason for Visit</Text>
//                 <Text style={styles.infoValue}>{appointment.illness || 'General checkup'}</Text>
//               </View>
//             </View>

//             <View style={styles.infoRow}>
//               <View style={[styles.iconBox, { backgroundColor: appointment.bookingType === 'video' ? '#DBEAFE' : '#D1FAE5' }]}>
//                 {appointment.bookingType === 'video' ? (
//                   <Video size={20} color="#2563EB" />
//                 ) : (
//                   <MapPin size={20} color="#059669" />
//                 )}
//               </View>
//               <View style={styles.infoContent}>
//                 <Text style={styles.infoLabel}>Appointment Type</Text>
//                 <Text style={styles.infoValue}>
//                   {appointment.bookingType === 'video' ? 'Video Consultation' : 'In-Clinic Visit'}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.infoRow}>
//               <View style={[styles.iconBox, { backgroundColor: '#FED7AA' }]}>
//                 <Phone size={20} color="#EA580C" />
//               </View>
//               <View style={styles.infoContent}>
//                 <Text style={styles.infoLabel}>Contact Information</Text>
//                 <Text style={styles.infoValue}>{appointment.contactInfo}</Text>
//               </View>
//             </View>
//           </View>

//           {/* Additional Details */}
//           <View style={styles.detailCard}>
//             <Text style={styles.sectionTitle}>Additional Details</Text>
            
//             {appointment.veterinarianId && (
//               <View style={styles.infoRow}>
//                 <View style={[styles.iconBox, { backgroundColor: '#CCFBF1' }]}>
//                   <User size={20} color="#0D9488" />
//                 </View>
//                 <View style={styles.infoContent}>
//                   <Text style={styles.infoLabel}>Veterinarian</Text>
//                   <Text style={styles.infoValue}>{appointment.veterinarianId.name}</Text>
//                 </View>
//               </View>
//             )}

//             {appointment.userId && (
//               <View style={styles.infoRow}>
//                 <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
//                   <User size={20} color="#4F46E5" />
//                 </View>
//                 <View style={styles.infoContent}>
//                   <Text style={styles.infoLabel}>Pet Owner</Text>
//                   <Text style={styles.infoValue}>{appointment.userId.name}</Text>
//                 </View>
//               </View>
//             )}

//             <View style={styles.infoRow}>
//               <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
//                 <Clock size={20} color="#6B7280" />
//               </View>
//               <View style={styles.infoContent}>
//                 <Text style={styles.infoLabel}>Appointment ID</Text>
//                 <Text style={[styles.infoValue, { fontFamily: 'monospace', fontSize: 14 }]}>
//                   #{appointment._id}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Action Buttons */}
//           <View style={styles.actionButtons}>
//             <TouchableOpacity style={styles.cancelButton}>
//               <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.rescheduleButton}>
//               <Text style={styles.rescheduleButtonText}>Reschedule</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </View>
//     </Modal>
//   );
// };

// export default function Appointment() {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
  
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [activeFilter, setActiveFilter] = useState('all');

//   const fetchAppointments = async () => {
//     try {
//       const response = await api.get('/appointments');
//       if (response.data.success) {
//         setAppointments(response.data.appointments || []);
//       }
//     } catch (error) {
//       console.error("Appointments Fetch Error:", error);
//       // Fallback to mock data
//       setAppointments([
//         {
//           _id: '1',
//           petName: 'Max',
//           petType: 'Dog',
//           breed: 'Golden Retriever',
//           illness: 'Routine checkup',
//           date: new Date('2026-01-28T10:00:00'),
//           bookingType: 'in-clinic',
//           contactInfo: '+91 98765 43210',
//           petPic: '🐕',
//           status: 'confirmed',
//           veterinarianId: { name: 'Dr. Sarah Johnson' },
//           userId: { name: 'John Doe' }
//         },
//         {
//           _id: '2',
//           petName: 'Luna',
//           petType: 'Cat',
//           breed: 'Persian',
//           illness: 'Skin irritation',
//           date: new Date('2026-01-28T14:30:00'),
//           bookingType: 'video',
//           contactInfo: '+91 98765 43211',
//           petPic: '🐱',
//           status: 'pending',
//           veterinarianId: { name: 'Dr. Michael Chen' },
//           userId: { name: 'Jane Smith' }
//         }
//       ]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
    
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 800,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchAppointments();
//   };

//   const filteredAppointments = appointments.filter(apt => {
//     if (activeFilter === 'all') return true;
//     return apt.status === activeFilter;
//   });

//   const appointmentCounts = {
//     all: appointments.length,
//     pending: appointments.filter(a => a.status === 'pending').length,
//     confirmed: appointments.filter(a => a.status === 'confirmed').length,
//     completed: appointments.filter(a => a.status === 'completed').length
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
//       {/* Header with Back Button */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => router.back()} 
//           style={styles.headerBackButton}
//         >
//           <ChevronLeft size={24} color="#111827" />
//         </TouchableOpacity>
//         <View style={styles.headerContent}>
//           <View style={styles.iconBox}>
//             <Calendar size={24} color="#F97316" />
//           </View>
//           <View>
//             <Text style={styles.headerTitle}>Appointments</Text>
//             <Text style={styles.headerSubtitle}>View and manage appointments</Text>
//           </View>
//         </View>
//       </View>

//       {/* Filter Tabs */}
//       <View style={styles.filterContainer}>
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filterScroll}
//         >
//           {[
//             { key: 'all', label: 'All' },
//             { key: 'pending', label: 'Pending' },
//             { key: 'confirmed', label: 'Confirmed' },
//             { key: 'completed', label: 'Completed' }
//           ].map(filter => (
//             <TouchableOpacity
//               key={filter.key}
//               onPress={() => setActiveFilter(filter.key)}
//               style={[
//                 styles.filterTab,
//                 activeFilter === filter.key && styles.filterTabActive
//               ]}
//             >
//               <Text style={[
//                 styles.filterTabText,
//                 activeFilter === filter.key && styles.filterTabTextActive
//               ]}>
//                 {filter.label} ({appointmentCounts[filter.key]})
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Appointments List */}
//       <ScrollView 
//         style={styles.appointmentsList}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {filteredAppointments.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Calendar size={48} color="#D1D5DB" />
//             <Text style={styles.emptyText}>No appointments found</Text>
//           </View>
//         ) : (
//           filteredAppointments.map(appointment => (
//             <AppointmentCard
//               key={appointment._id}
//               appointment={appointment}
//               onPress={() => setSelectedAppointment(appointment)}
//             />
//           ))
//         )}
//       </ScrollView>

//       {/* Appointment Detail Modal */}
//       {selectedAppointment && (
//         <AppointmentDetail
//           appointment={selectedAppointment}
//           visible={!!selectedAppointment}
//           onClose={() => setSelectedAppointment(null)}
//         />
//       )}
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB'
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff'
//   },
//   header: {
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     paddingTop: 60,
//     paddingBottom: 16,
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   headerBackButton: {
//     padding: 8,
//     marginLeft: 8,
//     marginRight: 4
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     gap: 12
//   },
//   iconBox: {
//     padding: 8,
//     backgroundColor: '#FED7AA',
//     borderRadius: 12
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#111827'
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 2
//   },
//   filterContainer: {
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     paddingVertical: 12
//   },
//   filterScroll: {
//     paddingHorizontal: 16,
//     gap: 8
//   },
//   filterTab: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     backgroundColor: '#F3F4F6',
//     marginRight: 8
//   },
//   filterTabActive: {
//     backgroundColor: '#2563EB'
//   },
//   filterTabText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#4B5563'
//   },
//   filterTabTextActive: {
//     color: '#fff'
//   },
//   appointmentsList: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 16
//   },
//   appointmentCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12
//   },
//   petInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     flex: 1
//   },
//   petEmoji: {
//     fontSize: 40
//   },
//   petName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827'
//   },
//   petBreed: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 2
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 999,
//     borderWidth: 1
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '500'
//   },
//   cardDetails: {
//     gap: 8
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8
//   },
//   detailText: {
//     fontSize: 14,
//     color: '#4B5563'
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginTop: 12
//   },
//   // Detail Modal Styles
//   detailContainer: {
//     flex: 1,
//     backgroundColor: '#F9FAFB'
//   },
//   detailHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     paddingTop: 60,
//     paddingBottom: 16,
//     paddingHorizontal: 16
//   },
//   backButton: {
//     padding: 8,
//     marginRight: 8
//   },
//   detailTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827'
//   },
//   detailScroll: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 16
//   },
//   detailCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#E5E7EB'
//   },
//   petDetailHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16
//   },
//   petEmojiLarge: {
//     fontSize: 60
//   },
//   petDetailInfo: {
//     flex: 1
//   },
//   petNameLarge: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#111827'
//   },
//   petBreedLarge: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginTop: 4
//   },
//   statusBadgeLarge: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 999,
//     borderWidth: 1
//   },
//   statusTextLarge: {
//     fontSize: 14,
//     fontWeight: '500'
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 16
//   },
//   infoRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16
//   },
//   infoContent: {
//     flex: 1
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 4
//   },
//   infoValue: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827'
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 8,
//     marginBottom: 24
//   },
//   cancelButton: {
//     flex: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#fff',
//     borderWidth: 2,
//     borderColor: '#EF4444',
//     borderRadius: 12,
//     alignItems: 'center'
//   },
//   cancelButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#DC2626'
//   },
//   rescheduleButton: {
//     flex: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#2563EB',
//     borderRadius: 12,
//     alignItems: 'center'
//   },
//   rescheduleButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff'
//   }
// });

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView, 
  TouchableOpacity, Image, Modal, SafeAreaView, Alert
} from 'react-native';
import { 
  Search, MapPin, ChevronDown, Star, 
  ShieldCheck, X, Calendar as CalendarIcon, Clock 
} from 'lucide-react-native';

const VET_DATA = [
  {
    id: '1',
    name: 'Happy Paws Clinic',
    specialty: 'Multi-speciality Clinic',
    location: 'Koramangala, Bangalore',
    fees: '₹400',
    rating: '97%',
    stories: '4200',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=200&h=150&auto=format&fit=crop',
    slots: { 'Today': ['10:00 AM', '11:30 AM', '04:00 PM'], 'Tomorrow': ['09:00 AM', '02:00 PM'] }
  },
  {
    id: '2',
    name: 'Dr. Shalini Rao',
    specialty: 'Veterinary Surgeon',
    location: 'Indiranagar, Bangalore',
    fees: '₹500',
    rating: '99%',
    stories: '1850',
    image: 'https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?q=80&w=200&h=200&auto=format&fit=crop',
    slots: { 'Today': ['05:00 PM', '06:00 PM'], 'Tomorrow': ['10:00 AM', '11:00 AM', '12:00 PM'] }
  }
];

export default function FullPetBookingApp() {
  const [selectedVet, setSelectedVet] = useState(null);
  const [bookingDate, setBookingDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleBookAppointment = () => {
    if (!selectedSlot) {
      Alert.alert("Error", "Please select a time slot");
      return;
    }
    Alert.alert(
      "Booking Confirmed!",
      `Appointment set with ${selectedVet.name} for ${bookingDate} at ${selectedSlot}.`,
      [{ text: "OK", onPress: () => setSelectedVet(null) }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header & Search (UI Only) */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.locationText}>Bangalore</Text>
          <View style={styles.divider} />
          <Search size={16} color="#6B7280" />
          <TextInput placeholder="Search Vets..." style={styles.searchInput} />
        </View>
      </View>

      {/* 2. Provider List */}
      <ScrollView>
        <View style={styles.resultHeader}>
          <Text style={styles.resultCountText}>Vets available in Bangalore</Text>
        </View>

        {VET_DATA.map((vet) => (
          <View key={vet.id} style={styles.card}>
            <View style={styles.cardMain}>
              <Image source={{ uri: vet.image }} style={styles.vetImage} />
              <View style={styles.infoContainer}>
                <Text style={styles.vetName}>{vet.name}</Text>
                <Text style={styles.specialtyText}>{vet.specialty}</Text>
                <Text style={styles.locationDetail}>{vet.location}</Text>
                <Text style={styles.feesText}>{vet.fees} Consultation Fee</Text>
                <View style={styles.ratingRow}>
                  <View style={styles.ratingBadge}>
                    <Star size={10} color="#fff" fill="#fff" />
                    <Text style={styles.ratingText}>{vet.rating}</Text>
                  </View>
                  <Text style={styles.storiesText}>{vet.stories} Patient Stories</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.bookButton} 
              onPress={() => {
                setSelectedVet(vet);
                setSelectedSlot(null);
              }}
            >
              <Text style={styles.bookButtonText}>Book Clinic Visit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* 3. SLOT PICKER MODAL (The Functionality) */}
      <Modal visible={!!selectedVet} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select a Time Slot</Text>
              <TouchableOpacity onPress={() => setSelectedVet(null)}>
                <X size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {selectedVet && (
              <View style={styles.sheetBody}>
                <Text style={styles.vetSubname}>Booking for {selectedVet.name}</Text>
                
                {/* Day Selection */}
                <View style={styles.dayRow}>
                  {['Today', 'Tomorrow'].map((day) => (
                    <TouchableOpacity 
                      key={day} 
                      style={[styles.dayTab, bookingDate === day && styles.activeDayTab]}
                      onPress={() => {setBookingDate(day); setSelectedSlot(null);}}
                    >
                      <Text style={[styles.dayTabText, bookingDate === day && styles.activeDayText]}>{day}</Text>
                      <Text style={styles.slotCountText}>{selectedVet.slots[day].length} slots</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Slots Grid */}
                <Text style={styles.sectionLabel}>Available Slots</Text>
                <View style={styles.slotsGrid}>
                  {selectedVet.slots[bookingDate].map((slot) => (
                    <TouchableOpacity 
                      key={slot} 
                      style={[styles.slotItem, selectedSlot === slot && styles.activeSlotItem]}
                      onPress={() => setSelectedSlot(slot)}
                    >
                      <Text style={[styles.slotText, selectedSlot === slot && styles.activeSlotText]}>{slot}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={handleBookAppointment}>
                  <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#2D3192', padding: 16, paddingTop: 20 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', paddingHorizontal: 12, height: 45 },
  locationText: { marginLeft: 5, fontSize: 14, color: '#111827', fontWeight: '600' },
  divider: { width: 1, height: '50%', backgroundColor: '#D1D5DB', marginHorizontal: 12 },
  searchInput: { flex: 1, fontSize: 14 },
  resultHeader: { padding: 16 },
  resultCountText: { fontSize: 16, fontWeight: '700', color: '#374151' },
  
  card: { backgroundColor: '#fff', marginBottom: 10, padding: 16 },
  cardMain: { flexDirection: 'row', marginBottom: 15 },
  vetImage: { width: 80, height: 80, borderRadius: 10 },
  infoContainer: { flex: 1, marginLeft: 15 },
  vetName: { fontSize: 18, fontWeight: 'bold', color: '#2563EB' },
  specialtyText: { fontSize: 14, color: '#4B5563', marginTop: 2 },
  locationDetail: { fontSize: 13, color: '#6B7280' },
  feesText: { fontSize: 14, fontWeight: '700', color: '#111827', marginTop: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  ratingBadge: { backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  ratingText: { color: '#fff', fontSize: 11, fontWeight: 'bold', marginLeft: 3 },
  storiesText: { fontSize: 12, color: '#2563EB', marginLeft: 8 },
  bookButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#24A1DE', padding: 12, borderRadius: 6, alignItems: 'center' },
  bookButtonText: { color: '#24A1DE', fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetContainer: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, minHeight: 400 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontWeight: 'bold' },
  vetSubname: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  dayRow: { flexDirection: 'row', marginBottom: 20 },
  dayTab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: '#E5E7EB' },
  activeDayTab: { borderBottomColor: '#2563EB' },
  dayTabText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  activeDayText: { color: '#2563EB' },
  slotCountText: { fontSize: 12, color: '#9CA3AF' },
  sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 12, color: '#374151' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotItem: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB' },
  activeSlotItem: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  slotText: { color: '#374151', fontWeight: '600' },
  activeSlotText: { color: '#fff' },
  confirmButton: { backgroundColor: '#24A1DE', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  confirmButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});