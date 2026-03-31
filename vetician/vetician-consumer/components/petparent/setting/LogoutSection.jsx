import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

const DANGER = '#C62828';
const DANGER_MID = '#E53935';
const DANGER_LIGHT = '#FFEBEE';
const DANGER_BORDER = '#FFCDD2';

function PressCard({ onPress, children, style }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(scale, { toValue: 0.965, useNativeDriver: true, speed: 60, bounciness: 0 }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1,     useNativeDriver: true, speed: 20, bounciness: 4 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={style}
        onPress={onPress}
        onPressIn={onIn}
        onPressOut={onOut}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function LogoutSection({ onLogout, onDeleteAccount }) {
  return (
    <View style={styles.wrapper}>

      {/* ── Logout Card ── */}
      <PressCard style={styles.logoutCard} onPress={onLogout}>
        <View style={styles.leftAccent} />
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="logout-variant" size={22} color={DANGER_MID} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.logoutTitle}>Log Out</Text>
          <Text style={styles.logoutSub}>Sign out of your Vetician account</Text>
        </View>
        <View style={styles.arrowWrap}>
          <MaterialCommunityIcons name="chevron-right" size={20} color={DANGER_MID} />
        </View>
      </PressCard>

      {/* ── Delete Account Card ── */}
      <PressCard style={styles.deleteCard} onPress={onDeleteAccount}>
        <View style={[styles.leftAccent, styles.leftAccentDelete]} />
        <View style={[styles.iconCircle, styles.iconCircleDelete]}>
          <MaterialCommunityIcons name="delete-forever-outline" size={22} color={DANGER} />
        </View>
        <View style={styles.textBlock}>
          <View style={styles.deleteTitleRow}>
            <Text style={styles.deleteTitle}>Delete Account</Text>
            <View style={styles.dangerBadge}>
              <MaterialCommunityIcons name="alert" size={9} color="#fff" />
              <Text style={styles.dangerBadgeText}>Irreversible</Text>
            </View>
          </View>
          <Text style={styles.deleteSub}>Permanently remove all your data</Text>
        </View>
        <View style={[styles.arrowWrap, styles.arrowWrapDelete]}>
          <MaterialCommunityIcons name="chevron-right" size={20} color={DANGER} />
        </View>
      </PressCard>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 12 },

  /* ── Logout ── */
  logoutCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS2.card,
    borderRadius: 18, overflow: 'hidden',
    borderWidth: 1.5, borderColor: DANGER_BORDER,
    ...Platform.select({
      ios:     { shadowColor: DANGER_MID, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  leftAccent: {
    width: 5, alignSelf: 'stretch',
    backgroundColor: DANGER_MID,
  },
  iconCircle: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: DANGER_LIGHT,
    borderWidth: 1, borderColor: DANGER_BORDER,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 14, marginVertical: 16,
  },
  textBlock: { flex: 1, marginLeft: 12 },
  logoutTitle: { fontSize: 15, fontWeight: '800', color: DANGER_MID, letterSpacing: 0.1 },
  logoutSub: { fontSize: 12, color: '#EF9A9A', marginTop: 2 },
  arrowWrap: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: DANGER_LIGHT,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },

  /* ── Delete ── */
  deleteCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: DANGER_LIGHT,
    borderRadius: 18, overflow: 'hidden',
    borderWidth: 1.5, borderColor: DANGER_BORDER,
    ...Platform.select({
      ios:     { shadowColor: DANGER, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  leftAccentDelete: { backgroundColor: DANGER },
  iconCircleDelete: {
    backgroundColor: '#fff',
    borderColor: DANGER_BORDER,
  },
  deleteTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 2 },
  deleteTitle: { fontSize: 15, fontWeight: '800', color: DANGER },
  dangerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: DANGER, borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  dangerBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  deleteSub: { fontSize: 12, color: '#E57373' },
  arrowWrapDelete: { backgroundColor: '#fff' },
});
