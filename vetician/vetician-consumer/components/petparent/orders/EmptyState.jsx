import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

const EmptyState = ({ onExplore }) => (
  <View style={styles.container}>
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="package-variant-closed-remove" size={48} color={COLORS2.primary} />
      </View>
      <Text style={styles.title}>No orders yet</Text>
      <Text style={styles.subtitle}>
        You haven't made any bookings yet.{'\n'}Start exploring our services!
      </Text>
      <TouchableOpacity style={styles.btn} onPress={onExplore} activeOpacity={0.8}>
        <MaterialCommunityIcons name="compass-outline" size={18} color="#fff" />
        <Text style={styles.btnText}>Explore Services</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingTop: 48,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS2.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS2.border,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 28,
    ...Platform.select({
      ios: {
        shadowColor: '#2D3A1F',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.09,
        shadowRadius: 18,
      },
      android: { elevation: 5 },
    }),
  },
  iconWrap: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: COLORS2.accent,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS2.text,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS2.subtext,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS2.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default EmptyState;
