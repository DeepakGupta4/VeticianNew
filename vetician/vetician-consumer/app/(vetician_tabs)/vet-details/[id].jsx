import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import Header from '../../../components/petparent/VetFav/Header';
import VetDetailsCard from '../../../components/petparent/VetFav/VetDetailsCard';
import ActionButtons from '../../../components/petparent/VetFav/ActionButtons';
import { FAVORITE_VETS } from '../../../components/petparent/VetFav/vets';
import { COLORS2 as C } from '../../../components/petparent/VetFav/colors';

export default function VetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const vet = FAVORITE_VETS.find((v) => v.id === id);

  if (!vet) {
    return (
      <SafeAreaView style={s.safe}>
        <Header title="Vet Profile" subtitle="" onBack={() => router.back()} />
        <View style={s.notFound}>
          <Text style={s.notFoundTxt}>Vet not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCall = useCallback(() => {
    const url = `tel:${vet.phone.replace(/\s/g, '')}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to make a call on this device.')
    );
  }, [vet.phone]);

  const handleBook = useCallback(() => {
    router.push({ pathname: '/(vetician_tabs)/pages/BookScreen', params: { vetId: vet.id } });
  }, [router, vet.id]);

  const handleChat = useCallback(() => {
    router.push({ pathname: '/(vetician_tabs)/pages/BookScreen', params: { vetId: vet.id } });
  }, [router, vet.id]);

  const handleRemove = useCallback(() => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${vet.name} from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => router.back() },
      ]
    );
  }, [vet.name, router]);

  return (
    <SafeAreaView style={s.safe}>
      <Header
        title="Vet Profile"
        subtitle={`${vet.clinic} · ${vet.location}`}
        onBack={() => router.back()}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll} contentContainerStyle={s.scrollContent}>

        {/* Hero Card */}
        <Animated.View entering={FadeInDown.duration(350)}>
          <VetDetailsCard vet={vet} />
        </Animated.View>

        {/* Action Buttons Card */}
        <Animated.View entering={FadeInDown.duration(350).delay(60)} style={s.card}>
          <ActionButtons
            onCall={handleCall}
            onBook={handleBook}
            onChat={handleChat}
            onRemove={handleRemove}
          />
        </Animated.View>

        {/* Clinic Info Card */}
        <Animated.View entering={FadeInDown.duration(350).delay(120)} style={s.card}>
          <SectionHeader title="Clinic Info" icon="hospital-building" />
          <InfoRow icon="map-marker-outline" label="Address" value={vet.address} />
          <InfoRow icon="phone-outline" label="Phone" value={vet.phone} last />
        </Animated.View>

        {/* Services Card */}
        <Animated.View entering={FadeInDown.duration(350).delay(180)} style={s.card}>
          <SectionHeader title="Services Offered" icon="stethoscope" />
          <View style={s.servicesWrap}>
            {vet.services.map((srv) => (
              <View key={srv} style={s.serviceTag}>
                <MaterialCommunityIcons name="check-circle-outline" size={11} color="#558B2F" />
                <Text style={s.serviceTagTxt}>{srv}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Timings Card */}
        <Animated.View entering={FadeInDown.duration(350).delay(240)} style={s.card}>
          <SectionHeader title="Available Timings" icon="clock-outline" />
          <View style={s.timingsGrid}>
            {vet.timings.map((t) => (
              <View key={t.day} style={[s.timingItem, t.closed && s.timingClosed]}>
                <View style={s.timingDayRow}>
                  <View style={[s.timingDot, { backgroundColor: t.closed ? '#BBBBBB' : '#4CAF50' }]} />
                  <Text style={[s.timingDay, t.closed && s.timingClosedTxt]}>{t.day}</Text>
                </View>
                <Text style={[s.timingHours, t.closed && s.timingClosedHours]}>{t.hours}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Fee Card */}
        <Animated.View entering={FadeInDown.duration(350).delay(300)} style={[s.card, s.feeCard]}>
          <View style={s.feeIconBox}>
            <MaterialCommunityIcons name="currency-inr" size={22} color="#558B2F" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.feeLabel}>Consultation Fee</Text>
            <Text style={s.feeVal}>{vet.fee} <Text style={s.feePerVisit}>per visit</Text></Text>
          </View>
          <TouchableOpacity style={s.bookSmall} onPress={handleBook} activeOpacity={0.85}>
            <Text style={s.bookSmallTxt}>Book Now</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={s.bookBar}>
        <TouchableOpacity style={s.callBtn} onPress={handleCall} activeOpacity={0.85}>
          <MaterialCommunityIcons name="phone-outline" size={17} color={C.primary} />
          <Text style={s.callTxt}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.bookBtn} onPress={handleBook} activeOpacity={0.85}>
          <MaterialCommunityIcons name="calendar-check-outline" size={17} color="#FFFFFF" />
          <Text style={s.bookTxt}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function SectionHeader({ title, icon }) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.sectionIconBox}>
        <MaterialCommunityIcons name={icon} size={13} color="#558B2F" />
      </View>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value, last = false }) {
  return (
    <View style={[s.infoRow, !last && s.infoRowBorder]}>
      <View style={s.infoIcon}>
        <MaterialCommunityIcons name={icon} size={14} color="#558B2F" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const SHADOW = {
  shadowColor: '#558B2F',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 10,
  elevation: 4,
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F7F2' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 16 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundTxt: { fontSize: 16, color: '#6B7B5E' },

  // Generic card
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#D0E8C0',
    overflow: 'hidden',
    ...SHADOW,
  },

  // Section header inside card
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F0E1',
    backgroundColor: '#FFFFFF',
  },
  sectionIconBox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: '#F1F8E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B2A10',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 13,
    paddingHorizontal: 14,
  },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: '#EEF5E8' },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#F1F8E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoLabel: { fontSize: 11, color: '#6B7B5E', fontWeight: '500' },
  infoValue: { fontSize: 13, color: '#1B2A10', fontWeight: '600', marginTop: 2, lineHeight: 18 },

  // Services
  servicesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 14 },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    borderRadius: 20,
  },
  serviceTagTxt: { fontSize: 12, color: '#2E7D32', fontWeight: '600' },

  // Timings
  timingsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 14 },
  timingItem: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 11,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    shadowColor: '#558B2F',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  timingClosed: { borderColor: '#E0E0E0', shadowOpacity: 0 },
  timingDayRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  timingDot: { width: 6, height: 6, borderRadius: 3 },
  timingDay: { fontSize: 11, color: '#2D3A1F', fontWeight: '700' },
  timingHours: { fontSize: 12, color: '#558B2F', fontWeight: '600' },
  timingClosedTxt: { color: '#9E9E9E' },
  timingClosedHours: { color: '#BBBBBB' },

  // Fee card
  feeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  feeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F8E9',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feeLabel: { fontSize: 11, color: '#6B7B5E', fontWeight: '500' },
  feeVal: { fontSize: 18, color: '#1B2A10', fontWeight: '800', marginTop: 1 },
  feePerVisit: { fontSize: 12, color: '#6B7B5E', fontWeight: '400' },
  bookSmall: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: '#558B2F',
    borderRadius: 12,
    shadowColor: '#558B2F',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  bookSmallTxt: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  // Bottom bar
  bookBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#D0E8C0',
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 10,
    elevation: 10,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#558B2F',
    backgroundColor: '#F1F8E9',
  },
  callTxt: { color: '#558B2F', fontSize: 14, fontWeight: '700' },
  bookBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#558B2F',
    shadowColor: '#558B2F',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  bookTxt: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
