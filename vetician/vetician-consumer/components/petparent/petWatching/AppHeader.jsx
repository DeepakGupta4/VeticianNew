// ─────────────────────────────────────────
//  components/AppHeader.jsx
//
//  WHAT IT SHOWS:
//    • Green gradient top bar (menu icon, title, bell, avatar)
//    • Floating pet profile card with name, breed, status
//
//  HOW TO USE:
//    <AppHeader onMenuPress={() => setDrawerOpen(true)} />
// ─────────────────────────────────────────

import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, Easing
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS } from '../../../constant/theme';

// ── Pet data (swap with your real data / props) ──
const PET = {
  name:   'Max',
  breed:  'Golden Retriever',
  age:    '3 yrs',
  status: '🏃 Playing',
  location:'Pet Resort – Room Camera 2',
};

export default function AppHeader({ onMenuPress }) {
  const router = useRouter();

  // Floating animation for the pet card
  const floatY = useSharedValue(0);
  React.useEffect(() => {
    floatY.value = withRepeat(
      withTiming(-7, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      {/* ── Top row ── */}
      <View style={styles.topRow}>

        {/* Menu / Hamburger */}
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.appName}>Vetician</Text>
          <Text style={styles.pageTitle}>Pet Watching</Text>
        </View>

        {/* Bell + Avatar */}
        <View style={styles.rightRow}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons name="bell-outline" size={20} color="#fff" />
            <View style={styles.badgeDot} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Image style={{height:'100%', width:'100%', borderRadius:20,}} source={{uri:"https://images.unsplash.com/photo-1768878071978-8ace0a79958a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGRvZyUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"}}/>
          </View>
        </View>

      </View>

      {/* ── Floating pet card ── */}
      {/* <Animated.View style={[styles.petCard, floatStyle]}> */}

        {/* Pet avatar */}
        {/* <View style={styles.petAvatar}>
         <Image style={{height:'100%', width:'100%', borderRadius:30,}} source={{uri:"https://images.unsplash.com/photo-1768878071978-8ace0a79958a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGRvZyUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"}}/>
        </View> */}

        {/* Pet info */}
        {/* <View style={styles.petInfo}>
          <Text style={styles.petName}>{PET.name}</Text>
          <Text style={styles.petBreed}>{PET.breed} · {PET.age}</Text>
          <Text style={styles.petLocation}>📍 {PET.location}</Text>
        </View> */}

        {/* Status badge */}
        {/* <View style={styles.statusBadge}>
          <Text style={{ fontSize: 18 }}>🏃</Text>
          <Text style={styles.statusText}>Playing</Text>
        </View>

      </Animated.View> */}
    </LinearGradient>
  );
}

// ─────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 26,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  // top nav row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40, height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute', top: 7, right: 7,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#FF5252',
    borderWidth: 1.5, borderColor: '#fff',
  },
  titleBlock: { alignItems: 'center' },
  appName:   { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' },
  pageTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },

  rightRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.primaryPale,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center', justifyContent: 'center',
  },

  // pet card
  petCard: {
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  petAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.primaryPale,
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center', justifyContent: 'center',
  },
  petInfo: { flex: 1 },
  petName:     { color: '#fff', fontSize: 15, fontWeight: '800' },
  petBreed:    { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1 },
  petLocation: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 3 },

  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 12, padding: 10,
    alignItems: 'center',
  },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700', marginTop: 2 },
});
