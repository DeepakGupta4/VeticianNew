// components/appointments/AppointmentsList.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { COLORS2 } from './colors';
import AppointmentCard from './AppointmentCard';
import EmptyState      from './EmptyState';

export default function AppointmentsList({
  appointments,
  onViewDetails,
  onCancelPress,
  refreshing,
  onRefresh,
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
      refreshControl={
        <RefreshControl
          refreshing={refreshing || false}
          onRefresh={onRefresh}
          colors={[COLORS2.primary]}
          tintColor={COLORS2.primary}
        />
      }
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
