import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS2 } from '../../../constant/theme';

const NEXT_LEVEL_POINTS = { Bronze: 500, Silver: 1000, Gold: 2000 };

export default function RewardBalanceCard({ points }) {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 6, tension: 80 }).start();
  }, []);

  const level = points >= 1000 ? 'Gold' : points >= 500 ? 'Silver' : 'Bronze';
  const levelIcon = points >= 1000 ? 'trophy' : points >= 500 ? 'medal' : 'star-circle';
  const nextLevel = level === 'Gold' ? 'Gold' : level === 'Silver' ? 'Gold' : 'Silver';
  const nextTarget = NEXT_LEVEL_POINTS[level === 'Gold' ? 'Gold' : level === 'Silver' ? 'Gold' : 'Silver'];
  const prevTarget = level === 'Bronze' ? 0 : level === 'Silver' ? 500 : 1000;
  const progress = Math.min((points - prevTarget) / (nextTarget - prevTarget), 1);

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient
        colors={['#3D7A18', '#558B2F', '#7CB342']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.levelBadge}>
            <MaterialCommunityIcons name={levelIcon} size={13} color={COLORS2.primary} />
            <Text style={styles.levelText}>{level} Member</Text>
          </View>
          <MaterialCommunityIcons name="wallet-giftcard" size={26} color="rgba(255,255,255,0.7)" />
        </View>

        {/* Points */}
        <Text style={styles.label}>Your Reward Points</Text>
        <View style={styles.pointsRow}>
          <Text style={styles.points}>{points.toLocaleString('en-IN')}</Text>
          <Text style={styles.ptLabel}>PTS</Text>
        </View>

        {/* Progress to next level */}
        {level !== 'Gold' && (
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <MaterialCommunityIcons name="trending-up" size={12} color="rgba(255,255,255,0.75)" />
              <Text style={styles.progressLabel}>
                {nextTarget - points} pts to {nextLevel}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <View style={styles.infoChip}>
            <MaterialCommunityIcons name="shield-check-outline" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={styles.infoText}>Points valid for 12 months</Text>
          </View>
          <View style={styles.validChip}>
            <MaterialCommunityIcons name="clock-outline" size={11} color="#fff" />
            <Text style={styles.validText}>Active</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  card: {
    borderRadius: 22, padding: 22, overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: COLORS2.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16 },
      android: { elevation: 10 },
    }),
  },
  circle1: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.07)', top: -40, right: -30 },
  circle2: { position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, left: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  levelBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  levelText: { fontSize: 11, fontWeight: '800', color: COLORS2.primary },
  label: { fontSize: 11.5, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, marginBottom: 4 },
  pointsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 16 },
  points: { fontSize: 52, fontWeight: '900', color: '#fff', letterSpacing: -2, lineHeight: 56 },
  ptLabel: { fontSize: 14, color: 'rgba(255,255,255,0.65)', fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  progressSection: { marginBottom: 16 },
  progressLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  progressLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.18)', marginBottom: 14 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoChip: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoText: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  validChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  validText: { fontSize: 10.5, color: '#fff', fontWeight: '700' },
});
