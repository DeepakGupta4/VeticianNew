import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FadeInCard from './FadeInCard';
import { COLORS2 } from '../../../constant/theme';

export default function CaretakerCard({
  name       = 'Anita Sharma',
  experience = '5 years · Pet Daycare Specialist',
  note       = 'Passionate about creating a safe, stimulating environment where every pet feels loved.',
  delay      = 320,
}) {
  return (
    <FadeInCard delay={delay} style={styles.card}>
      <View style={styles.avatarWrap}>
        <MaterialCommunityIcons name="account-tie" size={28} color={COLORS2.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.experience}>{experience}</Text>
        <Text style={styles.note}>{note}</Text>
      </View>
    </FadeInCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS2.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS2.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
    flexShrink: 0,
  },
  info: { flex: 1 },
  name: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 2,
  },
  experience: {
    fontSize: 12,
    color: COLORS2.primary,
    fontWeight: '600',
    marginBottom: 5,
  },
  note: {
    fontSize: 12,
    color: COLORS2.subtext,
    lineHeight: 17,
  },
});
