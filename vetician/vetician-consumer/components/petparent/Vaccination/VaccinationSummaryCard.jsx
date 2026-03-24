// vaccination/components/VaccinationSummaryCard.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS2 as COLORS } from '../../../constant/theme';

/**
 * VaccinationSummaryCard
 * Props:
 *   completed – number
 *   pending   – number
 *   nextDue   – string   e.g. "25 Mar 2025" or scheduled timestamp
 */
export default function VaccinationSummaryCard({ completed = 0, pending = 0, nextDue = '—' }) {
  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Title row */}
      <View style={styles.titleRow}>
        <MaterialIcons name="health-and-safety" size={18} color="rgba(255,255,255,0.9)" />
        <Text style={styles.title}>Vaccination Status</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {/* Completed */}
        <View style={styles.statItem}>
          <View style={[styles.iconCircle, styles.iconCircleCompleted]}>
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
          </View>
          <Text style={styles.statNum}>{completed}</Text>
          <Text style={styles.statLbl}>Completed</Text>
        </View>

        <View style={styles.divider} />

        {/* Pending */}
        <View style={styles.statItem}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,209,128,0.25)' }]}>
            <MaterialIcons name="pending" size={18} color="#FFD180" />
          </View>
          <Text style={[styles.statNum, styles.orangeNum]}>{pending}</Text>
          <Text style={styles.statLbl}>Pending</Text>
        </View>

        <View style={styles.divider} />

        {/* Next due */}
        <View style={styles.statItem}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
            <MaterialIcons name="event" size={18} color="#fff" />
          </View>
          <Text style={styles.statDue} numberOfLines={2}>{nextDue}</Text>
          <Text style={styles.statLbl}>Next Due</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius:  18,
    padding:       18,
    gap:           14,
    // shadow
    shadowColor:   COLORS.primary,
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius:  10,
    elevation:     6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           7,
  },
  title: {
    fontSize:   15,
    fontWeight: '700',
    color:      '#fff',
  },
  statsRow: {
    flexDirection:  'row',
    justifyContent: 'space-around',
    alignItems:     'center',
  },
  statItem: {
    flex:       1,
    alignItems: 'center',
    gap:        5,
  },
  iconCircle: {
    width:           34,
    height:          34,
    borderRadius:    17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  iconCircleCompleted: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth:     1.5,
    borderColor:     'rgba(255,255,255,0.6)',
  },
  statNum: {
    fontSize:   26,
    fontWeight: '800',
    color:      '#fff',
    lineHeight: 30,
  },
  orangeNum: {
    color: '#FFD180',
  },
  statDue: {
    fontSize:   12,
    fontWeight: '700',
    color:      '#fff',
    textAlign:  'center',
    lineHeight: 16,
  },
  statLbl: {
    fontSize: 10,
    color:    'rgba(255,255,255,0.8)',
  },
  divider: {
    width:           1,
    height:          44,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
});
