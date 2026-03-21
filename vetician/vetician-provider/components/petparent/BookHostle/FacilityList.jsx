import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { FACILITIES } from './hostelData';

export default function FacilityList() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hs}>
      {FACILITIES.map(f => (
        <View key={f.id} style={styles.item}>
          <View style={styles.iconWrap}>
            <Icon name={f.icon} size={22} color="#1a1a1a" />
          </View>
          <Text style={styles.label}>{f.label}</Text>
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
