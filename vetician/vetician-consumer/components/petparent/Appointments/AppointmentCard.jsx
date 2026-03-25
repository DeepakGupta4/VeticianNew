// components/appointments/AppointmentCard.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS2 } from './colors';

const STATUS_CONFIG = {
  upcoming: {
    label: 'Upcoming',
    color: COLORS2.primary,
    bg:    COLORS2.accent,
    icon:  'schedule',
  },
  completed: {
    label: 'Completed',
    color: '#6B7B5E',
    bg:    '#F4F4F4',
    icon:  'check-circle',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#C62828',
    bg:    '#FFEBEE',
    icon:  'cancel',
  },
};

/**
 * AppointmentCard
 * Props:
 *   appointment   — appointment object
 *   onViewDetails — (appointment) => void
 *   onCancelPress — (appointment) => void  — triggers confirm dialog in parent
 */
export default function AppointmentCard({ appointment, onViewDetails, onCancelPress }) {
  const { service, serviceIcon, pet, petIcon, date, time, status } = appointment;
  const sc = STATUS_CONFIG[status] ?? STATUS_CONFIG.upcoming;

  return (
    <View style={styles.card}>
      {/* ── Top row ── */}
      <View style={styles.topRow}>
        <View style={styles.serviceRow}>
          <View style={styles.iconWrap}>
            <MaterialIcons name={serviceIcon} size={18} color={COLORS2.primary} />
          </View>
          <View>
            <Text style={styles.serviceName}>{service}</Text>
            <Text style={styles.petLabel}>
              <MaterialCommunityIcons name={petIcon || 'paw'} size={13} color={COLORS2.subtext} />  {pet}
            </Text>
          </View>
        </View>

        {/* Status badge */}
        <View style={[styles.badge, { backgroundColor: sc.bg }]}>
          <MaterialIcons name={sc.icon} size={11} color={sc.color} />
          <Text style={[styles.badgeText, { color: sc.color }]}>{sc.label}</Text>
        </View>
      </View>

      {/* ── Date & time ── */}
      <View style={styles.dateRow}>
        <MaterialIcons name="calendar-today" size={13} color={COLORS2.subtext} />
        <Text style={styles.dateText}>{date}</Text>
        <View style={styles.dot} />
        <MaterialIcons name="access-time" size={13} color={COLORS2.subtext} />
        <Text style={styles.dateText}>{time}</Text>
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Actions ── */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => onViewDetails(appointment)}
          activeOpacity={0.8}
        >
          <Text style={styles.detailsBtnText}>View Details</Text>
        </TouchableOpacity>

        {status === 'upcoming' && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => onCancelPress(appointment)}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius:    16,
    padding:         16,
    marginBottom:    12,
    borderWidth:      1,
    borderColor:     COLORS2.border,
    shadowColor:     COLORS2.shadow,
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.5,
    shadowRadius:    8,
    elevation:       2,
  },
  topRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
    marginBottom:   12,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:            10,
    flex:           1,
  },
  iconWrap: {
    width:           40,
    height:          40,
    borderRadius:    12,
    backgroundColor: COLORS2.accent,
    alignItems:      'center',
    justifyContent:  'center',
  },
  serviceName: {
    fontSize:     15,
    fontWeight:   '700',
    color:        COLORS2.text,
    marginBottom:  2,
  },
  petLabel: {
    fontSize:   12,
    color:      COLORS2.subtext,
    fontWeight: '500',
  },
  badge: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:              4,
    paddingVertical:   5,
    paddingHorizontal: 10,
    borderRadius:    20,
  },
  badgeText: {
    fontSize:   11,
    fontWeight: '700',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:            5,
    marginBottom:  14,
  },
  dateText: {
    fontSize:   13,
    color:      COLORS2.subtext,
    fontWeight: '500',
  },
  dot: {
    width:           3,
    height:          3,
    borderRadius:    1.5,
    backgroundColor: COLORS2.shadow,
    marginHorizontal: 2,
  },
  divider: {
    height:          1,
    backgroundColor: COLORS2.border,
    marginBottom:    12,
  },
  actions: {
    flexDirection: 'row',
    gap:           10,
  },
  detailsBtn: {
    flex:            1,
    paddingVertical: 9,
    borderRadius:    10,
    backgroundColor: COLORS2.accent,
    alignItems:      'center',
    borderWidth:      1,
    borderColor:     COLORS2.border,
  },
  detailsBtnText: {
    fontSize:   13,
    fontWeight: '600',
    color:      COLORS2.primary,
  },
  cancelBtn: {
    paddingVertical:   9,
    paddingHorizontal: 20,
    borderRadius:      10,
    backgroundColor:   '#FFEBEE',
    alignItems:        'center',
  },
  cancelBtnText: {
    fontSize:   13,
    fontWeight: '600',
    color:      '#C62828',
  },
});
