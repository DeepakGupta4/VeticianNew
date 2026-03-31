import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <View style={styles.topRow}>
        <View style={styles.iconRing}>
          <MaterialCommunityIcons name="gift" size={26} color="#fff" />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>Rewards & Benefits</Text>
          <Text style={styles.subtitle}>Earn points on every pet care service</Text>
        </View>
        <View style={styles.notifBtn}>
          <MaterialCommunityIcons name="bell-outline" size={20} color="#fff" />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="star-circle-outline" size={14} color="rgba(255,255,255,0.85)" />
          <Text style={styles.statText}>Earn on bookings</Text>
        </View>
        <View style={styles.statDot} />
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="ticket-percent-outline" size={14} color="rgba(255,255,255,0.85)" />
          <Text style={styles.statText}>Redeem for discounts</Text>
        </View>
        <View style={styles.statDot} />
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="account-multiple-plus-outline" size={14} color="rgba(255,255,255,0.85)" />
          <Text style={styles.statText}>Refer & earn</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS2.primary,
    paddingTop: Platform.OS === 'android' ? 16 : 12,
    paddingBottom: 22,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -40,
  },
  circle2: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -30, left: -20,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  iconRing: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  textBlock: { flex: 1 },
  title: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  notifBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, gap: 8,
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  statText: { fontSize: 10.5, color: 'rgba(255,255,255,0.88)', fontWeight: '600' },
  statDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.35)' },
});
