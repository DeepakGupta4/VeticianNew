import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

const Header = () => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      <MaterialCommunityIcons name="shopping-outline" size={22} color={COLORS2.primary} />
    </View>
    <View style={styles.textWrap}>
      <Text style={styles.title}>My Orders</Text>
      <Text style={styles.subtitle}>Track & manage your bookings</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 12,
    paddingBottom: 14,
    backgroundColor: COLORS2.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS2.border,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS2.accent,
    borderWidth: 1,
    borderColor: COLORS2.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS2.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 12, color: COLORS2.subtext, marginTop: 1 },
});

export default Header;
