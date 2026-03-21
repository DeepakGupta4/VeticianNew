import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '../../../constant/theme';
import { ROOMS } from './hostelData';

export default function RoomList({ selected, onSelect }) {
  return (
    <View style={styles.wrap}>
      {ROOMS.map(r => {
        const active = selected?.id === r.id;
        return (
          <TouchableOpacity
            key={r.id}
            style={[styles.card, active && styles.cardOn]}
            onPress={() => onSelect(r)}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapOn]}>
              <Icon name={r.icon} size={22} color="#1a1a1a" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, active && { color: COLORS.primary }]}>{r.name}</Text>
              <Text style={styles.desc}>{r.desc}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.price}>₹{r.price}</Text>
              <Text style={styles.perNight}>/night</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 22 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E2EDD5',
    padding: 14, marginBottom: 10,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  cardOn:    { borderColor: COLORS.primary, borderWidth: 2 },
  iconWrap:  { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  iconWrapOn:{ backgroundColor: '#F0F7E6' },
  name:      { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 3 },
  desc:      { fontSize: 12, color: '#888', lineHeight: 17 },
  price:     { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  perNight:  { fontSize: 11, color: '#aaa' },
});
