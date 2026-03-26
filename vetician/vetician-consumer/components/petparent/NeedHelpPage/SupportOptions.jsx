// components/needhelp/SupportOptions.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

const OPTIONS = [
  { id: 'call', icon: 'phone', label: 'Call Us', value: '1800-123-4567', color: COLORS2.primary, action: () => Linking.openURL('tel:+18001234567') },
  { id: 'chat', icon: 'chat', label: 'Live Chat', value: 'Available 24/7', color: COLORS2.secondary, action: null },
  { id: 'email', icon: 'email', label: 'Email Us', value: 'help@vetician.com', color: COLORS2.secondary, action: () => Linking.openURL('mailto:help@vetician.com') },
];

export default function SupportOptions({ onOpenDrawer }) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Live Support</Text>
        <View style={styles.dot} />
        <Text style={styles.sectionSub}>Talk to our team</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.cardHeaderText}>Support team is online</Text>
        </View>
        <Text style={styles.cardSubtext}>Average response time: under 2 minutes</Text>
        <View style={styles.optionsRow}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={styles.optionBtn}
              activeOpacity={0.8}
              onPress={() => opt.action ? opt.action() : onOpenDrawer('chat')}
            >
              <View style={[styles.optionIcon, { backgroundColor: opt.color + '18' }]}>
                <MaterialIcons name={opt.icon} size={20} color={opt.color} />
              </View>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Text style={styles.optionValue}>{opt.value}</Text>
            </TouchableOpacity>
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
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS2.text,
    letterSpacing: -0.2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS2.secondary,
    marginHorizontal: 8,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS2.subtext,
  },
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS2.border,
    shadowColor: COLORS2.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#43A047',
    marginRight: 8,
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS2.text,
  },
  cardSubtext: {
    fontSize: 12,
    color: COLORS2.subtext,
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  optionBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS2.accent,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS2.text,
  },
  optionValue: {
    fontSize: 10,
    color: COLORS2.subtext,
    marginTop: 2,
    textAlign: 'center',
  },
});
