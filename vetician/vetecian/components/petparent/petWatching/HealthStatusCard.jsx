// ─────────────────────────────────────────
//  components/HealthStatusCard.jsx
//
//  WHAT IT SHOWS:
//    • Horizontal scroll of health metric cards
//    • Each card: icon + label + value + status pill
//    • Metrics: Heart Rate, Temp, Water, Feeding, Activity
//
//  HOW TO USE:
//    <HealthStatusCard />
// ─────────────────────────────────────────

import React from 'react';
import {
  View, Text, ScrollView,
  StyleSheet
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../../constant/theme';

// ── Health data ──
// Replace values with real data from your API / state
const METRICS = [
  {
    icon:   'heart-pulse',
    label:  'Heart Rate',
    value:  '72 BPM',
    status: 'Normal',
    color:  'black',
    bg:     '#FFF0F0',
  },
  {
    icon:   'thermometer',
    label:  'Temperature',
    value:  '38.5 °C',
    status: 'Normal',
    color:  'black',
    bg:     '#FFF8F0',
  },
  {
    icon:   'water',
    label:  'Water Intake',
    value:  '320 ml',
    status: 'Good',
    color:  'black',
    bg:     '#F0F5FF',
  },
 
];

export default function HealthStatusCard() {
  return (
    <View style={styles.container}>

      {/* Section title */}
      <Text style={styles.sectionTitle}>Health Status</Text>

      {/* Horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollRow}
      >
        {METRICS.map((metric, index) => (
          <View
            key={index}
            style={[styles.card, { backgroundColor: 'white' }]}
          >
            {/* Icon circle */}
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name={metric.icon}
                size={20}
                color={metric.color}
              />
            </View>

            <Text style={styles.label}>{metric.label}</Text>
            <Text style={styles.value}>{metric.value}</Text>

            {/* Status pill */}
            <View style={[styles.statusPill, { borderColor: COLORS.primary }]}>
              <Text style={[styles.statusText, { color: COLORS.primary }]}>
                {metric.status}
              </Text>
            </View>

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

  scrollRow: { gap: 10, paddingBottom: 8 },

  card: {
    width: 118,
    borderRadius: RADIUS.md,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },

  iconCircle: {
    width: 38, height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },

  label: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },

  value: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2D10',
    marginTop: 3,
    marginBottom: 6,
  },

  statusPill: {
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
