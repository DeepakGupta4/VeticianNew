import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Clipboard, Alert } from 'react-native';
import { COLORS2 } from '../../../constant/theme';
import EmptyState from './EmptyState';

export default function MyRewards({ rewards }) {
  const handleCopy = (code) => {
    Clipboard.setString(code);
    Alert.alert('Copied!', `Code "${code}" copied to clipboard.`);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="ticket-outline" size={18} color={COLORS2.primary} />
          <Text style={styles.sectionTitle}>My Coupons</Text>
        </View>
        {rewards.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{rewards.length} Active</Text>
          </View>
        )}
      </View>

      {rewards.length === 0 ? (
        <EmptyState icon="ticket-outline" title="No Coupons Yet" message="Redeem your points to get discount coupons." />
      ) : (
        rewards.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* Left notch decoration */}
            <View style={styles.notchLeft} />
            <View style={styles.notchRight} />

            <View style={styles.leftSection}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="ticket-percent" size={22} color={COLORS2.primary} />
              </View>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.codeRow}>
                <MaterialCommunityIcons name="barcode" size={14} color={COLORS2.subtext} />
                <Text style={styles.code}>{item.code}</Text>
                <TouchableOpacity onPress={() => handleCopy(item.code)} style={styles.copyBtn} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="content-copy" size={13} color={COLORS2.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.expiryRow}>
                <MaterialCommunityIcons name="calendar-clock" size={12} color={COLORS2.subtext} />
                <Text style={styles.expiry}>Expires {item.expiry}</Text>
              </View>
            </View>

            <View style={[styles.statusBadge, item.status !== 'Active' && styles.statusExpired]}>
              <MaterialCommunityIcons
                name={item.status === 'Active' ? 'check-circle' : 'clock-alert-outline'}
                size={12}
                color={item.status === 'Active' ? COLORS2.primary : COLORS2.subtext}
              />
              <Text style={[styles.statusText, item.status !== 'Active' && styles.statusTextExpired]}>
                {item.status}
              </Text>
            </View>
          </View>
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
  badge: {
    backgroundColor: COLORS2.accent, paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 10, borderWidth: 1, borderColor: COLORS2.border,
  },
  badgeText: { fontSize: 11, color: COLORS2.primary, fontWeight: '700' },
  card: {
    backgroundColor: COLORS2.card, borderRadius: 16, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS2.border, overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  notchLeft: {
    position: 'absolute', left: 68, top: -10, width: 20, height: 20,
    borderRadius: 10, backgroundColor: COLORS2.bg, zIndex: 1,
  },
  notchRight: {
    position: 'absolute', left: 68, bottom: -10, width: 20, height: 20,
    borderRadius: 10, backgroundColor: COLORS2.bg, zIndex: 1,
  },
  leftSection: {
    width: 70, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS2.accent, paddingVertical: 18,
  },
  iconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: COLORS2.card, borderWidth: 1, borderColor: COLORS2.border,
    alignItems: 'center', justifyContent: 'center',
  },
  dashedDivider: {
    width: 1, height: '80%', borderWidth: 1,
    borderColor: COLORS2.border, borderStyle: 'dashed', marginHorizontal: 12,
  },
  info: { flex: 1, paddingVertical: 14 },
  title: { fontSize: 13, fontWeight: '800', color: COLORS2.text, marginBottom: 6 },
  codeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS2.accent, alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    borderWidth: 1, borderColor: COLORS2.border, marginBottom: 6,
  },
  code: { fontSize: 13, fontWeight: '900', color: COLORS2.primary, letterSpacing: 1.5 },
  copyBtn: { padding: 2 },
  expiryRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expiry: { fontSize: 11, color: COLORS2.subtext },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS2.accent, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 10, marginRight: 12, borderWidth: 1, borderColor: COLORS2.border,
  },
  statusExpired: { backgroundColor: '#F5F5F5', borderColor: '#E0E0E0' },
  statusText: { fontSize: 10.5, fontWeight: '700', color: COLORS2.primary },
  statusTextExpired: { color: COLORS2.subtext },
});
