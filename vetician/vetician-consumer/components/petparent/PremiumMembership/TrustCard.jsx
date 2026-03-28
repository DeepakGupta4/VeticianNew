import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS2 } from './colors';

const trustPoints = [
  { icon: 'shield-check',   label: 'Verified Professionals' },
  { icon: 'account-heart',  label: 'Trusted by Pet Parents' },
  { icon: 'lock-check',     label: 'Secure Payments' },
  { icon: 'star-check',     label: 'Quality Assurance' },
];

export default function TrustCard() {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="trophy-award" size={20} color={COLORS2.primary} />
        <Text style={styles.title}>Why choose Vetician Premium?</Text>
      </View>
      <View style={styles.grid}>
        {trustPoints.map((t, i) => (
          <View key={i} style={styles.item}>
            <MaterialCommunityIcons name={t.icon} size={20} color={COLORS2.primary} />
            <Text style={styles.label}>{t.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    marginHorizontal: 16,
    marginTop: 28,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS2.border,
    elevation: 2,
    shadowColor: COLORS2.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS2.text,
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS2.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  label: {
    fontSize: 13,
    color: COLORS2.text,
    fontWeight: '600',
  },
});
