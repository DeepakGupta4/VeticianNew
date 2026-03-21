// ─────────────────────────────────────────
//  components/ActivityTimeline.jsx
//
//  WHAT IT SHOWS:
//    • Horizontal scroll row of activity cards
//    • Each card: emoji + activity name + time
//    • Colored left border per activity type
//
//  HOW TO USE:
//    <ActivityTimeline />
// ─────────────────────────────────────────

import React from 'react';
import {
  View, Text, ScrollView,
  StyleSheet
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../../constant/theme';

// ── Activity data ──
// You can replace this with props or API data
const ACTIVITIES = [
  { time: '10:30 AM', label: 'Playing in garden', icon: 'paw', color:'black' },
  { time: '11:00 AM', label: 'Feeding time', icon: 'food', color: 'black' },
  { time: '12:30 PM', label: 'Nap time', icon: 'sleep', color: 'black' },
];

export default function ActivityTimeline() {
  return (
    <View style={styles.container}>

      {/* Section title */}
      <Text style={styles.sectionTitle}>Pet Activity Timeline</Text>

      {/* Horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollRow}
      >
        {ACTIVITIES.map((item, index) => (
          <View
            key={index}
            style={[styles.card, { borderLeftColor: COLORS.primary
             }]}
          >
            <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        ))}
      </ScrollView>

    </View>
  );
}

// ─────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 22,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2D10',
    marginBottom: 12,
  },

  scrollRow: {
    gap: 10,
    paddingBottom: 8,
  },

  card: {
    width: 120,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 14,
    borderLeftWidth: 3,
    // shadow
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },



  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2D10',
    marginTop: 8,
    lineHeight: 16,
  },

  time: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
