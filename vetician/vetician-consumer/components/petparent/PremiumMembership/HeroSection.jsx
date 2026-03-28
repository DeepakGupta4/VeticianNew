import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS2 } from './colors';

const highlights = [
  { icon: 'calendar-clock',    label: 'Priority Appointments' },
  { icon: 'content-cut',       label: 'Discounts on Grooming & Training' },
  { icon: 'heart-pulse',       label: 'Free Monthly Health Checkups' },
  { icon: 'headset',           label: '24/7 Premium Support' },
];

export default function HeroSection() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) });
    translateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <LinearGradient colors={[COLORS2.primary, COLORS2.text]} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {/* Decorative circles */}
        <View style={[styles.dec, { width: 140, height: 140, top: -40, right: -30, opacity: 0.1 }]} />
        <View style={[styles.dec, { width: 80, height: 80, bottom: 10, left: -20, opacity: 0.08 }]} />

        <View style={styles.badge}>
          <MaterialCommunityIcons name="crown" size={14} color={COLORS2.primary} />
          <Text style={styles.badgeText}>EXCLUSIVE MEMBERSHIP</Text>
        </View>

        <Text style={styles.heroTitle}>Upgrade to{'\n'}Premium Care</Text>
        <Text style={styles.heroSubtitle}>
          Access exclusive services and priority support for your beloved pet
        </Text>

        <View style={styles.divider} />

        {highlights.map((item, i) => (
          <View key={i} style={styles.highlightRow}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name={item.icon} size={18} color={COLORS2.primary} />
            </View>
            <Text style={styles.highlightText}>{item.label}</Text>
          </View>
        ))}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 22,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS2.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  dec: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS2.primary,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 34,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 18,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});
