import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';
import { INITIAL_DATA } from './rewardsData';

function EarnCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={item.icon} size={24} color={COLORS2.primary} />
      </View>
      <View style={styles.ptsRow}>
        <MaterialCommunityIcons name="plus-circle" size={12} color={COLORS2.secondary} />
        <Text style={styles.pts}>{item.points}</Text>
      </View>
      <Text style={styles.ptsLabel}>points</Text>
      <Text style={styles.cardLabel}>{item.label}</Text>
    </View>
  );
}

export default function EarnPointsCard() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="lightning-bolt" size={18} color={COLORS2.primary} />
          <Text style={styles.sectionTitle}>How to Earn Points</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{INITIAL_DATA.earnMethods.length} Ways</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {INITIAL_DATA.earnMethods.map((item) => (
          <EarnCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 15.5, fontWeight: '800', color: COLORS2.text },
  badge: {
    backgroundColor: COLORS2.accent, paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 10, borderWidth: 1, borderColor: COLORS2.border,
  },
  badgeText: { fontSize: 11, color: COLORS2.primary, fontWeight: '700' },
  scroll: { paddingRight: 4, gap: 10 },
  card: {
    backgroundColor: COLORS2.card, borderRadius: 18,
    paddingVertical: 18, paddingHorizontal: 16,
    alignItems: 'center', minWidth: 108,
    borderWidth: 1, borderColor: COLORS2.border,
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  iconBox: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: COLORS2.accent, borderWidth: 1.5, borderColor: COLORS2.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  ptsRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  pts: { fontSize: 22, fontWeight: '900', color: COLORS2.primary, lineHeight: 26 },
  ptsLabel: { fontSize: 10, color: COLORS2.subtext, fontWeight: '600', letterSpacing: 0.8, marginBottom: 6 },
  cardLabel: { fontSize: 11, color: COLORS2.text, fontWeight: '700', textAlign: 'center', lineHeight: 15 },
});
