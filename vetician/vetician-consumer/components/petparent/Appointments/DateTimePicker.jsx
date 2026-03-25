// components/appointments/DateTimePicker.js
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';
import { TIME_SLOTS } from './data';

const DAY_NAMES  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
];

/** Generates next 14 real dates starting today */
function generateDates() {
  const today = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      key:   i,
      day:   DAY_NAMES[d.getDay()],
      num:   d.getDate(),
      month: MONTH_NAMES[d.getMonth()],
      full:  `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}, ${d.getFullYear()}`,
    };
  });
}

/**
 * DateTimePicker
 * Props:
 *   selectedDate — full date string | null
 *   selectedTime — time slot string | null
 *   onDateChange — (full: string) => void
 *   onTimeChange — (slot: string) => void
 */
export default function DateTimePicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}) {
  const dates = useMemo(() => generateDates(), []);

  return (
    <View style={styles.section}>
      {/* ── Date strip ── */}
      <Text style={styles.label}>Select Date</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateRow}
      >
        {dates.map((item) => {
          const isSelected = selectedDate === item.full;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.dateCard, isSelected && styles.dateCardSelected]}
              onPress={() => onDateChange(item.full)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dayText,   isSelected && styles.selectedText]}>
                {item.day}
              </Text>
              <Text style={[styles.dateNum,   isSelected && styles.selectedText]}>
                {item.num}
              </Text>
              <Text style={[styles.monthText, isSelected && styles.selectedText]}>
                {item.month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Time slots ── */}
      <Text style={[styles.label, styles.labelSpaced]}>Select Time Slot</Text>
      <View style={styles.timeGrid}>
        {TIME_SLOTS.map((slot) => {
          const isSelected = selectedTime === slot;
          return (
            <TouchableOpacity
              key={slot}
              style={[styles.timeChip, isSelected && styles.timeChipSelected]}
              onPress={() => onTimeChange(slot)}
              activeOpacity={0.8}
            >
              <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
                {slot}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 22,
  },
  label: {
    fontSize:      13,
    fontWeight:    '600',
    color:         COLORS2.subtext,
    marginBottom:  12,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  labelSpaced: {
    marginTop: 20,
  },
  dateRow: {
    flexDirection: 'row',
    gap:           8,
    paddingBottom:  2,
  },
  dateCard: {
    alignItems:      'center',
    backgroundColor: COLORS2.card,
    borderRadius:    12,
    paddingVertical:   12,
    paddingHorizontal: 14,
    borderWidth:     1.5,
    borderColor:     COLORS2.border,
    minWidth:        56,
    gap:              2,
  },
  dateCardSelected: {
    backgroundColor: COLORS2.primary,
    borderColor:     COLORS2.primary,
  },
  dayText: {
    fontSize:   11,
    fontWeight: '600',
    color:      COLORS2.subtext,
  },
  dateNum: {
    fontSize:   18,
    fontWeight: '800',
    color:      COLORS2.text,
  },
  monthText: {
    fontSize:   10,
    color:      COLORS2.subtext,
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:            8,
  },
  timeChip: {
    paddingVertical:   9,
    paddingHorizontal: 16,
    borderRadius:      10,
    backgroundColor:   COLORS2.card,
    borderWidth:       1.5,
    borderColor:       COLORS2.border,
  },
  timeChipSelected: {
    backgroundColor: COLORS2.accent,
    borderColor:     COLORS2.primary,
  },
  timeText: {
    fontSize:   13,
    fontWeight: '600',
    color:      COLORS2.subtext,
  },
  timeTextSelected: {
    color: COLORS2.primary,
  },
});
