import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Alert, Linking } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import ApiService from '../../../services/api';
import CommonHeader from '../../../components/CommonHeader';

const ParavetCard = ({ paravet, onPress, userLocation }) => {
  const handleCall = () => {
    const phone = paravet.personalInfo?.mobileNumber?.value;
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <View style={styles.clinicHeaderLeft}>
          <Text style={styles.paravetName} numberOfLines={1}>
            {paravet.personalInfo?.fullName?.value || 'Paravet'}
          </Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>Paravet Professional</Text>
          </View>
        </View>
        {paravet.applicationStatus?.approvalStatus === 'approved' && (
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={16} color="#10B981" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      <View style={styles.paravetSection}>
        <Image 
          source={{ uri: paravet.documents?.profilePhoto?.url || 'https://ui-avatars.com/api/?name=Paravet&size=70&background=9B59B6&color=fff' }} 
          style={styles.profileImage} 
        />
        <View style={styles.paravetInfo}>
          <Text style={styles.specialization}>
            {paravet.experience?.yearsOfExperience?.value || '0'} years experience
          </Text>
          <Text style={styles.expertise} numberOfLines={2}>
            {paravet.experience?.areasOfExpertise?.value?.join(', ') || 'General Care'}
          </Text>
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={16} color="#24A1DE" />
            <Text style={styles.locationText} numberOfLines={1}>
              {paravet.personalInfo?.city?.value || 'Location'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={16} color="#24A1DE" />
          <Text style={styles.serviceAreaText} numberOfLines={1}>
            {paravet.personalInfo?.serviceArea?.value || 'Service Area'}
          </Text>
        </View>
        
        {paravet.distance && (
          <View style={styles.distanceContainer}>
            <MaterialIcons name="near-me" size={14} color="#1976D2" />
            <Text style={styles.distanceText}>{paravet.distance} km</Text>
          </View>
        )}
      </View>

      <View style={styles.skillsSection}>
        <View style={styles.skillsRow}>
          {(paravet.experience?.languagesSpoken?.value || []).slice(0, 3).map((lang, idx) => (
            <View key={idx} style={styles.skillChip}>
              <Ionicons name="language" size={12} color="#10B981" />
              <Text style={styles.skillText}>{lang}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.bookButton} onPress={onPress}>
          <Ionicons name="calendar" size={18} color="white" />
          <Text style={styles.bookButtonText}>Book Service</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color="#24A1DE" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ParavetListScreen() {
  const router = useRouter();
  const [paravets, setParavets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

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
    } catch (error) {
      console.error('❌ Error getting location:', error);
    }
  };

  const fetchParavets = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getVerifiedParavets();
      
      let paravetsList = response.data || [];
      console.log('✅ Paravets fetched:', paravetsList.length);
      
      setParavets(paravetsList);
    } catch (error) {
      console.error('❌ Error fetching paravets:', error);
      Alert.alert('Error', 'Failed to load paravets');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserLocation();
    }, [])
  );

  useEffect(() => {
    fetchParavets();
  }, [userLocation]);

  const handleParavetPress = (paravet) => {
    router.push({
      pathname: 'pages/ParavetDetailScreen',
      params: { paravet: JSON.stringify(paravet) }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#24A1DE" />
        <Text style={styles.loadingText}>Loading paravets...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="Find Paravets" />
      
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {paravets.length} {paravets.length === 1 ? 'Paravet' : 'Paravets'}
        </Text>
      </View>

      <FlatList
        data={paravets}
        renderItem={({ item }) => (
          <ParavetCard
            paravet={item}
            userLocation={userLocation}
            onPress={() => handleParavetPress(item)}
          />
        )}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="person-search" size={80} color="#E0E0E0" />
            <Text style={styles.emptyText}>No paravets found</Text>
            <Text style={styles.emptySubtext}>Paravets will appear here once verified by admin</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 14, color: '#666', marginTop: 12 },
  resultsHeader: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  resultsCount: { fontSize: 18, fontWeight: '700', color: '#333' },
  listContent: { padding: 16, paddingBottom: 24 },
  
  // Card Styles
  card: { backgroundColor: 'white', borderRadius: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, overflow: 'hidden' },
  
  // Card Header
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, paddingBottom: 12, backgroundColor: '#F8F9FA', borderBottomWidth: 1, borderBottomColor: '#E8E8E8' },
  clinicHeaderLeft: { flex: 1, marginRight: 8 },
  paravetName: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 },
  typeBadge: { alignSelf: 'flex-start', backgroundColor: '#F3E8FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  typeText: { fontSize: 11, color: '#9B59B6', fontWeight: '600' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  verifiedText: { fontSize: 11, color: '#10B981', fontWeight: '600', marginLeft: 3 },
  
  // Paravet Section
  paravetSection: { flexDirection: 'row', padding: 16, paddingBottom: 12 },
  profileImage: { width: 70, height: 70, borderRadius: 35, borderWidth: 2.5, borderColor: '#9B59B6' },
  paravetInfo: { flex: 1, marginLeft: 14, justifyContent: 'center' },
  specialization: { fontSize: 15, fontWeight: '600', color: '#9B59B6', marginBottom: 4 },
  expertise: { fontSize: 13, color: '#666', marginBottom: 3, fontWeight: '500' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: 13, color: '#666', marginLeft: 4, fontWeight: '500', flex: 1 },
  
  // Info Row
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  locationContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  serviceAreaText: { fontSize: 13, color: '#666', marginLeft: 4, fontWeight: '500', flex: 1 },
  distanceContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  distanceText: { fontSize: 12, fontWeight: '600', color: '#1976D2', marginLeft: 3 },
  
  // Skills Section
  skillsSection: { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#BBF7D0' },
  skillText: { fontSize: 11, color: '#059669', fontWeight: '600', marginLeft: 4 },
  
  // Action Buttons
  actionButtons: { flexDirection: 'row', padding: 16, paddingTop: 12, gap: 10 },
  bookButton: { flex: 1, flexDirection: 'row', backgroundColor: '#9B59B6', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#9B59B6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  bookButtonText: { color: 'white', fontSize: 15, fontWeight: '700', marginLeft: 8 },
  secondaryActions: { flexDirection: 'row', gap: 8 },
  iconButton: { width: 48, height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: '#9B59B6', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  
  // Empty State
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#666', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' },
});
