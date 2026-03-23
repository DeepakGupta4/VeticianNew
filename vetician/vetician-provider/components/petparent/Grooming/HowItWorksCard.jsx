import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS } from '../../../constant/theme2';

const HowItWorksCard = ({ step }) => (
  <View style={styles.card}>
    <View style={styles.circle}>
      <Text style={styles.number}>{step.number}</Text>
    </View>
    <View style={styles.content}>
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.desc}>{step.description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 12,
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginRight: 14,
  },
  number: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
  },
  content: { flex: 1 },
  title: {
    fontSize: FONT.howTitle,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
    lineHeight: 19,
  },
  desc: {
    fontSize: FONT.howDesc,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
});

export default HowItWorksCard;
