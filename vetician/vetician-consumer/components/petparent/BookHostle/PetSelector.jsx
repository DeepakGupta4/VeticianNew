import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '../../../constant/theme';
import { PETS } from './hostelData';

export default function PetSelector({ selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hs}>
      {PETS.map(p => {
        const active = selected?.id === p.id;
        return (
          <TouchableOpacity
            key={p.id}
            style={[styles.pill, active && styles.pillOn]}
            onPress={() => onSelect(p)}
            activeOpacity={0.8}
          >
            <Icon name={p.icon} size={18} color={active ? '#fff' : '#1a1a1a'} style={{ marginRight: 6 }} />
            <View>
              <Text style={[styles.name, active && styles.nameOn]}>{p.name}</Text>
              <Text style={[styles.breed, active && { color: 'rgba(255,255,255,0.75)' }]}>{p.breed}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hs: { marginHorizontal: -16, paddingHorizontal: 16, marginBottom: 22 },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 50, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#E2EDD5',
    marginRight: 10,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  pillOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  name:   { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  nameOn: { color: '#fff' },
  breed:  { fontSize: 11, color: '#888', marginTop: 1 },
});
