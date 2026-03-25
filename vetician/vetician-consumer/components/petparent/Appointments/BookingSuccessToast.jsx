// components/appointments/BookingSuccessToast.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

const AUTO_DISMISS_MS = 5000;

/**
 * BookingSuccessToast
 * Slides in from the top when visible=true.
 * Auto-dismisses after 5 s unless user taps "View".
 *
 * Props:
 *   visible     — boolean
 *   service     — string  e.g. "Grooming"
 *   pet         — string  e.g. "Rocky"
 *   date        — string  e.g. "23 Mar, 2026"
 *   time        — string  e.g. "11:00 AM"
 *   onView      — () => void  — called when user taps "View"
 *   onDismiss   — () => void  — called when toast hides
 */
export default function BookingSuccessToast({
  visible,
  service,
  pet,
  date,
  time,
  onView,
  onDismiss,
}) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const timerRef   = useRef(null);

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue:         0,
          useNativeDriver: true,
          tension:         70,
          friction:        10,
        }),
        Animated.timing(opacity, {
          toValue:         1,
          duration:        200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(hide, AUTO_DISMISS_MS);
    } else {
      hide();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue:         -120,
        duration:        220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue:         0,
        duration:        180,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss && onDismiss());
  };

  const handleView = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    hide();
    onView && onView();
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        { transform: [{ translateY }], opacity },
      ]}
    >
      {/* Left icon */}
      <View style={styles.iconWrap}>
        <MaterialIcons name="check-circle" size={22} color={COLORS2.secondary} />
      </View>

      {/* Text block */}
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {service} booked for {pet}!
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {date}  ·  {time}
        </Text>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.viewBtn}
        onPress={handleView}
        activeOpacity={0.85}
      >
        <Text style={styles.viewBtnText}>View</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position:        'absolute',
    top:             16,
    left:            16,
    right:           16,
    zIndex:          999,
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS2.text,
    borderRadius:    16,
    padding:         14,
    gap:             12,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.18,
    shadowRadius:    12,
    elevation:       10,
  },
  iconWrap: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: 'rgba(124,179,66,0.15)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  textBlock: {
    flex: 1,
    gap:   2,
  },
  title: {
    fontSize:   13,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
  sub: {
    fontSize: 11,
    color:    COLORS2.shadow,
  },
  viewBtn: {
    backgroundColor: COLORS2.primary,
    borderRadius:    9,
    paddingVertical:   7,
    paddingHorizontal: 14,
  },
  viewBtnText: {
    fontSize:   12,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
});
