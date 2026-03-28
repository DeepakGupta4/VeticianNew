import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS2 } from './colors';

export default function ServiceItem({ icon, title, description }) {
  return (
    <View style={styles.item}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={icon} size={22} color={COLORS2.primary} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '48%',
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    minHeight: 68,
    borderWidth: 1,
    borderColor: COLORS2.border,
    elevation: 2,
    shadowColor: COLORS2.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS2.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { flex: 1 },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 3,
  },
  desc: {
    fontSize: 11,
    color: COLORS2.subtext,
    lineHeight: 16,
  },
});
