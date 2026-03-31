import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

export default function Header({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} style={styles.navBtn} activeOpacity={0.75}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.navBtn} activeOpacity={0.75}>
          <MaterialCommunityIcons name="bell-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.heroContent}>
        <View style={styles.iconRing}>
          <MaterialCommunityIcons name="account-group" size={28} color="#fff" />
        </View>
        <Text style={styles.title}>Pet Community</Text>
        <Text style={styles.subtitle}>Connect · Share · Learn with pet lovers</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="account-multiple" size={13} color="rgba(255,255,255,0.85)" />
            <Text style={styles.statText}>71k+ Members</Text>
          </View>
          <View style={styles.statDot} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="forum-outline" size={13} color="rgba(255,255,255,0.85)" />
            <Text style={styles.statText}>6 Communities</Text>
          </View>
          <View style={styles.statDot} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="leaf" size={13} color="rgba(255,255,255,0.85)" />
            <Text style={styles.statText}>Active Daily</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS2.primary,
    paddingTop: Platform.OS === 'android' ? 16 : 12,
    paddingBottom: 24,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -40,
  },
  circle2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)', bottom: -30, left: -20,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  navBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  spacer: { flex: 1 },
  heroContent: { alignItems: 'center' },
  iconRing: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.3, marginBottom: 4 },
  subtitle: { fontSize: 12.5, color: 'rgba(255,255,255,0.75)', marginBottom: 16, letterSpacing: 0.2 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, gap: 8,
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 11.5, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  statDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.4)' },
});
