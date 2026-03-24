// components/appointments/AppointmentDetails.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

const STATUS_COLORS = {
  upcoming:  { color: COLORS2.primary, bg: COLORS2.accent },
  completed: { color: '#6B7B5E',       bg: '#F4F4F4'      },
  cancelled: { color: '#C62828',       bg: '#FFEBEE'      },
};

function DetailRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <MaterialIcons name={icon} size={15} color={COLORS2.primary} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

/**
 * AppointmentDetails
 * Full-screen modal (pageSheet) showing appointment detail.
 *
 * Props:
 *   visible     — boolean
 *   appointment — appointment object | null
 *   onClose     — () => void
 */
export default function AppointmentDetails({ visible, appointment, onClose }) {
  if (!appointment) return null;
  const sc = STATUS_COLORS[appointment.status] ?? STATUS_COLORS.upcoming;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Modal header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Appointment Details</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <MaterialIcons name="close" size={18} color={COLORS2.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero card */}
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <MaterialIcons
                name={appointment.serviceIcon}
                size={26}
                color={COLORS2.primary}
              />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroService}>{appointment.service}</Text>
              <Text style={styles.heroPet}>{appointment.petEmoji}  {appointment.pet}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
              <Text style={[styles.statusText, { color: sc.color }]}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Text>
            </View>
          </View>

          {/* Detail rows */}
          <View style={styles.detailsCard}>
            <DetailRow icon="calendar-today"  label="Date"         value={appointment.date}       />
            <View style={styles.sep} />
            <DetailRow icon="access-time"     label="Time"         value={appointment.time}       />
            <View style={styles.sep} />
            <DetailRow icon="location-on"     label="Clinic"       value={appointment.address}    />
            <View style={styles.sep} />
            <DetailRow icon="person"          label="Assigned To"  value={appointment.assignedTo} />
            {appointment.notes ? <View style={styles.sep} /> : null}
            <DetailRow icon="notes"           label="Notes"        value={appointment.notes}      />
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.doneBtnText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: COLORS2.bg,
  },
  handle: {
    width:           40,
    height:           4,
    borderRadius:     2,
    backgroundColor: COLORS2.border,
    alignSelf:       'center',
    marginTop:       12,
    marginBottom:     4,
  },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 20,
    paddingVertical:   16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS2.border,
    backgroundColor:   COLORS2.card,
  },
  headerTitle: {
    fontSize:   17,
    fontWeight: '700',
    color:      COLORS2.text,
  },
  closeBtn: {
    width:           34,
    height:          34,
    borderRadius:    10,
    backgroundColor: COLORS2.accent,
    alignItems:      'center',
    justifyContent:  'center',
  },
  content: {
    padding:       20,
    paddingBottom: 40,
  },
  heroCard: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS2.card,
    borderRadius:    16,
    padding:         16,
    marginBottom:    16,
    borderWidth:      1,
    borderColor:     COLORS2.border,
    gap:             12,
  },
  heroIcon: {
    width:           52,
    height:          52,
    borderRadius:    14,
    backgroundColor: COLORS2.accent,
    alignItems:      'center',
    justifyContent:  'center',
  },
  heroText: {
    flex: 1,
  },
  heroService: {
    fontSize:     16,
    fontWeight:   '700',
    color:        COLORS2.text,
    marginBottom:  4,
  },
  heroPet: {
    fontSize:   13,
    color:      COLORS2.subtext,
    fontWeight: '500',
  },
  statusBadge: {
    paddingVertical:   5,
    paddingHorizontal: 12,
    borderRadius:      20,
  },
  statusText: {
    fontSize:   11,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: COLORS2.card,
    borderRadius:    16,
    borderWidth:      1,
    borderColor:     COLORS2.border,
    marginBottom:    20,
    overflow:        'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    padding:       16,
    gap:           12,
  },
  rowIcon: {
    width:           32,
    height:          32,
    borderRadius:     9,
    backgroundColor: COLORS2.accent,
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:        1,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize:      11,
    fontWeight:    '600',
    color:         COLORS2.subtext,
    marginBottom:   3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  rowValue: {
    fontSize:   14,
    fontWeight: '500',
    color:      COLORS2.text,
    lineHeight: 20,
  },
  sep: {
    height:          1,
    backgroundColor: COLORS2.border,
    marginHorizontal: 16,
  },
  doneBtn: {
    backgroundColor: COLORS2.accent,
    borderRadius:    14,
    paddingVertical: 14,
    alignItems:      'center',
    borderWidth:      1,
    borderColor:     COLORS2.border,
  },
  doneBtnText: {
    fontSize:   15,
    fontWeight: '600',
    color:      COLORS2.primary,
  },
});
