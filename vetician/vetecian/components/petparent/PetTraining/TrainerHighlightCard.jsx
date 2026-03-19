// components/TrainerHighlightCard.js
// Vatecian App — Featured trainer card

import React, { useEffect, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../../constant/theme';

const TrainerHighlightCard = ({ trainer }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      {/* Badge */}
      <View style={styles.badge}>
        <MaterialCommunityIcons name="check-decagram" size={12} color={COLORS.white} />
        <Text style={styles.badgeText}>Featured Trainer</Text>
      </View>

      <View style={styles.row}>
        <Image source={{ uri: trainer.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{trainer.name}</Text>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="star" size={14} color="#F9A825" />
            <Text style={styles.rating}>{trainer.rating}</Text>
            <Text style={styles.reviews}>({trainer.reviews} reviews)</Text>
          </View>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="briefcase-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{trainer.experience} yrs experience</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>{trainer.description}</Text>

      <View style={styles.tagRow}>
        {trainer.specializations.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} activeOpacity={0.85}>
        <Text style={styles.buttonText}>View Profile</Text>
        <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.primaryGreen} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryGreen,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: SPACING.md,
    gap: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: COLORS.secondaryGreen,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
    gap: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviews: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.md,
  },
  tag: {
    backgroundColor: COLORS.lightGreen,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.primaryGreen,
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primaryGreen,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    gap: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryGreen,
  },
});

export default TrainerHighlightCard;
