import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors.jsx';

const FeaturedTip = memo(({ tip, onPress }) => {
  if (!tip) return null;
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>✦ Featured Tip</Text>
      <TouchableOpacity style={styles.card} onPress={() => onPress(tip)} activeOpacity={0.92}>
        <Image source={{ uri: tip.image }} style={styles.image} resizeMode="cover" fadeDuration={0} />
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="star" size={11} color={COLORS2.primary} />
            <Text style={styles.badgeText}>Featured</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>{tip.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{tip.shortDescription}</Text>
          <View style={styles.meta}>
            <MaterialCommunityIcons name="clock-outline" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={styles.metaText}>{tip.readTime}</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>
              {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
            </Text>
            <View style={styles.readBtn}>
              <Text style={styles.readBtnText}>Read</Text>
              <MaterialCommunityIcons name="arrow-right" size={12} color={COLORS2.primary} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS2.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 220,
    shadowColor: COLORS2.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 50, 20, 0.62)',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS2.primary,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  description: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 18,
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  readBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 'auto',
    gap: 3,
  },
  readBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS2.primary,
  },
});

export default FeaturedTip;
