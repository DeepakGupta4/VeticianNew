// components/PetSelectorCard.js
// Vatecian App — Pet selection card

import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../../constant/theme';

const PetSelectorCard = ({ pet, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => onSelect(pet.id)}
      activeOpacity={0.85}
    >
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: pet.avatar }} style={styles.avatar} />
        {isSelected && (
          <View style={styles.checkBadge}>
            <MaterialCommunityIcons name="check" size={12} color={COLORS.white} />
          </View>
        )}
      </View>
      <Text style={[styles.name, isSelected && styles.nameSelected]}>{pet.name}</Text>
      <Text style={[styles.breed, isSelected && styles.breedSelected]} numberOfLines={1}>
        {pet.breed}
      </Text>
      <Text style={[styles.age, isSelected && styles.ageSelected]}>{pet.age}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  cardSelected: {
    borderColor: COLORS.primaryGreen,
    backgroundColor: COLORS.white,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  nameSelected: {
    color: COLORS.primaryGreen,
  },
  breed: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  breedSelected: {
    color: COLORS.textSecondary,
  },
  age: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  ageSelected: {
    color: COLORS.secondaryGreen,
    fontWeight: '600',
  },
});

export default PetSelectorCard;
