import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { signOutUser } from '../../../store/slices/authSlice';
import { MapPin, Phone, Mail, Clock, LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';

export default function ResortProfile() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resortData, setResortData] = useState(null);

  useEffect(() => {
    fetchResortProfile();
  }, []);

  const fetchResortProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await api.get(`/resorts/profile/${userId}`);
      setResortData(response.data);
    } catch (error) {
      console.error('Error fetching resort profile:', error);
      Alert.alert('Error', 'Failed to load resort profile');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          await AsyncStorage.multiRemove(['token', 'userId']);
          dispatch(signOutUser());
          router.replace('/(auth)/signin');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading profile...</Text>
      </View>
    );
  }

  if (!resortData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#666', fontSize: 16 }}>No resort data found</Text>
        <TouchableOpacity 
          style={{ marginTop: 20, backgroundColor: '#10B981', padding: 12, borderRadius: 8 }}
          onPress={() => router.push('/(pet_resort_tabs)/onboarding/pet_resort')}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Create Resort</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const serviceLabels = {
    cafe: 'Cafe',
    grooming: 'Grooming',
    swimming: 'Swimming',
    boarding_indoor: 'Boarding (Indoor)',
    boarding_outdoor: 'Boarding (Outdoor)',
    playground: 'Playground',
    veterinary: 'Veterinary on Premises'
  };

  const facilityLabels = {
    ac_rooms: 'AC Rooms',
    cctv: 'CCTV Monitoring',
    outdoor_play: 'Outdoor Play Area',
    staff_24x7: '24x7 Staff',
    training_area: 'Pet Training Area'
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchResortProfile(); }} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{resortData.resortName}</Text>
          <Text style={styles.headerSubtitle}>{resortData.brandName}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut}>
          <LogOut size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Logo & Status */}
      <View style={styles.logoSection}>
        <Image source={{ uri: resortData.logo }} style={styles.logo} />
        <View style={[styles.statusBadge, { backgroundColor: resortData.isVerified ? '#10B981' : '#F59E0B' }]}>
          <Text style={styles.statusText}>{resortData.isVerified ? 'Verified' : 'Pending Verification'}</Text>
        </View>
      </View>

      {/* Description */}
      {resortData.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{resortData.description}</Text>
        </View>
      )}

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.contactItem}>
          <MapPin size={20} color="#6B7280" />
          <Text style={styles.contactText}>{resortData.address}</Text>
        </View>
        <View style={styles.contactItem}>
          <Phone size={20} color="#6B7280" />
          <Text style={styles.contactText}>Resort: {resortData.resortPhone}</Text>
        </View>
        <View style={styles.contactItem}>
          <Phone size={20} color="#6B7280" />
          <Text style={styles.contactText}>Owner: {resortData.ownerPhone}</Text>
        </View>
        {resortData.email && (
          <View style={styles.contactItem}>
            <Mail size={20} color="#6B7280" />
            <Text style={styles.contactText}>{resortData.email}</Text>
          </View>
        )}
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services Offered</Text>
        <View style={styles.tagContainer}>
          {resortData.services.map(service => (
            <View key={service} style={styles.tag}>
              <Text style={styles.tagText}>{serviceLabels[service]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Facilities */}
      {resortData.facilities && resortData.facilities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Facilities</Text>
          <View style={styles.tagContainer}>
            {resortData.facilities.map(facility => (
              <View key={facility} style={[styles.tag, styles.facilityTag]}>
                <Text style={styles.tagText}>{facilityLabels[facility]}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Opening Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opening Hours</Text>
        {resortData.openingHours.map(day => (
          <View key={day.day} style={styles.hourRow}>
            <Text style={styles.dayText}>{day.day}</Text>
            <Text style={styles.timeText}>
              {day.closed ? 'Closed' : `${day.open} - ${day.close}`}
            </Text>
          </View>
        ))}
      </View>

      {/* Special Notice */}
      {(resortData.holidays || resortData.rules) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Notice</Text>
          {resortData.holidays && (
            <View style={styles.noticeItem}>
              <Text style={styles.noticeLabel}>Holidays:</Text>
              <Text style={styles.noticeText}>{resortData.holidays}</Text>
            </View>
          )}
          {resortData.rules && (
            <View style={styles.noticeItem}>
              <Text style={styles.noticeLabel}>Important Rules:</Text>
              <Text style={styles.noticeText}>{resortData.rules}</Text>
            </View>
          )}
        </View>
      )}

      {/* Gallery */}
      {resortData.gallery && resortData.gallery.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <View style={styles.galleryGrid}>
            {resortData.gallery.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#10B981',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#FFF' },
  headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  logoSection: { alignItems: 'center', padding: 20, backgroundColor: '#FFF', marginBottom: 16 },
  logo: { width: 120, height: 120, borderRadius: 60, marginBottom: 12 },
  statusBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  statusText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  section: { backgroundColor: '#FFF', padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },
  description: { fontSize: 15, color: '#6B7280', lineHeight: 22 },
  contactItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  contactText: { fontSize: 15, color: '#374151', flex: 1 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  facilityTag: { backgroundColor: '#3B82F6' },
  tagText: { color: '#FFF', fontSize: 13, fontWeight: '500' },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dayText: { fontSize: 15, fontWeight: '500', color: '#374151' },
  timeText: { fontSize: 15, color: '#6B7280' },
  noticeItem: { marginBottom: 12 },
  noticeLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  noticeText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  galleryImage: { width: 110, height: 110, borderRadius: 8 },
});
