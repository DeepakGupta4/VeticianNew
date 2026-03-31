import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

const Header = ({ onBack, title, subtitle }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
      <MaterialCommunityIcons name="arrow-left" size={20} color={COLORS2.primary} />
    </TouchableOpacity>
    <View style={styles.titleBlock}>
      <Text style={styles.title}>{title || 'Settings'}</Text>
      {subtitle !== undefined
        ? subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null
        : <Text style={styles.subtitle}>Manage your account and preferences</Text>
      }
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS2.primary,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 52,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS2.border,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: COLORS2.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  titleBlock: { flex: 1 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS2.card, letterSpacing: 0.1 },
  subtitle: { fontSize: 12, color: COLORS2.accent, marginTop: 2 },
});

export default Header;
