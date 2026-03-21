import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Video, Phone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../../../services/api';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constant/theme';

import socketService from '../../../services/socket';

export default function VideoConsultation() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineDoctors, setOnlineDoctors] = useState(new Set());

  useEffect(() => {
    fetchDoctors();

    socketService.emit('get-online-doctors');
    socketService.on('online-doctors', (ids) => {
      setOnlineDoctors(new Set(ids));
    });
    socketService.on('doctor-status', ({ vetId, online }) => {
      setOnlineDoctors(prev => {
        const next = new Set(prev);
        online ? next.add(vetId) : next.delete(vetId);
        return next;
      });
    });

    return () => {
      socketService.off('online-doctors');
      socketService.off('doctor-status');
    };
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await ApiService.getAllVerifiedClinics();
      const clinicsList = Array.isArray(data) ? data : (data?.data || []);
      
      // Hardcoded mapping for clinic to vet ID
      const clinicToVetMap = {
        '699c3adfa1d9bd9c5e8f7316': '699bdb473b40fb36af74467e',
        '699748685c663a0a76a231cb': '699bdb473b40fb36af74467e'
      };
      
      const doctorsList = clinicsList.map(clinic => {
        const clinicId = clinic.clinicDetails?.clinicId || clinic.clinicDetails?._id || clinic._id;
        const vetId = clinic.veterinarianDetails?.vetId || clinicToVetMap[clinicId] || clinicId;
        
        return {
          id: clinicId,
          vetId: vetId,
          name: clinic.veterinarianDetails?.name || 'Dr. Veterinarian',
          clinicName: clinic.clinicDetails?.clinicName || 'Clinic',
          specialization: clinic.veterinarianDetails?.specialization || 'Veterinarian',
          img: clinic.veterinarian?.profilePhotoUrl || clinic.veterinarianDetails?.profilePhotoUrl || 'https://ui-avatars.com/api/?name=Doctor&size=150',
        };
      });
      
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoCall = async (doctor) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName') || 'Pet Parent';
      
      if (!doctor.vetId || doctor.vetId === 'undefined') return;
      
      const callId = `call-${Date.now()}`;
      const roomName = `room-${userId}-${doctor.vetId}-${Date.now()}`;
      
      await ApiService.post('/call/initiate', {
        callerId: userId,
        receiverId: doctor.vetId,
        callId,
        roomName,
        token: 'mock-token',
        callerData: {
          name: userName,
          img: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=150&background=4E8D7C&color=fff`,
          role: 'Pet Parent'
        }
      });

      router.push({
        pathname: 'pages/VideoCallScreen',
        params: {
          callId,
          roomName,
          token: 'mock-token',
          receiverId: doctor.vetId,
          receiverName: doctor.name,
          receiverImg: doctor.img,
          isInitiator: 'true'
        }
      });
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  };

  const renderDoctor = ({ item }) => {
    const isOnline = onlineDoctors.has(item.vetId);
    return (
    <View style={styles.doctorCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.img }} style={styles.doctorImage} />
        <View style={[styles.onlineBadge, { backgroundColor: isOnline ? '#4CAF50' : '#9E9E9E' }]} />
      </View>
      <Text style={styles.doctorName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.clinicName} numberOfLines={1}>{item.clinicName}</Text>
      <Text style={styles.specialization} numberOfLines={1}>{item.specialization}</Text>
      <View style={[styles.statusBadge, { backgroundColor: isOnline ? '#E8F5E9' : '#F5F5F5' }]}>
        <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4CAF50' : '#9E9E9E' }]} />
        <Text style={[styles.statusText, { color: isOnline ? '#4CAF50' : '#9E9E9E' }]}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.callButton, !isOnline && { opacity: 0.5 }]}
        onPress={() => isOnline && handleVideoCall(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isOnline ? ['#7CB342', '#558B2F'] : ['#9E9E9E', '#757575']}
          style={styles.callButtonGradient}
        >
          <Phone size={18} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7CB342" />
        <Text style={styles.loadingText}>Loading doctors...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primaryGreen} barStyle="light-content" translucent />
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()} activeOpacity={0.8}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Video Consultation</Text>
          <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8}>
            <MaterialCommunityIcons name="account-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.subtitleBanner}>
          <MaterialCommunityIcons name="information-outline" size={15} color="#fff" />
          <Text style={styles.subtitleText}>Connect with experienced vets for online consultation.</Text>
        </View>

        <FlatList
          data={doctors}
          renderItem={renderDoctor}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Video size={64} color="#ccc" />
              <Text style={styles.emptyText}>No doctors available</Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  subtitleBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 28,
  },
  subtitleText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 19,
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
listContainer: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  doctorCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 6,
    maxWidth: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#7CB342',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  doctorName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  clinicName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    textAlign: 'center',
  },
  specialization: {
    fontSize: 11,
    color: '#7CB342',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  callButton: {
    width: '100%',
  },
  callButtonGradient: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});
