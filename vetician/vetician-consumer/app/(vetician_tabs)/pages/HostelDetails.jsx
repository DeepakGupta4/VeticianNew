import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constant/theme';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function HostelDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { hostelId } = useLocalSearchParams();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostelDetails();
  }, [hostelId]);

  const fetchHostelDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/resorts/${hostelId}`);
      const data = await response.json();
      
      if (data.success && data.resort) {
        setHostel(data.resort);
      }
    } catch (error) {
      console.error('Error fetching hostel details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (!hostel) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>Hostel not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hostel Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: hostel.logo || 'https://via.placeholder.com/400' }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.name}>{hostel.resortName || hostel.brandName}</Text>
          
          {hostel.address && (
            <View style={styles.row}>
              <Icon name="map-marker" size={18} color={COLORS.primary} />
              <Text style={styles.address}>{hostel.address}</Text>
            </View>
          )}

          {hostel.resortPhone && (
            <View style={styles.row}>
              <Icon name="phone" size={18} color={COLORS.primary} />
              <Text style={styles.phone}>{hostel.resortPhone}</Text>
            </View>
          )}

          {hostel.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{hostel.description}</Text>
            </View>
          )}

          {hostel.services && hostel.services.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Services</Text>
              <View style={styles.grid}>
                {hostel.services.map((service, index) => (
                  <View key={index} style={styles.item}>
                    <Icon name="check-circle" size={20} color={COLORS.primary} />
                    <Text style={styles.itemText}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {hostel.facilities && hostel.facilities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Facilities</Text>
              <View style={styles.grid}>
                {hostel.facilities.map((facility, index) => (
                  <View key={index} style={styles.item}>
                    <Icon name="star" size={20} color={COLORS.primary} />
                    <Text style={styles.itemText}>{facility}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: COLORS.primary, paddingBottom: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  scroll: { flex: 1 },
  image: { width: '100%', height: 250, backgroundColor: '#f0f0f0' },
  content: { padding: 18 },
  name: { fontSize: 24, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  address: { fontSize: 14, color: '#555', flex: 1 },
  phone: { fontSize: 14, color: '#555' },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  description: { fontSize: 14, color: '#555', lineHeight: 22 },
  grid: { gap: 12 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F0F7E6', padding: 12, borderRadius: 8 },
  itemText: { fontSize: 14, color: '#1a1a1a', flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#888' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  errorText: { fontSize: 16, color: '#888', marginTop: 12, marginBottom: 24 },
  backBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  backBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
