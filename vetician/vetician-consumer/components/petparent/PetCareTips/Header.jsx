import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors.jsx';

const Header = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
        <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS2.primary} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pet Care Tips</Text>
        <Text style={styles.subtitle}>Learn how to care for your pet better</Text>
      </View>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS2.primary,
 
    borderBottomColor: COLORS2.border,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS2.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS2.card,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS2.accent,
    marginTop: 2,
    letterSpacing: 0.1,
  },
  placeholder: {
    width: 38,
  },
});

export default Header;
