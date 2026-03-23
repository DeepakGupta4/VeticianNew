import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FadeInCard from './FadeInCard';
import { COLORS2 } from '../../../constant/theme';

const PETS = [
  { name: 'Rocky', breed: 'Golden Retriever', icon: 'dog' },
  { name: 'Bella',  breed: 'Persian Cat',     icon: 'cat' },
];

export default function PetSelectorCard({ selected, onSelect, delay = 260 }) {
  return (
    <FadeInCard delay={delay} style={styles.card}>
      <Text style={styles.title}>Select Your Pet</Text>
      <View style={styles.row}>
        {PETS.map((pet, i) => {
          const active = selected === pet.name;
          return (
            <TouchableOpacity
              key={pet.name}
              onPress={() => onSelect(pet.name)}
              activeOpacity={0.85}
              style={[styles.petCard, active && styles.petCardActive, i < PETS.length - 1 && { marginRight: 12 }]}
            >
              <MaterialCommunityIcons
                name={pet.icon}
                size={34}
                color={COLORS2.primary}
                style={styles.icon}
              />
              <Text style={[styles.name, active && styles.nameActive]}>{pet.name}</Text>
              <Text style={styles.breed}>{pet.breed}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </FadeInCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS2.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
  },
  petCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: COLORS2.card,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
  },
  petCardActive: {
    borderColor: COLORS2.primary,
    backgroundColor: COLORS2.card,
  },
  icon: {
    marginBottom: 8,
  },
  name: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 2,
  },
  nameActive: {
    color: COLORS2.primary,
  },
  breed: {
    fontSize: 11.5,
    color: COLORS2.subtext,
    textAlign: 'center',
  },
});
