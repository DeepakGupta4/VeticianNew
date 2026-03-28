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

import Header from '../../../components/favorite-vets/Header';
import VetDetailsCard from '../../../components/favorite-vets/VetDetailsCard';
import ActionButtons from '../../../components/favorite-vets/ActionButtons';
import { FAVORITE_VETS } from '../../../data/vets';
import { COLORS2 as C } from '../../../constants/colors';

/**
 * VetDetailsScreen
 * Full vet profile opened when a VetCard is tapped.
 *
 * Route: /profile/vet-details/[id]
 * Params: id — vet.id string
 */
export default function VetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Find the vet — in a real app this would come from a store/API
  const vet = FAVORITE_VETS.find((v) => v.id === id);

  // ─── Guard ─────────────────────────────────────────────────────────────────
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

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleCall = useCallback(() => {
    const url = `tel:${vet.phone.replace(/\s/g, '')}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to make a call on this device.')
    );
  }, [vet.phone]);

  const handleBook = useCallback(() => {
    router.push({ pathname: '/book-appointment', params: { vetId: vet.id } });
  }, [router, vet.id]);

  const handleChat = useCallback(() => {
    router.push({ pathname: '/chat', params: { vetId: vet.id } });
  }, [router, vet.id]);

  const handleRemove = useCallback(() => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${vet.name} from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => router.back(),
          // In a real app: dispatch remove action, then go back
        },
      ]
    );
  }, [vet.name, router]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <Header
        title="Vet Profile"
        subtitle={`${vet.clinic} · ${vet.location}`}
        onBack={() => router.back()}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>

        {/* Hero Card */}
        <Animated.View entering={FadeInDown.duration(350)}>
          <VetDetailsCard vet={vet} />

          {/* Action Buttons inside hero */}
          <View style={s.actionWrap}>
            <ActionButtons
              onCall={handleCall}
              onBook={handleBook}
              onChat={handleChat}
              onRemove={handleRemove}
            />
          </View>
        </Animated.View>

        {/* Clinic Info */}
        <Animated.View
          entering={FadeInDown.duration(350).delay(80)}
          style={s.section}
        >
          <SectionHeader title="Clinic Info" />
          <InfoRow
            icon="map-marker-outline"
            label="Address"
            value={vet.address}
          />
          <InfoRow
            icon="phone-outline"
            label="Phone"
            value={vet.phone}
            last
          />
        </Animated.View>

        {/* Services */}
        <Animated.View
          entering={FadeInDown.duration(350).delay(160)}
          style={s.section}
        >
          <SectionHeader title="Services Offered" />
          <View style={s.servicesWrap}>
            {vet.services.map((srv) => (
              <View key={srv} style={s.serviceTag}>
                <Text style={s.serviceTagTxt}>{srv}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Timings */}
        <Animated.View
          entering={FadeInDown.duration(350).delay(240)}
          style={s.section}
        >
          <SectionHeader title="Available Timings" />
          <View style={s.timingsGrid}>
            {vet.timings.map((t) => (
              <View
                key={t.day}
                style={[s.timingItem, t.closed && s.timingClosed]}
              >
                <Text style={s.timingDay}>{t.day}</Text>
                <Text
                  style={[s.timingHours, t.closed && s.timingClosedTxt]}
                >
                  {t.hours}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Consultation Fee Callout */}
        <Animated.View
          entering={FadeInDown.duration(350).delay(320)}
          style={s.feeCard}
        >
          <MaterialCommunityIcons
            name="currency-inr"
            size={20}
            color={C.primary}
          />
          <View style={{ flex: 1 }}>
            <Text style={s.feeLabel}>Consultation Fee</Text>
            <Text style={s.feeVal}>{vet.fee} per visit</Text>
          </View>
          <TouchableOpacity style={s.bookSmall} onPress={handleBook}>
            <Text style={s.bookSmallTxt}>Book Now</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={s.bookBar}>
        <TouchableOpacity style={s.callBtn} onPress={handleCall}>
          <MaterialCommunityIcons
            name="phone-outline"
            size={16}
            color={C.primary}
          />
          <Text style={s.callTxt}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.bookBtn} onPress={handleBook}>
          <MaterialCommunityIcons
            name="calendar-check-outline"
            size={16}
            color="#FFFFFF"
          />
          <Text style={s.bookTxt}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ title }) {
  return (
    <View style={s.sectionHeader}>
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

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundTxt: {
    fontSize: 16,
    color: '#6B7B5E',
  },
  actionWrap: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F0E1',
  },
  // Sections
  section: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8F0E1',
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F0E1',
    backgroundColor: '#F1F8E9',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#558B2F',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    paddingHorizontal: 14,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8F0E1',
  },
  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: 11,
    color: '#6B7B5E',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#2D3A1F',
    fontWeight: '600',
    marginTop: 1,
    lineHeight: 18,
  },
  // Services
  servicesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 12,
  },
  serviceTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F1F8E9',
    borderWidth: 1,
    borderColor: '#E8F0E1',
    borderRadius: 8,
  },
  serviceTagTxt: {
    fontSize: 12,
    color: '#558B2F',
    fontWeight: '600',
  },
  // Timings
  timingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
  },
  timingItem: {
    width: '47%',
    backgroundColor: '#F1F8E9',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E8F0E1',
  },
  timingClosed: {
    backgroundColor: '#F9F9F9',
    borderColor: '#EFEFEF',
  },
  timingDay: {
    fontSize: 11,
    color: '#6B7B5E',
    fontWeight: '600',
  },
  timingHours: {
    fontSize: 12,
    color: '#2D3A1F',
    fontWeight: '700',
    marginTop: 2,
  },
  timingClosedTxt: {
    color: '#BBBBBB',
  },
  // Fee Callout Card
  feeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8F0E1',
    padding: 14,
  },
  feeLabel: {
    fontSize: 11,
    color: '#6B7B5E',
    fontWeight: '500',
  },
  feeVal: {
    fontSize: 14,
    color: '#2D3A1F',
    fontWeight: '800',
    marginTop: 1,
  },
  bookSmall: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#558B2F',
    borderRadius: 10,
  },
  bookSmallTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Bottom Bar
  bookBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8F0E1',
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    paddingBottom: 28,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    // Android shadow
    elevation: 8,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#558B2F',
    backgroundColor: '#F1F8E9',
  },
  callTxt: {
    color: '#558B2F',
    fontSize: 14,
    fontWeight: '700',
  },
  bookBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#558B2F',
  },
  bookTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
