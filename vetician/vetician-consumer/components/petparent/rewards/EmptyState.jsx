import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

export default function EmptyState({ icon = 'gift-off-outline', title, message }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={icon} size={36} color={COLORS2.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', paddingVertical: 32, paddingHorizontal: 20,
    backgroundColor: COLORS2.card, borderRadius: 18,
    borderWidth: 1, borderColor: COLORS2.border,
  },
  iconBox: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: COLORS2.accent, borderWidth: 1.5, borderColor: COLORS2.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  title: { fontSize: 15, fontWeight: '800', color: COLORS2.text, marginBottom: 6 },
  message: { fontSize: 12.5, color: COLORS2.subtext, textAlign: 'center', lineHeight: 18 },
});
