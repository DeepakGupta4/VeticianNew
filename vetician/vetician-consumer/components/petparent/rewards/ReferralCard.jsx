import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Share, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS2 } from '../../../constant/theme';

const REFERRAL_CODE = 'VETICIAN300';

export default function ReferralCard() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleShare = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    try {
      await Share.share({
        message: `Join Vetician — the best pet care app!\nUse my referral code ${REFERRAL_CODE} and get 200 bonus points.\nDownload now: https://vetician.app`,
      });
    } catch {
      Alert.alert('Error', 'Could not open share menu.');
    }
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient colors={['#3D7A18', '#558B2F', '#7CB342']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.iconRing}>
            <MaterialCommunityIcons name="account-multiple-plus" size={24} color="#fff" />
          </View>
          <View style={styles.earnBadge}>
            <MaterialCommunityIcons name="star-four-points" size={12} color={COLORS2.primary} />
            <Text style={styles.earnBadgeText}>+300 pts per referral</Text>
          </View>
        </View>

        <Text style={styles.title}>Invite Friends & Earn Rewards</Text>
        <Text style={styles.desc}>Share your code with friends. You earn 300 pts when they complete their first booking!</Text>

        {/* Code box */}
        <View style={styles.codeBox}>
          <View style={styles.codeLeft}>
            <MaterialCommunityIcons name="barcode" size={16} color="rgba(255,255,255,0.7)" />
            <Text style={styles.codeLabel}>Your Code</Text>
          </View>
          <View style={styles.codePill}>
            <Text style={styles.code}>{REFERRAL_CODE}</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="account-check-outline" size={16} color="rgba(255,255,255,0.85)" />
            <Text style={styles.statText}>0 Referred</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="star-circle-outline" size={16} color="rgba(255,255,255,0.85)" />
            <Text style={styles.statText}>0 pts earned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="gift-outline" size={16} color="rgba(255,255,255,0.85)" />
            <Text style={styles.statText}>No limit</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <MaterialCommunityIcons name="share-variant" size={17} color={COLORS2.primary} />
          <Text style={styles.shareBtnText}>Share Referral Link</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
    ...Platform.select({
      ios:     { shadowColor: COLORS2.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16 },
      android: { elevation: 8 },
    }),
  },
  card: { borderRadius: 22, padding: 20, overflow: 'hidden' },
  circle1: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.07)', top: -40, right: -30 },
  circle2: { position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, left: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  iconRing: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  earnBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  earnBadgeText: { fontSize: 11, fontWeight: '800', color: COLORS2.primary },
  title: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 6, letterSpacing: -0.2 },
  desc: { fontSize: 12.5, color: 'rgba(255,255,255,0.75)', lineHeight: 18, marginBottom: 16 },
  codeBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  codeLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  codeLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  codePill: {
    backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  code: { fontSize: 15, fontWeight: '900', color: COLORS2.primary, letterSpacing: 2 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12,
    paddingVertical: 10, marginBottom: 16,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.2)' },
  statText: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  shareBtn: {
    backgroundColor: '#fff', borderRadius: 14,
    paddingVertical: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  shareBtnText: { color: COLORS2.primary, fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },
});
