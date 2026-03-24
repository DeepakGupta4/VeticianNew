// vaccination/components/UpcomingVaccines.jsx
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS2 as COLORS } from '../../../constant/theme';

/**
 * UpcomingVaccines
 * Props:
 *   vaccines   – UpcomingVaccine[]
 *   onSchedule – (vaccine) => void   opens the schedule modal
 */
export default function UpcomingVaccines({ vaccines = [], onSchedule }) {
  if (!vaccines.length) return null;

  return (
    <View style={styles.section}>
      {/* Section heading */}
      <View style={styles.labelRow}>
        <MaterialIcons name="pending-actions" size={15} color={COLORS.primary} />
        <Text style={styles.label}>Upcoming Vaccinations</Text>
      </View>

      {vaccines.map((v) => (
        <VaccineRow key={v.id} vaccine={v} onSchedule={onSchedule} />
      ))}
    </View>
  );
}

function VaccineRow({ vaccine, onSchedule }) {
  const isScheduled = !!vaccine.scheduledTime;

  return (
    <View style={styles.card}>
      {/* Left: icon column */}
      <View style={styles.iconWrap}>
        <MaterialIcons
          name={isScheduled ? 'event-available' : 'vaccines'}
          size={24}
          color={isScheduled ? COLORS.primary : COLORS.secondary}
        />
      </View>

      {/* Centre: text */}
      <View style={styles.info}>
        <Text style={styles.name}>{vaccine.name}</Text>

        {isScheduled ? (
          <View style={styles.scheduledRow}>
            <MaterialIcons name="schedule" size={12} color={COLORS.primary} />
            <Text style={styles.scheduledText}>{vaccine.scheduledTime}</Text>
          </View>
        ) : (
          <View style={styles.dueRow}>
            <MaterialIcons name="event" size={12} color={COLORS.subtext} />
            <Text style={styles.dueText}>Due: {vaccine.due}</Text>
          </View>
        )}

        <View style={styles.petRow}>
          <MaterialIcons name="pets" size={11} color={COLORS.primary} />
          <Text style={styles.petText}>{vaccine.petName}</Text>
        </View>
      </View>

      {/* Right: action */}
      {isScheduled ? (
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={13} color={COLORS.primary} />
          <Text style={styles.badgeText}>Scheduled</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.scheduleBtn}
          onPress={() => onSchedule(vaccine)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Schedule ${vaccine.name}`}
        >
          <MaterialIcons name="calendar-today" size={13} color={COLORS.white} />
          <Text style={styles.scheduleBtnText}>Schedule</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
  },
  label: {
    fontSize:   13,
    fontWeight: '700',
    color:      COLORS.text,
  },
  card: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.card,
    borderRadius:    16,
    borderWidth:     1,
    borderColor:     COLORS.border,
    padding:         13,
    gap:             11,
    shadowColor:     COLORS.shadow,
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.2,
    shadowRadius:    5,
    elevation:       2,
  },
  iconWrap: {
    width:           44,
    height:          44,
    borderRadius:    12,
    backgroundColor: COLORS.accent,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  info: {
    flex: 1,
    gap:  3,
  },
  name: {
    fontSize:   13,
    fontWeight: '700',
    color:      COLORS.text,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  dueText: {
    fontSize: 11,
    color:    COLORS.subtext,
  },
  scheduledRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  scheduledText: {
    fontSize:   11,
    color:      COLORS.primary,
    fontWeight: '600',
  },
  petRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  petText: {
    fontSize:   11,
    color:      COLORS.primary,
    fontWeight: '600',
  },
  scheduleBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.primary,
    borderRadius:    10,
    paddingVertical:  7,
    paddingHorizontal: 11,
    gap:             4,
    flexShrink:      0,
  },
  scheduleBtnText: {
    fontSize:   11,
    fontWeight: '700',
    color:      COLORS.white,
  },
  badge: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.accent,
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     COLORS.border,
    paddingVertical:  6,
    paddingHorizontal: 9,
    gap:             4,
    flexShrink:      0,
  },
  badgeText: {
    fontSize:   10,
    fontWeight: '700',
    color:      COLORS.primary,
  },
});
