import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, Easing
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS } from '../../../constant/theme';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1768878071978-8ace0a79958a?w=400&auto=format&fit=crop&q=60';

// pet = { name, breed, age, photo/image, species }
// hostelName = string
export default function AppHeader({ pet, hostelName, onMenuPress }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const petName   = pet?.name    || 'Your Pet';
  const petBreed  = pet?.breed   || pet?.species || 'Pet';
  const petAge    = pet?.age     ? `${pet.age} yrs` : '';
  const petAvatar = pet?.photo   || pet?.image || pet?.profileImage || DEFAULT_AVATAR;
  const location  = hostelName   || 'Vetician Pet Resort';

  // Floating animation
  const floatY = useSharedValue(0);
  React.useEffect(() => {
    floatY.value = withRepeat(
      withTiming(-6, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top + 10 }]}
    >
      {/* Top Row */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.titleBlock}>
          <Text style={styles.appName}>Vetician</Text>
          <Text style={styles.pageTitle}>Pet Watching</Text>
        </View>

        <View style={styles.rightRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={onMenuPress}>
            <MaterialCommunityIcons name="bell-outline" size={20} color="#fff" />
            <View style={styles.badgeDot} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Image style={styles.avatarImg} source={{ uri: petAvatar }} />
          </View>
        </View>
      </View>

      {/* Floating Pet Card */}
      <Animated.View style={[styles.petCard, floatStyle]}>
        <View style={styles.petAvatar}>
          <Image style={styles.petAvatarImg} source={{ uri: petAvatar }} />
        </View>

        <View style={styles.petInfo}>
          <Text style={styles.petName}>{petName}</Text>
          <Text style={styles.petBreed}>
            {petBreed}{petAge ? ` · ${petAge}` : ''}
          </Text>
          <Text style={styles.petLocation}>📍 {location}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={{ fontSize: 18 }}>🏃</Text>
          <Text style={styles.statusText}>Active</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingBottom: 26,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
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
  rightRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.7)',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },

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
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
  },
  petAvatarImg: { width: '100%', height: '100%' },
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
