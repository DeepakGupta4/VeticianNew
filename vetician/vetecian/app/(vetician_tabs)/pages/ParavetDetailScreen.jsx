import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../../../services/api';

const ParavetDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [paravetData, setParavetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParavetDetails();
  }, []);

  const fetchParavetDetails = async () => {
    try {
      const response = await ApiService.get(`/paravet/verified`);
      const paravet = response.data?.find(p => p._id === params.paravetId || p.id === params.paravetId);
      if (paravet) {
        console.log('🔍 Paravet Data:', paravet);
        console.log('📦 Services:', paravet.experience?.areasOfExpertise?.value);
        setParavetData(paravet);
      } else {
        Alert.alert('Error', 'Paravet not found');
      }
    } catch (error) {
      console.error('Error fetching paravet details:', error);
      Alert.alert('Error', 'Failed to load paravet details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#24A1DE" />
        </View>
      </SafeAreaView>
    );
  }

  if (!paravetData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Paravet not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleVideoCall = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName') || 'Pet Parent';
      const token = await AsyncStorage.getItem('token');
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
      
      const response = await fetch(`${apiUrl}/call/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          callerId: userId,
          receiverId: paravetData.id,
          callerData: {
            name: userName,
            img: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=150&background=4E8D7C&color=fff`,
            role: 'Pet Parent'
          }
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        router.push({
          pathname: 'pages/VideoCallScreen',
          params: {
            callId: data.callId,
            roomName: data.roomName,
            token: data.token || 'mock-token',
            receiverId: paravetData.id,
            receiverName: paravetData.name,
            receiverImg: paravetData.photo,
            isInitiator: 'true'
          }
        });
      } else {
        Alert.alert('Error', data.message || 'Failed to initiate call');
      }
    } catch (error) {
      console.error('🔴 [CALL] Exception:', error);
      Alert.alert('Error', 'Failed to start call: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paravet Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <Image source={{ uri: paravetData.photo || 'https://via.placeholder.com/90' }} style={styles.paravetImage} />
            <View style={styles.paravetMainInfo}>
              <Text style={styles.paravetName}>{paravetData.name || 'N/A'}</Text>
              <Text style={styles.specialties}>{paravetData.specialization || 'Paravet'}</Text>
              <Text style={styles.expText}>{paravetData.experience?.yearsOfExperience?.value || '0 years'}</Text>
            </View>
          </View>

          <View style={styles.trustedBadge}>
            <MaterialIcons name="shield-check" size={20} color="#24A1DE" />
            <Text style={styles.trustedText}>Verified Paravet</Text>
          </View>

          <View style={styles.verificationRow}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.verifyText}>Background Verified</Text>
          </View>

          <Text style={styles.shortBio}>
            {paravetData.name || 'Paravet'} is a verified paravet in {paravetData.city || 'your area'}. 
            Provides professional pet care services at your doorstep.
          </Text>
        </View>

        <View style={styles.infoContent}>
          {paravetData.city && (
            <View style={styles.infoCard}>
              <Text style={styles.subHeading}>Location</Text>
              <Text style={styles.infoText}>{paravetData.city}</Text>
            </View>
          )}

          {paravetData.personalInfo?.mobileNumber?.value && (
            <View style={styles.infoCard}>
              <Text style={styles.subHeading}>Contact</Text>
              <Text style={styles.infoText}>{paravetData.personalInfo.mobileNumber.value}</Text>
              {paravetData.personalInfo?.email?.value && (
                <Text style={styles.infoSubText}>{paravetData.personalInfo.email.value}</Text>
              )}
            </View>
          )}
          
          {paravetData.experience?.areasOfExpertise?.value?.length > 0 && (
            <View style={styles.infoCard}>
              <Text style={styles.subHeading}>Services</Text>
              <View style={styles.serviceGrid}>
                {paravetData.experience.areasOfExpertise.value.map(s => (
                  <Text key={s} style={styles.serviceTag}>• {s}</Text>
                ))}
              </View>
            </View>
          )}

          {paravetData.experience?.languagesSpoken?.value?.length > 0 && (
            <View style={styles.infoCard}>
              <Text style={styles.subHeading}>Languages</Text>
              <Text style={styles.infoText}>{paravetData.experience.languagesSpoken.value.join(', ')}</Text>
            </View>
          )}

          {paravetData.availability && (
            <View style={styles.infoCard}>
              <Text style={styles.subHeading}>Availability</Text>
              <Text style={styles.infoText}>Days: {paravetData.availability.days?.join(', ') || 'N/A'}</Text>
              <Text style={styles.infoSubText}>Time: {paravetData.availability.startTime || 'N/A'} - {paravetData.availability.endTime || 'N/A'}</Text>
            </View>
          )}

          {paravetData.distance && paravetData.distance !== 'N/A' && (
            <View style={styles.distanceCard}>
              <MaterialIcons name="near-me" size={24} color="#1976D2" />
              <View style={styles.distanceInfo}>
                <Text style={styles.distanceLabel}>Distance from you</Text>
                <Text style={styles.distanceValue}>{paravetData.distance} km away</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomFixed}>
        <TouchableOpacity style={styles.callBtn} onPress={handleVideoCall}>
          <MaterialIcons name="videocam" size={20} color="white" style={{marginRight: 8}} />
          <Text style={styles.callBtnText}>Video Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bookBtn} onPress={() => {
          const services = paravetData.experience?.areasOfExpertise?.value || [];
          console.log('🚀 Navigating with services:', services);
          router.push({
            pathname: 'pages/DoorStep',
            params: {
              paravetId: paravetData._id || paravetData.id,
              paravetName: paravetData.name,
              paravetServices: JSON.stringify(services)
            }
          });
        }}>
          <MaterialIcons name="calendar-today" size={20} color="white" style={{marginRight: 8}} />
          <Text style={styles.bookBtnText}>Book Service</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  profileSection: { padding: 15 },
  profileRow: { flexDirection: 'row' },
  paravetImage: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#24A1DE' },
  paravetMainInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  paravetName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  specialties: { fontSize: 14, color: '#666', marginTop: 4 },
  expText: { fontSize: 13, fontWeight: '500', color: '#333', marginTop: 4 },
  trustedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', padding: 10, borderRadius: 6, marginTop: 15, borderWidth: 1, borderColor: '#e0f2fe' },
  trustedText: { marginLeft: 8, color: '#24A1DE', fontWeight: '600', fontSize: 14 },
  verificationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  verifyText: { marginLeft: 8, color: '#444', fontWeight: '500' },
  shortBio: { color: '#555', lineHeight: 20, marginTop: 15, fontSize: 14 },
  infoContent: { padding: 15, backgroundColor: '#f9f9f9' },
  infoCard: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15 },
  subHeading: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  infoText: { fontSize: 14, color: '#555', marginBottom: 4 },
  infoSubText: { fontSize: 13, color: '#777', marginTop: 4 },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  serviceTag: { width: '50%', fontSize: 14, color: '#555', marginBottom: 8 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  distanceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', padding: 15, borderRadius: 8 },
  distanceInfo: { marginLeft: 12 },
  distanceLabel: { fontSize: 12, color: '#666' },
  distanceValue: { fontSize: 16, fontWeight: 'bold', color: '#1976D2', marginTop: 2 },
  bottomFixed: { padding: 15, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: 'white', flexDirection: 'row', gap: 10 },
  callBtn: { backgroundColor: '#10B981', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  callBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  bookBtn: { flex: 1, backgroundColor: '#24A1DE', borderRadius: 8, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  bookBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default ParavetDetailScreen;
