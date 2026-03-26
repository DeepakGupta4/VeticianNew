// components/needhelp/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

export default function Header({ onBack }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS2.card} />
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
        <MaterialIcons name="arrow-back" size={20} color={'black'} />
      </TouchableOpacity>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Need Help?</Text>
        <Text style={styles.subtitle}>We're here to assist you anytime</Text>
      </View>
      <View style={styles.avatar}>
        <MaterialIcons name="support-agent" size={22} color={COLORS2.accent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: COLORS2.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS2.border,
    shadowColor: COLORS2.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS2.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBlock: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS2.card,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS2.border,
    marginTop: 2,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS2.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
});
