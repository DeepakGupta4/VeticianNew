import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

const EmptyState = ({ onExplore }) => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      <MaterialCommunityIcons name="shopping-outline" size={48} color={COLORS2.primary} />
    </View>
    <Text style={styles.title}>No Orders Yet</Text>
    <Text style={styles.subtitle}>Book a service for your pet and your orders will appear here.</Text>
    <TouchableOpacity style={styles.btn} onPress={onExplore} activeOpacity={0.8}>
      <Text style={styles.btnText}>Explore Services</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS2.accent,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: '800', color: COLORS2.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS2.subtext, textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  btn: {
    backgroundColor: COLORS2.primary,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
  },
  btnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

export default EmptyState;
