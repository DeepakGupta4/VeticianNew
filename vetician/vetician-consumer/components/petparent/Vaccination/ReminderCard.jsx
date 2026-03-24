// vaccination/components/ReminderCard.jsx
import React, { useRef, useEffect } from 'react';
import {
  View, Text, Animated, TouchableWithoutFeedback, StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 as COLORS } from '../../../constant/theme';

/**
 * ReminderCard
 * Props:
 *   enabled  – boolean
 *   onToggle – () => void
 */
export default function ReminderCard({ enabled, onToggle }) {
  // Animated value drives thumb position and track colour
  const anim = useRef(new Animated.Value(enabled ? 1 : 0)).current;

  // Sync animation whenever enabled prop changes
  useEffect(() => {
    Animated.timing(anim, {
      toValue:         enabled ? 1 : 0,
      duration:        220,
      useNativeDriver: false,
    }).start();
  }, [enabled]);

  const handleToggle = () => onToggle();

  const thumbX = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [2, 22],
  });
  const trackColor = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['#C8C8C8', COLORS.primary],
  });

  return (
    <View style={styles.card}>
      {/* Top row: text + toggle */}
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.titleRow}>
            <MaterialIcons name="notifications-active" size={18} color={COLORS.primary} />
            <Text style={styles.title}>Never Miss a Vaccination</Text>
          </View>

          <View style={styles.bulletRow}>
            <MaterialIcons name="check-circle-outline" size={13} color={COLORS.secondary} />
            <Text style={styles.bullet}>Smart reminders before due dates</Text>
          </View>
          <View style={styles.bulletRow}>
            <MaterialIcons name="check-circle-outline" size={13} color={COLORS.secondary} />
            <Text style={styles.bullet}>Push notifications via Vetician app</Text>
          </View>
        </View>

        <TouchableWithoutFeedback
          onPress={handleToggle}
          accessibilityRole="switch"
          accessibilityState={{ checked: enabled }}
          accessibilityLabel="Enable vaccination reminders"
        >
          <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
            <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbX }] }]} />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>

      {/* Active banner */}
      {enabled && (
        <View style={styles.activeBanner}>
          <MaterialIcons name="check-circle" size={14} color={COLORS.primary} />
          <Text style={styles.activeText}>
            Reminders active! You'll be notified 3 days before each due date.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.accent,
    borderRadius:    18,
    borderWidth:     1.5,
    borderColor:     COLORS.border,
    padding:         16,
    gap:             12,
  },
  row: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    justifyContent: 'space-between',
    gap:            12,
  },
  left: {
    flex: 1,
    gap:  5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
    marginBottom:  2,
  },
  title: {
    fontSize:   13,
    fontWeight: '700',
    color:      COLORS.text,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
  },
  bullet: {
    fontSize: 12,
    color:    COLORS.subtext,
  },
  // Animated toggle
  track: {
    width:           46,
    height:          26,
    borderRadius:    13,
    justifyContent:  'center',
    marginTop:       2,
    flexShrink:      0,
  },
  thumb: {
    width:           22,
    height:          22,
    borderRadius:    11,
    backgroundColor: COLORS.white,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.2,
    shadowRadius:    2,
    elevation:       2,
  },
  activeBanner: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             7,
    backgroundColor: COLORS.card,
    borderRadius:    10,
    paddingVertical:  9,
    paddingHorizontal: 12,
    borderWidth:     1,
    borderColor:     COLORS.border,
  },
  activeText: {
    flex:       1,
    fontSize:   12,
    color:      COLORS.primary,
    fontWeight: '600',
  },
});
