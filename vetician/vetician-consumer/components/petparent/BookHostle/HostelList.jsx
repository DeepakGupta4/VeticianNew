import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../../constant/theme';

export default function HostelList({ hostels, selected, onSelect }) {
  const router = useRouter();
  
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hs}>
      {hostels.map(h => {
        const active = selected?.id === h.id;
        return (
          <TouchableOpacity
            key={h.id}
            style={[styles.card, active && styles.cardOn]}
            onPress={() => onSelect(h)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: h.image }} style={styles.img} resizeMode="cover" />
            <View style={styles.overlay} />

            {h.tag && (
              <View style={styles.tag}>
                <Text style={styles.tagTxt}>{h.tag}</Text>
              </View>
            )}

            {active && (
              <View style={styles.check}>
                <Icon name="check-circle" size={16} color="#fff" />
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{h.name}</Text>
              <View style={styles.meta}>
                <Icon name="star" size={12} color="#FFB300" />
                <Text style={styles.metaTxt}>{h.rating}</Text>
                <Text style={styles.dot}>·</Text>
                <Icon name="map-marker-outline" size={12} color="#1a1a1a" />
                <Text style={styles.metaTxt}>{h.distance}</Text>
              </View>
              <Text style={styles.price}>
                ₹{h.price} <Text style={styles.perNight}>/night</Text>
              </Text>
              <TouchableOpacity
                style={[styles.detailsBtn, active && styles.detailsBtnOn]}
                onPress={() => router.push({ pathname: '/(vetician_tabs)/pages/HostelDetails', params: { hostelId: h.id } })}
                activeOpacity={0.8}
              >
                <Text style={[styles.detailsTxt, active && { color: '#fff' }]}>View Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hs: { marginHorizontal: -16, paddingHorizontal: 16, marginBottom: 22 },
  card: {
    width: 200, borderRadius: 14, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#E2EDD5', marginRight: 12, overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  cardOn:   { borderColor: COLORS.primary, borderWidth: 2 },
  img:      { width: '100%', height: 115 },
  overlay:  { ...StyleSheet.absoluteFillObject, height: 115, backgroundColor: 'rgba(0,0,0,0.07)' },
  tag:      { position: 'absolute', top: 8, left: 8, backgroundColor: COLORS.primary, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  tagTxt:   { color: '#fff', fontSize: 10, fontWeight: '700' },
  check:    { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.primary, borderRadius: 20, padding: 2 },
  info:     { padding: 12 },
  name:     { fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 5 },
  meta:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  metaTxt:  { fontSize: 12, color: '#888' },
  dot:      { fontSize: 12, color: '#ccc' },
  price:    { fontSize: 15, fontWeight: '800', color: COLORS.primary, marginBottom: 10 },
  perNight: { fontSize: 11, fontWeight: '400', color: '#888' },
  detailsBtn:   { borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 8, paddingVertical: 7, alignItems: 'center' },
  detailsBtnOn: { backgroundColor: COLORS.primary },
  detailsTxt:   { fontSize: 13, fontWeight: '700', color: COLORS.primary },
});
