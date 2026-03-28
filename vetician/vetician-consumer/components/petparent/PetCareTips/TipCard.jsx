import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors.jsx';

const CATEGORY_ICONS = {
  nutrition: 'food-apple',
  grooming:  'scissors-cutting',
  training:  'school',
  health:    'heart-pulse',
  behavior:  'brain',
  emergency: 'ambulance',
};

const TipCard = memo(({ tip, onPress, onSave, isSaved }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(tip)}
    activeOpacity={0.88}
  >
    <Image
      source={{ uri: tip.image }}
      style={styles.image}
      resizeMode="cover"
      fadeDuration={0}
    />
    <View style={styles.content}>
      <View style={styles.topRow}>
        <View style={styles.categoryBadge}>
          <MaterialCommunityIcons
            name={CATEGORY_ICONS[tip.category] || 'paw'}
            size={11}
            color={COLORS2.primary}
          />
          <Text style={styles.categoryText}>
            {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onSave(tip.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={isSaved ? COLORS2.primary : COLORS2.subtext}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title} numberOfLines={2}>{tip.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{tip.shortDescription}</Text>
      <View style={styles.footer}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="clock-outline" size={12} color={COLORS2.subtext} />
          <Text style={styles.metaText}>{tip.readTime}</Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="thumb-up-outline" size={12} color={COLORS2.subtext} />
          <Text style={styles.metaText}>{tip.helpfulCount}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS2.border,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: COLORS2.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 110,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS2.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS2.primary,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS2.text,
    lineHeight: 19,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: COLORS2.subtext,
    lineHeight: 16.5,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS2.subtext,
    fontWeight: '500',
  },
});

export default TipCard;
