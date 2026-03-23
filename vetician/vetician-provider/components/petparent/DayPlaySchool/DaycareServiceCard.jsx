import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FadeInCard from './FadeInCard';
import { COLORS2 } from '../../../constant/theme';

export default function DaycareServiceCard({ icon, label, desc, delay = 0 }) {
  return (
    <FadeInCard delay={delay} style={styles.card}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon} size={22} color={COLORS2.primary} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </FadeInCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS2.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: COLORS2.secondary,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS2.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  textWrap: { flex: 1 },
  label: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 3,
  },
  desc: {
    fontSize: 12,
    color: COLORS2.subtext,
    lineHeight: 17,
  },
});
