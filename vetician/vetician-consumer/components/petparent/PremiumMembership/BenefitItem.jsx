import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS2 } from './colors';

export default function BenefitItem({ icon, title, description }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={icon} size={24} color="#fff" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS2.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    minHeight: 72,
    elevation: 2,
    shadowColor: COLORS2.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS2.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: COLORS2.subtext,
    lineHeight: 19,
  },
});
