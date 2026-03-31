import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';
import RewardCard from './RewardCard';
import EmptyState from './EmptyState';

export default function RewardsList({ rewards, points, onRedeem }) {
  const available = rewards.filter((r) => !r.redeemed).length;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="ticket-percent-outline" size={18} color={COLORS2.primary} />
          <Text style={styles.sectionTitle}>Available Rewards</Text>
        </View>
        <View style={styles.countBadge}>
          <MaterialCommunityIcons name="gift-outline" size={11} color={COLORS2.primary} />
          <Text style={styles.countText}>{available} Available</Text>
        </View>
      </View>

      {rewards.length === 0 ? (
        <EmptyState icon="gift-off-outline" title="No Rewards Yet" message="Complete bookings to unlock exclusive rewards." />
      ) : (
        rewards.map((reward) => (
          <RewardCard key={reward.id} reward={reward} userPoints={points} onRedeem={onRedeem} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 15.5, fontWeight: '800', color: COLORS2.text },
  countBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS2.accent, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10, borderWidth: 1, borderColor: COLORS2.border,
  },
  countText: { fontSize: 11, color: COLORS2.primary, fontWeight: '700' },
});
