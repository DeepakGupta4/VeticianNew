// components/appointments/Header.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

/**
 * Header
 * Props:
 *   onBack — () => void  — called when back button is pressed
 */
export default function Header({ onBack }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <MaterialIcons name="arrow-back" size={20} color={COLORS2.text} />
      </TouchableOpacity>

      <Text style={styles.title}>Appointments</Text>

      {/* Spacer keeps title centred */}
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingTop:        16,
    paddingBottom:     16,
    paddingHorizontal: 20,
    backgroundColor:   COLORS2.primary,
    borderBottomWidth: 0,
  },
  backBtn: {
    width:           38,
    height:          38,
    borderRadius:    12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  title: {
    fontSize:      18,
    fontWeight:    '700',
    color:         '#FFFFFF',
    letterSpacing: 0.2,
  },
  spacer: {
    width: 38,
  },
});
