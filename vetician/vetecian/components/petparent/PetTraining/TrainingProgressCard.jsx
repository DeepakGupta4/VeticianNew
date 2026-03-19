// components/TrainingProgressCard.js
// Vatecian App — Progress tracking info card

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../../constant/theme';

const PROGRESS_ITEMS = [
  { icon: 'chart-line', text: 'Weekly progress reports from your trainer' },
  { icon: 'brain', text: 'Behavior improvement tracked every session' },
  { icon: 'message-text-outline', text: 'Direct feedback and tips from trainer' },
];

const TrainingProgressCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="progress-check" size={20} color={COLORS.textPrimary} />
        </View>
        <View>
          <Text style={styles.title}>Training Progress</Text>
          <Text style={styles.subtitle}>Transparent tracking, every step</Text>
        </View>
      </View>
      <View style={styles.divider} />
      {PROGRESS_ITEMS.map((item, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={item.icon} size={16} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.itemText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default TrainingProgressCard;
