// vaccination/components/Header.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 as COLORS } from '../../../constant/theme';

/**
 * Header
 * Props:
 *   onBack  – () => void   called when back arrow is pressed
 *   title   – string       defaults to "Vaccination"
 *   subtitle – string      optional subtitle
 */
export default function Header({
  onBack,
  title    = 'Vaccination',
  subtitle = 'Keep your pet healthy with timely vaccinations',
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack}
        activeOpacity={0.7}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <MaterialIcons name="arrow-back" size={22} color={'#1B1B1B'} />
      </TouchableOpacity>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
      </View>

      <View style={styles.iconWrap}>
        <MaterialIcons name="vaccines" size={26} color={COLORS.accent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:    'row',
    alignItems:       'flex-start',
    paddingHorizontal: 16,
    paddingTop:       16,
    paddingBottom:    14,
    backgroundColor:  COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  backBtn: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: COLORS.secondary,
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       2,
    flexShrink:      0,
  },
  textBlock: {
    flex: 1,
    gap:  2,
  },
  title: {
    fontSize:   20,
    fontWeight: '800',
    color:      COLORS.card,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color:    COLORS.accent,
  },
  iconWrap: {
    width:           38,
    height:          38,
    borderRadius:    12,
    backgroundColor: COLORS.secondary,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
    marginTop:       1,
  },
});
