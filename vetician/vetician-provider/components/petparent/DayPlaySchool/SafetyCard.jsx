import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FadeInCard from './FadeInCard';
import { COLORS2 } from '../../../constant/theme';

const DEFAULT_POINTS = [
  'Trained staff supervision at all times',
  'Secure, enclosed play areas',
  'Separate zones for small & large pets',
  'Regular cleaning and hygiene protocols',
];

export default function SafetyCard({ points = DEFAULT_POINTS, delay = 360 }) {
  return (
    <FadeInCard delay={delay} style={styles.card}>
      <View style={styles.heading}>
        <MaterialCommunityIcons name="shield-check" size={20} color={COLORS2.primary} />
        <Text style={styles.title}>Safe Environment</Text>
      </View>
      {points.map((item, i) => (
        <View key={i} style={styles.row}>
          <MaterialCommunityIcons name="check-circle" size={15} color={COLORS2.secondary} style={styles.checkIcon} />
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </FadeInCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS2.primary,
    shadowColor: COLORS2.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS2.text,
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  text: {
    fontSize: 12.5,
    color: COLORS2.subtext,
    flex: 1,
    lineHeight: 18,
  },
});
