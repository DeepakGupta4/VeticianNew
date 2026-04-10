import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Animated, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constant/theme';
import { PETS, ROOMS, fmtDate } from '../../../components/petparent/BookHostle/hostelData';

import SectionTitle   from '../../../components/petparent/BookHostle/SectionTitle';
import PetSelector    from '../../../components/petparent/BookHostle/PetSelector';
import HostelList     from '../../../components/petparent/BookHostle/HostelList';
import FacilityList   from '../../../components/petparent/BookHostle/FacilityList';
import RoomList       from '../../../components/petparent/BookHostle/RoomList';
import SafetyCard     from '../../../components/petparent/BookHostle/SafetyCard';
import DateTimePicker from '../../../components/petparent/BookHostle/DateTimePicker';
import BookingSummary from '../../../components/petparent/BookHostle/BookingSummary';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function BookHostelScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search,     setSearch]     = useState('');
  const [selPet,     setSelPet]     = useState(null);
  const [selHostel,  setSelHostel]  = useState(null);
  const [selRoom,    setSelRoom]    = useState(null);
  const [checkin,    setCheckin]    = useState(null);
  const [checkout,   setCheckout]   = useState(null);
  const [hostels,    setHostels]    = useState([]);
  const [loading,    setLoading]    = useState(true);

  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching pet resorts from:', `${API_URL}/resorts`);
      
      const response = await fetch(`${API_URL}/resorts`);
      const data = await response.json();
      
      console.log('📡 Response:', data);
      
      if (data.success && data.resorts) {
        // Transform backend data to match frontend format
        const formattedHostels = data.resorts.map((resort, index) => ({
          id: resort._id,
          name: resort.resortName || resort.brandName,
          rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5.0
          distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
          price: 499 + (index * 100), // Base price with variation
          rooms: 8 + (index * 4),
          tag: index === 0 ? 'Most Popular' : index === 1 ? 'Premium' : null,
          image: resort.logo || 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&q=80',
          address: resort.address,
          phone: resort.resortPhone,
          services: resort.services || [],
          facilities: resort.facilities || [],
          description: resort.description
        }));
        
        setHostels(formattedHostels);
        console.log('✅ Loaded', formattedHostels.length, 'pet resorts');
      } else {
        console.log('⚠️ No resorts found, using empty array');
        setHostels([]);
      }
    } catch (error) {
      console.error('❌ Error fetching hostels:', error);
      setHostels([]);
    } finally {
      setLoading(false);
    }
  };

  const nights = checkin && checkout
    ? Math.max(0, Math.round((checkout.date - checkin.date) / (1000 * 60 * 60 * 24)))
    : 0;

  const totalPrice = selRoom && nights > 0 ? selRoom.price * nights : selRoom ? selRoom.price : 0;
  const isReady    = selPet && selHostel && selRoom && checkin && checkout;

  const filtered = hostels.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));

  const handleConfirm = useCallback(() => {
    if (!isReady) {
      Alert.alert('Incomplete', 'Please select a pet, hostel, room and dates.');
      return;
    }
    Alert.alert(
      'Booking Confirmed! 🎉',
      `${selPet.name} will stay at ${selHostel.name} in a ${selRoom.name}.\nCheck-in:  ${fmtDate(checkin.date)} at ${checkin.time}\nCheck-out: ${fmtDate(checkout.date)} at ${checkout.time}\n\nTotal: ₹${totalPrice.toLocaleString('en-IN')}`,
      [{
        text: 'Watch Live 📷',
        onPress: () => router.push({
          pathname: '/(vetician_tabs)/pages/PetWatching',
          params: {
            petId:      selPet.id || selPet._id || '',
            hostelName: selHostel.name,
            roomType:   selRoom.name,
            checkin:    fmtDate(checkin.date),
            checkout:   fmtDate(checkout.date),
          },
        }),
      }]
    );
  }, [isReady, selPet, selHostel, selRoom, checkin, checkout, totalPrice]);

  return (
    <Animated.View style={[styles.root, { opacity }]}>

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.hRow}>
          <TouchableOpacity style={styles.hBtn} activeOpacity={0.8} onPress={() => router.back()}>
            <Icon name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.hTitle}>Pet Hostel</Text>
            <Text style={styles.hSub}>Vatecian</Text>
          </View>
          <TouchableOpacity style={styles.hBtn} activeOpacity={0.8}>
            <Icon name="account-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Icon name="magnify" size={18} color="#1a1a1a" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hostels..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="close-circle" size={16} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.locRow}>
          <Icon name="map-marker-outline" size={13} color="rgba(255,255,255,0.9)" />
          <Text style={styles.locText}>
            {loading ? 'Loading hostels...' : `${hostels.length} Hostels near you`}
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <SectionTitle title="Select Your Pet" sub="Who's staying with us?" />
        <PetSelector selected={selPet} onSelect={setSelPet} />

        <SectionTitle title="Nearby Hostels" sub="Tap to select one for your pet" />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading pet resorts...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="home-search-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Hostels Found</Text>
            <Text style={styles.emptyText}>
              {search ? 'Try a different search term' : 'No pet resorts registered yet'}
            </Text>
          </View>
        ) : (
          <HostelList hostels={filtered} selected={selHostel} onSelect={setSelHostel} />
        )}

        <SectionTitle title="What's Included" sub="All hostels come with these" />
        {selHostel && selHostel.facilities && selHostel.facilities.length > 0 ? (
          <FacilityList facilities={selHostel.facilities} />
        ) : (
          <Text style={styles.noDataText}>Select a hostel to view facilities</Text>
        )}

        <SectionTitle title="Room Type" sub="Pick what suits your pet best" />
        <RoomList selected={selRoom} onSelect={setSelRoom} />

        <SectionTitle title="Safety & Care" sub="We treat your pet like family" />
        <SafetyCard />

        <SectionTitle title="Check-in & Check-out" sub="Select date and time for your stay" />
        <DateTimePicker
          checkin={checkin}
          checkout={checkout}
          nights={nights}
          onCheckin={setCheckin}
          onCheckout={setCheckout}
        />

        <SectionTitle title="Booking Summary" sub="Review before confirming" titleColor={COLORS.primary} />
        <BookingSummary
          selPet={selPet}
          selHostel={selHostel}
          selRoom={selRoom}
          checkin={checkin}
          checkout={checkout}
          nights={nights}
          totalPrice={totalPrice}
          isReady={isReady}
          onConfirm={handleConfirm}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: COLORS.primary, paddingBottom: 16, paddingHorizontal: 18 },
  hRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  hBtn:   { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  hTitle: { fontSize: 17, fontWeight: '800', color: '#fff', textAlign: 'center' },
  hSub:   { fontSize: 10, color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginTop: 1 },
  searchBox:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a1a', marginLeft: 8, marginRight: 4 },
  locRow:  { flexDirection: 'row', alignItems: 'center' },
  locText: { fontSize: 12, color: 'rgba(255,255,255,0.88)', fontWeight: '500', marginLeft: 5 },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 22 },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
});
