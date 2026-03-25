// vaccination/components/EmptyState.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 as COLORS } from '../../../constant/theme';

/**
 * EmptyState
 * Props:
 *   title    – string   (optional override)
 *   subtitle – string   (optional override)
 */
export default function EmptyState({
  title    = 'No vaccination records found',
  subtitle = 'Book your first vaccination appointment to get started',
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MaterialIcons name="vaccines" size={40} color={COLORS.secondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
    gap: 10,
  },
  iconCircle: {
    width:           80,
    height:          80,
    borderRadius:    40,
    backgroundColor: COLORS.accent,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1.5,
    borderColor:     COLORS.border,
    marginBottom:    4,
  },
  title: {
    fontSize:   16,
    fontWeight: '700',
    color:      COLORS.text,
    textAlign:  'center',
  },
  subtitle: {
    fontSize:  13,
    color:     COLORS.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
});
