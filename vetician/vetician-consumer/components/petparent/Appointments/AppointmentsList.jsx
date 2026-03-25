// components/appointments/AppointmentsList.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS2 } from './colors';
import AppointmentCard from './AppointmentCard';
import EmptyState      from './EmptyState';

/**
 * AppointmentsList
 * Renders upcoming and past appointments in separate groups.
 * Delegates cancel confirmation to the parent via onCancelPress.
 *
 * Props:
 *   appointments   — appointment[]
 *   onViewDetails  — (appointment) => void
 *   onCancelPress  — (appointment) => void  ← opens CancelConfirmDialog in parent
 */
export default function AppointmentsList({
  appointments,
  onViewDetails,
  onCancelPress,
}) {
  if (appointments.length === 0) {
    return <EmptyState />;
  }

  const upcoming = appointments.filter((a) => a.status === 'upcoming');
  const past     = appointments.filter((a) => a.status !== 'upcoming');

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {upcoming.length > 0 && (
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Upcoming</Text>
          {upcoming.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onViewDetails={onViewDetails}
              onCancelPress={onCancelPress}
            />
          ))}
        </View>
      )}

      {past.length > 0 && (
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Past Appointments</Text>
          {past.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onViewDetails={onViewDetails}
              onCancelPress={onCancelPress}
            />
          ))}
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  group: {
    marginBottom: 8,
  },
  groupLabel: {
    fontSize:      13,
    fontWeight:    '700',
    color:         COLORS2.subtext,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom:  12,
  },
  bottomSpacer: {
    height: 30,
  },
});
