import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Video, ArrowLeft, Phone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../../../services/api';
import { Stack } from 'expo-router';

export default function VideoConsultation() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
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

  const renderDoctor = ({ item }) => (
    <View style={styles.doctorCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.img }} style={styles.doctorImage} />
        <View style={styles.onlineBadge} />
      </View>
      <Text style={styles.doctorName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.clinicName} numberOfLines={1}>{item.clinicName}</Text>
      <Text style={styles.specialization} numberOfLines={1}>{item.specialization}</Text>
      <TouchableOpacity 
        style={styles.callButton}
        onPress={() => handleVideoCall(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#4E8D7C', '#6BA896']}
          style={styles.callButtonGradient}
        >
          <Phone size={18} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E8D7C" />
        <Text style={styles.loadingText}>Loading doctors...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#4E8D7C" />
      <View style={styles.container}>
        <LinearGradient colors={['#4E8D7C', '#6BA896']} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Video Consultation</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
    borderColor: '#4E8D7C',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
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
    color: '#4E8D7C',
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
