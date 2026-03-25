// components/appointments/PetSelector.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS2 } from './colors';
import { PETS } from './data';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

/**
 * PetSelector
 * Props:
 *   selected — pet id string | null
 *   onSelect — (id: string) => void
 */
export default function PetSelector({ selected, onSelect }) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>Select Pet</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {PETS.map((pet) => {
          const isSelected = selected === pet.id;
          return (
            <TouchableOpacity
              key={pet.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => onSelect(pet.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.avatarWrap, isSelected && styles.avatarWrapSelected]}>
                <MaterialCommunityIcons
                  name={pet.icon}
                  size={26}
                  color={isSelected ? COLORS2.primary : COLORS2.subtext}
                />
              </View>
              <Text style={[styles.petName, isSelected && styles.petNameSelected]}>
                {pet.name}
              </Text>
              <Text style={styles.breed}>{pet.breed}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 22,
  },
  label: {
    fontSize:      13,
    fontWeight:    '600',
    color:         COLORS2.subtext,
    marginBottom:  12,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap:           10,
    paddingBottom:  2,
  },
  card: {
    alignItems:      'center',
    backgroundColor: COLORS2.card,
    borderRadius:    14,
    padding:         14,
    width:           100,
    borderWidth:     1.5,
    borderColor:     COLORS2.border,
    gap:             4,
  },
  cardSelected: {
    borderColor:     COLORS2.primary,
    backgroundColor: COLORS2.accent,
  },
  avatarWrap: {
    width:           48,
    height:          48,
    borderRadius:    24,
    backgroundColor: COLORS2.accent,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:     4,
  },
  avatarWrapSelected: {
    backgroundColor: COLORS2.accent,
    borderWidth:     1.5,
    borderColor:     COLORS2.primary,
  },
  petName: {
    fontSize:   13,
    fontWeight: '700',
    color:      COLORS2.text,
  },
  petNameSelected: {
    color: COLORS2.primary,
  },
  breed: {
    fontSize:  10,
    color:     COLORS2.subtext,
    textAlign: 'center',
  },
});
