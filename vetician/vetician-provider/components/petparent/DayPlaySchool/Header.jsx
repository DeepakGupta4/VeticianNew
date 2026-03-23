// components/Header.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS2 } from '../../../constant/theme';

/**
 * Header — top navigation bar for the Day / Play School screen.
 *
 * Props:
 *   onMenuPress    {function} — called when the menu/back icon is pressed
 *   onProfilePress {function} — called when the profile icon is pressed
 */
export default function Header({ onProfilePress }) {
  const router = useRouter();
  return (
    <LinearGradient colors={[COLORS2.primary, COLORS2.secondary]} style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS2.primary} />

      <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Day / Play School</Text>

      <TouchableOpacity onPress={onProfilePress} style={styles.iconBtn} activeOpacity={0.7}>
        <Ionicons name="person-circle-outline" size={27} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 54 : 36,
    paddingBottom: 16,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  iconBtn: {
    padding: 4,
  },
});
