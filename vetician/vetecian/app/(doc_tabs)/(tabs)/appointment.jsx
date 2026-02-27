import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
  Image
} from 'react-native';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Phone, 
  User, 
  Stethoscope,
  ArrowLeft,
  X,
  Bell
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketService from '../../../services/socket';

const AppointmentCard = ({ appointment, onPress }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
      confirmed: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
      cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
      completed: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' }
    };
    return colors[status] || { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
  };

  const statusColors = getStatusColor(appointment.status);

  return (
    <TouchableOpacity 
      style={styles.appointmentCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.petInfo}>
          {appointment.petPic && appointment.petPic.startsWith('http') ? (
            <Image 
              source={{ uri: appointment.petPic }} 
              style={styles.petImage}
              defaultSource={require('../../../assets/images/icon.png')}
            />
          ) : (
            <Text style={styles.petEmoji}>{appointment.petPic || '🐾'}</Text>
          )}
          <View>
            <Text style={styles.petName}>{appointment.petName}</Text>
            <Text style={styles.petBreed}>{appointment.breed || appointment.petType}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg, borderColor: statusColors.border }]}>
          <Text style={[styles.statusText, { color: statusColors.text }]}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#9CA3AF" />
          <Text style={styles.detailText}>
            {formatDate(appointment.date)} at {formatTime(appointment.date)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Stethoscope size={16} color="#9CA3AF" />
          <Text style={styles.detailText}>{appointment.illness || 'General checkup'}</Text>
        </View>

        <View style={styles.detailRow}>
          {appointment.bookingType === 'video' ? (
            <>
              <Video size={16} color="#3B82F6" />
              <Text style={[styles.detailText, { color: '#3B82F6', fontWeight: '500' }]}>
                Video Consultation
              </Text>
            </>
          ) : (
            <>
              <MapPin size={16} color="#10B981" />
              <Text style={[styles.detailText, { color: '#10B981', fontWeight: '500' }]}>
                In-Clinic Visit
              </Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AppointmentDetail = ({ appointment, visible, onClose, onStatusUpdate }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
      confirmed: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
      cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
      completed: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' }
    };
    return colors[status] || { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
  };

  const statusColors = getStatusColor(appointment.status);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <X size={24} color="#4B5563" />
          </TouchableOpacity>
          <Text style={styles.detailTitle}>Appointment Details</Text>
        </View>

        <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.detailCard}>
            <View style={styles.petDetailHeader}>
              {appointment.petPic && appointment.petPic.startsWith('http') ? (
                <Image 
                  source={{ uri: appointment.petPic }} 
                  style={styles.petImageLarge}
                  defaultSource={require('../../../assets/images/icon.png')}
                />
              ) : (
                <Text style={styles.petEmojiLarge}>{appointment.petPic || '🐾'}</Text>
              )}
              <View style={styles.petDetailInfo}>
                <Text style={styles.petNameLarge}>{appointment.petName}</Text>
                <Text style={styles.petBreedLarge}>{appointment.breed || appointment.petType}</Text>
              </View>
              <View style={[styles.statusBadgeLarge, { backgroundColor: statusColors.bg, borderColor: statusColors.border }]}>
                <Text style={[styles.statusTextLarge, { color: statusColors.text }]}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.sectionTitle}>Appointment Information</Text>
            
            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                <Calendar size={20} color="#2563EB" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>{formatDate(appointment.date)}</Text>
                <Text style={styles.infoValue}>{formatTime(appointment.date)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: '#E9D5FF' }]}>
                <Stethoscope size={20} color="#9333EA" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Reason for Visit</Text>
                <Text style={styles.infoValue}>{appointment.illness || 'General checkup'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: appointment.bookingType === 'video' ? '#DBEAFE' : '#D1FAE5' }]}>
                {appointment.bookingType === 'video' ? (
                  <Video size={20} color="#2563EB" />
                ) : (
                  <MapPin size={20} color="#059669" />
                )}
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Appointment Type</Text>
                <Text style={styles.infoValue}>
                  {appointment.bookingType === 'video' ? 'Video Consultation' : 'In-Clinic Visit'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: '#FED7AA' }]}>
                <Phone size={20} color="#EA580C" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Contact Information</Text>
                <Text style={styles.infoValue}>{appointment.contactInfo}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            {appointment.status === 'pending' && (
              <>
                <TouchableOpacity 
                  style={styles.rejectButton}
                  onPress={() => {
                    console.log('Reject button pressed', appointment._id);
                    onStatusUpdate(appointment._id, 'cancelled');
                  }}
                >
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={() => {
                    console.log('Confirm button pressed', appointment._id);
                    onStatusUpdate(appointment._id, 'confirmed');
                  }}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </>
            )}
            {appointment.status === 'confirmed' && (
              <TouchableOpacity 
                style={styles.completeButton}
                onPress={() => onStatusUpdate(appointment._id, 'completed')}
              >
                <Text style={styles.completeButtonText}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default function Appointment() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api'}/auth/veterinarian/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    
    const initSocket = async () => {
      const token = await AsyncStorage.getItem('token');
      
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api'}/auth/veterinarian/appointments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.appointments && data.appointments.length > 0) {
          const veterinarianId = data.appointments[0].veterinarianId;
          console.log('👨⚕️ Connecting socket for veterinarian:', veterinarianId);
          socketService.connect(veterinarianId, 'veterinarian');
          
          socketService.onNewAppointment((data) => {
            console.log('🔔 Received new appointment notification:', data);
            Alert.alert(
              'New Appointment! 🔔',
              `${data.message}`,
              [{ text: 'View', onPress: () => fetchAppointments() }]
            );
            fetchAppointments();
          });
        }
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };
    
    initSocket();
    
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    const statusText = newStatus === 'confirmed' ? 'confirm' : newStatus === 'cancelled' ? 'reject' : 'complete';
    
    try {
      console.log('Starting status update:', appointmentId, newStatus);
      const token = await AsyncStorage.getItem('token');
      console.log('Token retrieved:', !!token);
      
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api'}/auth/appointment/${appointmentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      const result = await response.json();
      console.log('Status update response:', result);

      if (response.ok) {
        Alert.alert('Success', `Appointment ${statusText}ed successfully`);
        setSelectedAppointment(null);
        fetchAppointments();
      } else {
        console.error('Status update error:', result);
        Alert.alert('Error', result.message || `Failed to ${statusText} appointment`);
      }
    } catch (error) {
      console.error('Status update error:', error);
      Alert.alert('Error', `Failed to ${statusText} appointment`);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const filteredAppointments = appointments.filter(apt => {
    if (activeFilter === 'all') return true;
    return apt.status === activeFilter;
  });

  const appointmentCounts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/(doc_tabs)/(tabs)')} style={styles.iconButton}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Appointments</Text>
        <View style={styles.notificationBadge}>
          <Bell size={20} color="#4B5563" />
          {appointmentCounts.pending > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{appointmentCounts.pending}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'completed', label: 'Completed' }
          ].map(filter => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={[
                styles.filterTab,
                activeFilter === filter.key && styles.filterTabActive
              ]}
            >
              <Text style={[
                styles.filterTabText,
                activeFilter === filter.key && styles.filterTabTextActive
              ]}>
                {filter.label} ({appointmentCounts[filter.key]})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.appointmentsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No appointments found</Text>
          </View>
        ) : (
          filteredAppointments.map(appointment => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onPress={() => setSelectedAppointment(appointment)}
            />
          ))
        )}
      </ScrollView>

      {selectedAppointment && (
        <AppointmentDetail
          appointment={selectedAppointment}
          visible={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  iconButton: {
    padding: 8,
  },
  notificationBadge: {
    position: 'relative',
    padding: 8
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 8
  },
  filterTabActive: {
    backgroundColor: '#2563EB'
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563'
  },
  filterTabTextActive: {
    color: '#fff'
  },
  appointmentsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  petEmoji: {
    fontSize: 40
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6'
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827'
  },
  petBreed: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500'
  },
  cardDetails: {
    gap: 8
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563'
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16
  },
  backButton: {
    padding: 8,
    marginRight: 8
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827'
  },
  detailScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  petDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  petEmojiLarge: {
    fontSize: 60
  },
  petImageLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6'
  },
  petDetailInfo: {
    flex: 1
  },
  petNameLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827'
  },
  petBreedLarge: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4
  },
  statusBadgeLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1
  },
  statusTextLarge: {
    fontSize: 14,
    fontWeight: '500'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  iconBox: {
    padding: 8,
    borderRadius: 12
  },
  infoContent: {
    flex: 1
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827'
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 12,
    alignItems: 'center'
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626'
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 12,
    alignItems: 'center'
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626'
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#10B981',
    borderRadius: 12,
    alignItems: 'center'
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  completeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center'
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
});
