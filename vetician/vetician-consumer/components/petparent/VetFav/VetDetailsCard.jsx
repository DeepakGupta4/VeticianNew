import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 as C } from './colors';

export default function VetDetailsCard({ vet }) {
  const stats = [
    { label: 'Rating', value: vet.rating, isRating: true },
    { label: 'Experience', value: vet.experience },
    { label: 'Fee', value: vet.fee },
    { label: 'Distance', value: vet.distance },
  ];

  return (
    <View style={s.card}>
      {/* Profile Row */}
      <View style={s.profileRow}>
        {vet.image ? (
          <Image source={{ uri: vet.image }} style={s.avatarImg} />
        ) : (
          <View style={s.avatarFallback}>
            <Text style={s.initials}>{vet.initials}</Text>
          </View>
        )}

        <View style={s.profileInfo}>
          <Text style={s.name}>{vet.name}</Text>
          <Text style={s.spec}>{vet.specialization}</Text>
          <View style={s.clinicRow}>
            <MaterialCommunityIcons name="hospital-building" size={12} color={C.subtext} />
            <Text style={s.clinic}>{vet.clinic} · {vet.location}</Text>
          </View>
          <View style={[s.availBadge, { backgroundColor: vet.available ? '#E8F5E9' : '#FFF3E0' }]}>
            <View style={[s.availDot, { backgroundColor: vet.available ? '#4CAF50' : '#FF9800' }]} />
            <Text style={[s.availTxt, { color: vet.available ? '#2E7D32' : '#E65100' }]}>
              {vet.available ? 'Open Now' : 'Currently Busy'}
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={s.divider} />

      {/* Stats Row */}
      <View style={s.statsRow}>
        {stats.map((stat, index) => (
          <View
            key={stat.label}
            style={[s.statItem, index < stats.length - 1 && s.statBorderRight]}
          >
            {stat.isRating ? (
              <View style={s.ratingRow}>
                <MaterialCommunityIcons name="star" size={14} color="#558B2F" />
                <Text style={s.statValGreen}>{stat.value}</Text>
              </View>
            ) : (
              <Text style={s.statVal}>{stat.value}</Text>
            )}
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#D0E8C0',
    shadowColor: '#558B2F',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  profileRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    padding: 16,
  },
  avatarImg: {
    width: 76,
    height: 76,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#C8E6C9',
    flexShrink: 0,
  },
  avatarFallback: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: '#F1F8E9',
    borderWidth: 2,
    borderColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: { fontSize: 26, fontWeight: '800', color: '#558B2F' },
  profileInfo: { flex: 1, gap: 4 },
  name: { fontSize: 18, fontWeight: '800', color: '#1B2A10', letterSpacing: -0.3 },
  spec: { fontSize: 13, color: '#558B2F', fontWeight: '600' },
  clinicRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clinic: { fontSize: 12, color: '#6B7B5E', flex: 1 },
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  availDot: { width: 6, height: 6, borderRadius: 3 },
  availTxt: { fontSize: 11, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#E8F0E1', marginHorizontal: 16 },
  statsRow: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  statBorderRight: { borderRightWidth: 1, borderRightColor: '#E8F0E1' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statVal: { fontSize: 13, fontWeight: '800', color: '#1B2A10' },
  statValGreen: { fontSize: 13, fontWeight: '800', color: '#558B2F' },
  statLabel: { fontSize: 10, color: '#6B7B5E', fontWeight: '500', marginTop: 2 },
});
