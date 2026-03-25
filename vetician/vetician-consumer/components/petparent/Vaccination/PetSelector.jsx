// vaccination/components/PetSelector.jsx
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS2 as COLORS } from '../../../constant/theme';

/**
 * PetSelector
 * Props:
 *   pets       – Pet[]   list of pet objects from mockData
 *   selectedId – number  id of the currently-selected pet
 *   onSelect   – (pet) => void
 */
export default function PetSelector({ pets = [], selectedId, onSelect }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <MaterialIcons name="pets" size={15} color={COLORS.primary} />
        <Text style={styles.label}>Your Pets</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pets.map((pet) => {
          const active = pet.id === selectedId;
          return (
            <TouchableOpacity
              key={pet.id}
              onPress={() => onSelect(pet)}
              activeOpacity={0.75}
              style={[styles.card, active && styles.cardActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Select ${pet.name}`}
            >
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                {typeof pet.avatar === 'string' && pet.avatar.match(/\p{Emoji}/u) ? (
                  <Text style={styles.avatarEmoji}>{pet.avatar}</Text>
                ) : (
                  <MaterialCommunityIcons
                    name={pet.avatar ?? pet.icon ?? 'paw'}
                    size={28}
                    color={active ? COLORS.primary : COLORS.subtext}
                  />
                )}
              </View>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed} numberOfLines={1}>{pet.breed}</Text>
              <Text style={styles.petAge}>{pet.age}</Text>

              {active && (
                <View style={styles.activeDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
  },
  label: {
    fontSize:   13,
    fontWeight: '700',
    color:      COLORS.text,
  },
  scrollContent: {
    gap:           10,
    paddingRight:  4,
    paddingBottom: 2,
  },
  card: {
    minWidth:        108,
    paddingVertical:  12,
    paddingHorizontal: 14,
    borderRadius:    16,
    backgroundColor: COLORS.card,
    borderWidth:     2,
    borderColor:     COLORS.border,
    alignItems:      'center',
    gap:             3,
    // shadow
    shadowColor:    COLORS.shadow,
    shadowOffset:   { width: 0, height: 2 },
    shadowOpacity:  0.25,
    shadowRadius:   4,
    elevation:      2,
  },
  cardActive: {
    borderColor:     COLORS.primary,
    backgroundColor: COLORS.card,
  },
  iconWrap: {
    width:           48,
    height:          48,
    borderRadius:    12,
    backgroundColor: COLORS.accent,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    2,
  },
  iconWrapActive: {
    backgroundColor: COLORS.border,
  },
  petName: {
    fontSize:   13,
    fontWeight: '700',
    color:      COLORS.text,
  },
  petBreed: {
    fontSize:  10,
    color:     COLORS.subtext,
    textAlign: 'center',
    maxWidth:  90,
  },
  petAge: {
    fontSize:   10,
    color:      COLORS.primary,
    fontWeight: '600',
  },
  activeDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: COLORS.primary,
    marginTop:       3,
  },
  avatarEmoji: {
    fontSize: 26,
  },
});
