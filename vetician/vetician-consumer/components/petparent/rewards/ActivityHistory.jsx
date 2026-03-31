import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';
import EmptyState from './EmptyState';

export default function ActivityHistory({ history }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="history" size={18} color={COLORS2.primary} />
          <Text style={styles.sectionTitle}>Activity History</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{history.length} entries</Text>
        </View>
      </View>

      {history.length === 0 ? (
        <EmptyState icon="history" title="No Activity Yet" message="Your points history will appear here." />
      ) : (
        <View style={styles.card}>
          {history.map((item, index) => (
            <View key={item.id}>
              <View style={styles.row}>
                <View style={[styles.dot, { backgroundColor: item.points > 0 ? COLORS2.primary : COLORS2.shadow }]}>
                  <MaterialCommunityIcons
                    name={item.points > 0 ? 'arrow-up' : 'arrow-down'}
                    size={12} color="#fff"
                  />
                </View>
                {index < history.length - 1 && <View style={styles.timeline} />}
                <View style={styles.info}>
                  <Text style={styles.label}>{item.label}</Text>
                  <View style={styles.dateRow}>
                    <MaterialCommunityIcons name="calendar-outline" size={11} color={COLORS2.subtext} />
                    <Text style={styles.date}>{item.date}</Text>
                  </View>
                </View>
                <View style={[styles.ptsBadge, item.points < 0 && styles.ptsBadgeMinus]}>
                  <Text style={[styles.pts, item.points < 0 && styles.ptsMinus]}>
                    {item.points > 0 ? `+${item.points}` : item.points}
                  </Text>
                  <Text style={[styles.ptsLabel, item.points < 0 && styles.ptsMinus]}>pts</Text>
                </View>
              </View>
              {index < history.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      )}
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
  card: {
    backgroundColor: COLORS2.card, borderRadius: 18,
    borderWidth: 1, borderColor: COLORS2.border, paddingHorizontal: 14,
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  dot: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  timeline: {
    position: 'absolute', left: 14, top: 44, width: 2,
    height: 20, backgroundColor: COLORS2.border,
  },
  info: { flex: 1 },
  label: { fontSize: 12.5, fontWeight: '600', color: COLORS2.text, marginBottom: 3 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date: { fontSize: 11, color: COLORS2.subtext },
  ptsBadge: {
    backgroundColor: COLORS2.accent, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: COLORS2.border,
    alignItems: 'center',
  },
  ptsBadgeMinus: { backgroundColor: '#F5F5F5', borderColor: '#E0E0E0' },
  pts: { fontSize: 13, fontWeight: '900', color: COLORS2.primary },
  ptsMinus: { color: COLORS2.subtext },
  ptsLabel: { fontSize: 9, color: COLORS2.primary, fontWeight: '600', letterSpacing: 0.5 },
  separator: { height: 1, backgroundColor: COLORS2.border, marginHorizontal: 4 },
});
