import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Animated, Alert } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constant/theme';
import { HOSTELS, fmtDate } from '../../../components/petparent/BookHostle/hostelData';

import SectionTitle   from '../../../components/petparent/BookHostle/SectionTitle';
import PetSelector    from '../../../components/petparent/BookHostle/PetSelector';
import HostelList     from '../../../components/petparent/BookHostle/HostelList';
import FacilityList   from '../../../components/petparent/BookHostle/FacilityList';
import RoomList       from '../../../components/petparent/BookHostle/RoomList';
import SafetyCard     from '../../../components/petparent/BookHostle/SafetyCard';
import DateTimePicker from '../../../components/petparent/BookHostle/DateTimePicker';
import BookingSummary from '../../../components/petparent/BookHostle/BookingSummary';

export default function BookHostelScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search,     setSearch]     = useState('');
  const [selPet,     setSelPet]     = useState(null);
  const [selHostel,  setSelHostel]  = useState(null);
  const [selRoom,    setSelRoom]    = useState(null);
  const [checkin,    setCheckin]    = useState(null);
  const [checkout,   setCheckout]   = useState(null);

  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, []);

  const nights = checkin && checkout
    ? Math.max(0, Math.round((checkout.date - checkin.date) / (1000 * 60 * 60 * 24)))
    : 0;

  const totalPrice = selRoom && nights > 0 ? selRoom.price * nights : selRoom ? selRoom.price : 0;
  const isReady    = selPet && selHostel && selRoom && checkin && checkout;

  const filtered = HOSTELS.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));

  const handleConfirm = useCallback(() => {
    if (!isReady) {
      Alert.alert('Incomplete', 'Please select a pet, hostel, room and dates.');
      return;
    }
    Alert.alert(
      'Booking Confirmed!',
      `${selPet.name} will stay at ${selHostel.name} in a ${selRoom.name}.\nCheck-in:  ${fmtDate(checkin.date)} at ${checkin.time}\nCheck-out: ${fmtDate(checkout.date)} at ${checkout.time}\n\nTotal: ₹${totalPrice.toLocaleString('en-IN')}`,
      [{ text: 'Great!' }]
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
          <Text style={styles.locText}>Hostels near you · Lucknow</Text>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <SectionTitle title="Select Your Pet" sub="Who's staying with us?" />
        <PetSelector selected={selPet} onSelect={setSelPet} />

        <SectionTitle title="Nearby Hostels" sub="Tap to select one for your pet" />
        <HostelList hostels={filtered} selected={selHostel} onSelect={setSelHostel} />

        <SectionTitle title="What's Included" sub="All hostels come with these" />
        <FacilityList />

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
});
