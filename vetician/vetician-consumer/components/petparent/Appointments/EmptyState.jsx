// components/appointments/EmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

/**
 * EmptyState
 * Shown inside My Appointments when there are no appointments.
 * No props required.
 */
export default function EmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <MaterialIcons name="event-busy" size={48} color={COLORS2.shadow} />
      </View>
      <Text style={styles.title}>No Appointments Yet</Text>
      <Text style={styles.subtitle}>
        Your upcoming and past appointments{'\n'}will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical:  80,
    paddingHorizontal: 40,
  },
  iconWrap: {
    width:           90,
    height:          90,
    borderRadius:    28,
    backgroundColor: COLORS2.accent,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    20,
  },
  title: {
    fontSize:     17,
    fontWeight:   '700',
    color:        COLORS2.text,
    marginBottom:  8,
  },
  subtitle: {
    fontSize:  14,
    color:     COLORS2.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
});
