import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RECOMMENDED_VETS } from './vets';

export default function RecommendedVets({ onAddFavorite, onViewAll }) {
  const handleAdd = (vet) => {
    Alert.alert(
      'Add to Favorites',
      `Add ${vet.name} to your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: () => onAddFavorite(vet) },
      ]
    );
  };

  return (
    <View style={s.wrapper}>
      <View style={s.sectionHeader}>
        <View style={s.sectionLeft}>
          <View style={s.sectionIconBox}>
            <MaterialCommunityIcons name="star-circle-outline" size={14} color="#558B2F" />
          </View>
          <Text style={s.sectionTitle}>Recommended for You</Text>
        </View>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={s.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {RECOMMENDED_VETS.map((vet) => (
          <View key={vet.id} style={s.card}>
            {/* Availability dot */}
            <View style={[s.availDot, { backgroundColor: vet.available ? '#4CAF50' : '#FF9800' }]} />

            {/* Avatar + Name */}
            <View style={s.topRow}>
              <View style={s.avatar}>
                <Text style={s.initials}>{vet.initials}</Text>
              </View>
              <View style={s.nameBlock}>
                <Text style={s.name} numberOfLines={1}>{vet.name}</Text>
                <Text style={s.spec} numberOfLines={1}>{vet.specialization}</Text>
              </View>
            </View>

            {/* Clinic */}
            <View style={s.infoRow}>
              <MaterialCommunityIcons name="hospital-building" size={11} color="#6B7B5E" />
              <Text style={s.infoTxt} numberOfLines={1}>{vet.clinic}</Text>
            </View>

            {/* Location */}
            <View style={s.infoRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={11} color="#6B7B5E" />
              <Text style={s.infoTxt}>{vet.location} · {vet.distance}</Text>
            </View>

            {/* Divider */}
            <View style={s.divider} />

            {/* Stats row */}
            <View style={s.statsRow}>
              <View style={s.stat}>
                <MaterialCommunityIcons name="star" size={11} color="#558B2F" />
                <Text style={s.statGreen}>{vet.rating}</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.stat}>
                <MaterialCommunityIcons name="clock-outline" size={11} color="#6B7B5E" />
                <Text style={s.statTxt}>{vet.experience}</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.stat}>
                <MaterialCommunityIcons name="currency-inr" size={11} color="#6B7B5E" />
                <Text style={s.statTxt}>{vet.fee}</Text>
              </View>
            </View>

            {/* Add Button */}
            <TouchableOpacity style={s.addBtn} onPress={() => handleAdd(vet)} activeOpacity={0.8}>
              <MaterialCommunityIcons name="heart-plus-outline" size={13} color="#FFFFFF" />
              <Text style={s.addTxt}>Add to Favorites</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={{ height: 8 }} />
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { marginTop: 8 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#F1F8E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#1B2A10' },
  viewAll: { fontSize: 12, color: '#558B2F', fontWeight: '600' },

  scroll: { paddingHorizontal: 16, paddingBottom: 4, gap: 12 },

  card: {
    width: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D0E8C0',
    padding: 13,
    shadowColor: '#558B2F',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },

  availDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F8E9',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: { fontSize: 15, fontWeight: '800', color: '#558B2F' },
  nameBlock: { flex: 1 },
  name: { fontSize: 13, fontWeight: '700', color: '#1B2A10' },
  spec: { fontSize: 11, color: '#558B2F', fontWeight: '600', marginTop: 1 },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  infoTxt: { fontSize: 11, color: '#6B7B5E', flex: 1 },

  divider: { height: 1, backgroundColor: '#EEF5E8', marginVertical: 10 },

  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stat: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  statDivider: { width: 1, height: 12, backgroundColor: '#E8F0E1' },
  statGreen: { fontSize: 11, color: '#558B2F', fontWeight: '700' },
  statTxt: { fontSize: 11, color: '#6B7B5E', fontWeight: '600' },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#558B2F',
    shadowColor: '#558B2F',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  addTxt: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
});
