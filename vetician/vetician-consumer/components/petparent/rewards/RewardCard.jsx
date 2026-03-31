import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

export default function RewardCard({ reward, userPoints, onRedeem }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const canAfford = userPoints >= reward.pointsRequired;
  const isRedeemed = reward.redeemed;

  const handlePress = () => {
    if (isRedeemed) return;
    if (!canAfford) {
      Alert.alert('Insufficient Points', `You need ${reward.pointsRequired - userPoints} more points to redeem this.`, [{ text: 'OK' }]);
      return;
    }
    Alert.alert('Confirm Redemption', `Redeem "${reward.title}" for ${reward.pointsRequired} points?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Redeem',
        onPress: () => {
          Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
          ]).start(() => onRedeem(reward));
        },
      },
    ]);
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }, isRedeemed && styles.cardRedeemed]}>
      <View style={[styles.accentBar, isRedeemed && styles.accentBarRedeemed]} />

      <View style={[styles.iconBox, isRedeemed && styles.iconBoxRedeemed]}>
        <MaterialCommunityIcons name={reward.icon} size={24} color={isRedeemed ? COLORS2.subtext : COLORS2.primary} />
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, isRedeemed && styles.titleRedeemed]}>{reward.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>{reward.description}</Text>
        <View style={styles.ptsBadge}>
          <MaterialCommunityIcons name="star-four-points" size={11} color={COLORS2.primary} />
          <Text style={styles.ptsText}>{reward.pointsRequired} pts</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.redeemBtn, !canAfford && !isRedeemed && styles.redeemBtnDisabled, isRedeemed && styles.redeemBtnUsed]}
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={isRedeemed}
      >
        {isRedeemed ? (
          <>
            <MaterialCommunityIcons name="check-circle" size={14} color="#fff" />
            <Text style={styles.redeemBtnText}>Used</Text>
          </>
        ) : (
          <>
            <MaterialCommunityIcons name="gift-outline" size={14} color={canAfford ? '#fff' : COLORS2.subtext} />
            <Text style={[styles.redeemBtnText, !canAfford && styles.redeemBtnTextDisabled]}>Redeem</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card, borderRadius: 18, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingRight: 14,
    borderWidth: 1, borderColor: COLORS2.border, overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  cardRedeemed: { opacity: 0.7 },
  accentBar: { width: 4, alignSelf: 'stretch', backgroundColor: COLORS2.primary, marginRight: 14 },
  accentBarRedeemed: { backgroundColor: COLORS2.border },
  iconBox: {
    width: 50, height: 50, borderRadius: 15,
    backgroundColor: COLORS2.accent, borderWidth: 1.5, borderColor: COLORS2.border,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  iconBoxRedeemed: { backgroundColor: '#F5F5F5', borderColor: '#E0E0E0' },
  info: { flex: 1 },
  title: { fontSize: 13.5, fontWeight: '800', color: COLORS2.text, marginBottom: 3 },
  titleRedeemed: { color: COLORS2.subtext },
  desc: { fontSize: 11.5, color: COLORS2.subtext, marginBottom: 7, lineHeight: 16 },
  ptsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS2.accent, alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
    borderWidth: 1, borderColor: COLORS2.border,
  },
  ptsText: { fontSize: 10.5, color: COLORS2.primary, fontWeight: '700' },
  redeemBtn: {
    backgroundColor: COLORS2.primary, paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 8,
  },
  redeemBtnDisabled: { backgroundColor: COLORS2.accent, borderWidth: 1, borderColor: COLORS2.border },
  redeemBtnUsed: { backgroundColor: COLORS2.subtext },
  redeemBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  redeemBtnTextDisabled: { color: COLORS2.subtext },
});
