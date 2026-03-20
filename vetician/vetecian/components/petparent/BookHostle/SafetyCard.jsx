import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { SAFETY } from './hostelData';

export default function SafetyCard() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Icon name="shield-check" size={22} color="#1a1a1a" />
        </View>
        <View>
          <Text style={styles.title}>Pet Safety Guarantee</Text>
          <Text style={styles.sub}>Verified & certified care</Text>
        </View>
      </View>
      {SAFETY.map((s, i) => (
        <View key={i} style={[styles.row, i === SAFETY.length - 1 && { borderBottomWidth: 0 }]}>
          <View style={styles.dot} />
          <Text style={styles.txt}>{s}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: '#E2EDD5',
    padding: 16, marginBottom: 22,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  header:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconWrap:{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F7E6', alignItems: 'center', justifyContent: 'center' },
  title:   { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  sub:     { fontSize: 12, color: '#888', marginTop: 2 },
  row:     { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  dot:     { width: 7, height: 7, borderRadius: 4, backgroundColor: '#1a1a1a' },
  txt:     { fontSize: 13, color: '#555', flex: 1 },
});
