import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, FlatList, TextInput, ActivityIndicator, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import ApiService from '../../../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constant/theme';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&auto=format&fit=crop';

export default function ClinicListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [clinics, setClinics] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClinics();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFiltered(clinics);
    } else {
      const q = searchQuery.toLowerCase();
      setFiltered(clinics.filter(c =>
        c.clinicName?.toLowerCase().includes(q) ||
        c.establishmentType?.toLowerCase().includes(q)
      ));
    }
  }, [searchQuery, clinics]);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      let locationParams = {};
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        locationParams = { userLat: loc.coords.latitude, userLon: loc.coords.longitude };
      }
      const data = await ApiService.getAllVerifiedClinics(locationParams);
      const list = Array.isArray(data) ? data : data?.data || [];
      const mapped = list.map(c => ({
        _id: c.clinicDetails?.clinicId || c._id,
        clinicName: c.clinicDetails?.clinicName || c.clinicName,
        establishmentType: c.clinicDetails?.establishmentType || c.establishmentType,
        distance: c.clinicDetails?.distance || 'N/A',
        profilePhotoUrl: c.veterinarian?.profilePhotoUrl || c.veterinarianDetails?.profilePhotoUrl,
        verified: c.clinicDetails?.verified ?? true,
        city: c.clinicDetails?.city,
        locality: c.clinicDetails?.locality,
        fees: c.clinicDetails?.fees,
        raw: c,
      })).sort((a, b) => {
        const dA = a.distance === 'N/A' ? Infinity : parseFloat(a.distance);
        const dB = b.distance === 'N/A' ? Infinity : parseFloat(b.distance);
        return dA - dB;
      });
      setClinics(mapped);
    } catch (err) {
      console.error('Clinics fetch failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClinicPress = (clinic) => {
    const raw = clinic.raw || {};
    const cd = raw.clinicDetails || {};
    const vd = raw.veterinarianDetails || raw.veterinarian || {};
    router.push({
      pathname: 'pages/ClinicDetailScreen',
      params: {
        clinicId: clinic._id,
        clinicName: clinic.clinicName,
        establishmentType: clinic.establishmentType,
        distance: clinic.distance,
        profilePhotoUrl: clinic.profilePhotoUrl,
        city: cd.city || '',
        locality: cd.locality || '',
        streetAddress: cd.streetAddress || '',
        fees: cd.fees || '',
        vetId: vd.vetId || vd._id || '',
        vetName: vd.name || '',
        specialization: vd.specialization || '',
        experience: vd.experience || '',
      },
    });
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleClinicPress(item)} activeOpacity={0.9}>
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.profilePhotoUrl || DEFAULT_IMAGE }}
          style={styles.clinicImage}
          resizeMode="cover"
        />
        {/* Verified badge */}
        {item.verified && (
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={12} color="#10B981" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <MaterialIcons name="star" size={12} color="#fff" />
          <Text style={styles.ratingText}>4.5</Text>
        </View>
        {/* Distance badge */}
        <View style={styles.distanceBadge}>
          <MaterialIcons name="location-on" size={12} color="#7CB342" />
          <Text style={styles.distanceText}>
            {item.distance !== 'N/A' ? `${item.distance} KM` : 'N/A'}
          </Text>
        </View>
        {/* Book Now */}
        <TouchableOpacity style={styles.bookNowBadge} onPress={() => handleClinicPress(item)}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <View style={styles.clinicNameRow}>
          <Text style={styles.clinicName} numberOfLines={1} ellipsizeMode="tail">{item.clinicName}</Text>
          {item.fees && <Text style={styles.feesText}>₹{item.fees}</Text>}
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={11} color="#999" />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.locality ? `${item.locality}, ` : ''}{item.city || item.establishmentType}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={11} color="#7CB342" />
          <Text style={styles.timeText}>09:30 AM - 08:00 PM</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryGreen} barStyle="light-content" translucent />
      {/* Green Navbar */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()} activeOpacity={0.8}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Clinics</Text>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8}>
          <MaterialCommunityIcons name="account-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.subtitleBanner}>
        <MaterialCommunityIcons name="information-outline" size={15} color="#fff" />
        <Text style={styles.subtitleText}>Find verified clinics near you.</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={18} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clinics..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Results count */}
      {!loading && (
        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>{filtered.length} clinic{filtered.length !== 1 ? 's' : ''} found</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7CB342" />
          <Text style={styles.loadingText}>Loading clinics...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <MaterialIcons name="local-hospital" size={64} color="#DDD" />
          <Text style={styles.emptyText}>No clinics found</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderCard}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 16, paddingBottom: 16,
  },
  headerIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19, fontWeight: '800', color: '#fff', letterSpacing: 0.3,
  },
  subtitleBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16,
  },
  subtitleText: {
    flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 19,
  },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 12,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  resultsRow: { paddingHorizontal: 16, paddingVertical: 10 },
  resultsText: { fontSize: 13, color: '#666', fontWeight: '600' },
  list: { padding: 16, gap: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#666', fontSize: 14 },
  emptyText: { color: '#666', fontSize: 16, fontWeight: '600', marginTop: 12 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: { width: '100%', height: 200, position: 'relative' },
  clinicImage: { width: '100%', height: '100%' },

  verifiedBadge: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20,
  },
  verifiedText: { color: '#10B981', fontWeight: '700', fontSize: 11 },

  ratingBadge: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#7CB342', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20,
  },
  ratingText: { color: '#fff', fontWeight: '700', fontSize: 11 },

  distanceBadge: {
    position: 'absolute', bottom: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20,
  },
  distanceText: { color: '#7CB342', fontWeight: '700', fontSize: 11 },

  bookNowBadge: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: '#7CB342', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
  },
  bookNowText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  cardInfo: { padding: 14 },
  clinicNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  clinicName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', flex: 1, marginRight: 8 },
  feesText: { fontSize: 15, color: '#7CB342', fontWeight: '800' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  infoText: { fontSize: 12, color: '#999', flex: 1 },
  timeText: { fontSize: 12, color: '#7CB342', fontWeight: '600' },
});
