// components/TrainingCategoryCard.js
// Vatecian App — Horizontal scroll training category card

import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../../constant/theme';

const ICON_MAP = {
  paw: 'paw',
  dog: 'dog',
  'shield-check': 'shield-check',
  'star-circle': 'star-circle',
  security: 'shield-lock',
  walk: 'walk',
};

const TrainingCategoryCard = ({ item, isSelected, onPress, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons
          name={ICON_MAP[item.icon] || 'paw'}
          size={26}
          color={isSelected ? COLORS.white : COLORS.textPrimary}
        />
        <Text style={[styles.name, isSelected && styles.nameSelected]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.desc, isSelected && styles.descSelected]} numberOfLines={2}>
          {item.description}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 130,
    marginRight: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
    ...SHADOWS.card,
  },
  cardSelected: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: COLORS.primaryGreen,
  },
  name: {
    marginTop: SPACING.sm,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  nameSelected: {
    color: COLORS.white,
  },
  desc: {
    marginTop: 3,
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
  },
  descSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
});

export default TrainingCategoryCard;
