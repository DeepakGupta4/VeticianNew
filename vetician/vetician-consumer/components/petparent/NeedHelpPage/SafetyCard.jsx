// components/needhelp/SafetyCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

const FEATURES = [
  { icon: 'verified', label: 'Verified Professionals', desc: 'All vets are licensed' },
  { icon: 'lock', label: 'Secure Services', desc: 'Your data is protected' },
  { icon: 'schedule', label: '24/7 Support', desc: 'Always here for you' },
];

export default function SafetyCard() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.pawIcon}>
            <MaterialIcons name="pets" size={22} color={COLORS2.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.cardTitle}>Your Pet's Safety is Our Priority</Text>
            <Text style={styles.cardSub}>Committed to the best care experience</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.featuresRow}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialIcons name={f.icon} size={16} color={COLORS2.primary} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: COLORS2.accent,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  pawIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS2.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS2.text,
    lineHeight: 20,
  },
  cardSub: {
    fontSize: 12,
    color: COLORS2.subtext,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS2.border,
    marginBottom: 14,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS2.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS2.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS2.text,
    textAlign: 'center',
    lineHeight: 14,
  },
  featureDesc: {
    fontSize: 10,
    color: COLORS2.subtext,
    textAlign: 'center',
    marginTop: 3,
  },
});
