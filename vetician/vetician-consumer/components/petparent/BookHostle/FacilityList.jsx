import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function FacilityList({ facilities }) {
  if (!facilities || facilities.length === 0) {
    return null;
  }

  const facilityIcons = {
    'supervision': 'eye-outline',
    'play': 'soccer-field',
    'vet': 'stethoscope',
    'walks': 'walk',
    'feeding': 'food-drumstick-outline',
    'cameras': 'cctv',
    'grooming': 'shower-head',
    '24/7': 'eye-outline',
    'play area': 'soccer-field',
    'vet on call': 'stethoscope',
    'daily walks': 'walk',
    'pet cameras': 'cctv',
  };

  const getIcon = (label) => {
    const key = label.toLowerCase();
    return facilityIcons[key] || 'check-circle';
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hs}>
      {facilities.map((f, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.iconWrap}>
            <Icon name={getIcon(f)} size={22} color="#1a1a1a" />
          </View>
          <Text style={styles.label}>{f}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hs:      { marginHorizontal: -16, paddingHorizontal: 16, marginBottom: 22 },
  item:    { width: 76, alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2EDD5', paddingVertical: 12, paddingHorizontal: 6, marginRight: 10 },
  iconWrap:{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#F0F7E6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  label:   { fontSize: 11, color: '#555', fontWeight: '600', textAlign: 'center' },
});
