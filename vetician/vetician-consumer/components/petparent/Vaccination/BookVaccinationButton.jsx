// vaccination/components/BookVaccinationButton.jsx
import React, { useRef } from 'react';
import {
  TouchableOpacity, Text, View, Animated, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 as COLORS } from '../../../constant/theme';

/**
 * BookVaccinationButton
 * Props:
 *   onPress – () => void
 */
export default function BookVaccinationButton({ onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel="Book vaccination appointment"
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.inner}>
            <View style={styles.iconWrap}>
              <MaterialIcons name="local-hospital" size={22} color={COLORS.white} />
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.mainText}>Book Vaccination</Text>
              <Text style={styles.subText}>Schedule an appointment now</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="rgba(255,255,255,0.8)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius:  16,
    overflow:      'hidden',
    shadowColor:   COLORS.primary,
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius:  10,
    elevation:     6,
  },
  gradient: {
    borderRadius: 16,
    paddingVertical:  14,
    paddingHorizontal: 18,
  },
  inner: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           14,
  },
  iconWrap: {
    width:           42,
    height:          42,
    borderRadius:    12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  textBlock: {
    flex: 1,
    gap:  2,
  },
  mainText: {
    fontSize:   16,
    fontWeight: '800',
    color:      COLORS.white,
    letterSpacing: 0.2,
  },
  subText: {
    fontSize: 12,
    color:    'rgba(255,255,255,0.85)',
  },
});
