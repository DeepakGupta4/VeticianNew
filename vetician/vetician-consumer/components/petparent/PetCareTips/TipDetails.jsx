import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS2 } from './colors.jsx';

const TipDetails = ({ tip, helpfulCount, savedCount }) => {
  if (!tip) return null;

  return (
    <View style={styles.container}>
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: tip.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.imageOverlay} />

        <View style={styles.imageMeta}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
            </Text>
          </View>
          <View style={styles.readTimeBadge}>
            <MaterialCommunityIcons name="clock-outline" size={12} color={COLORS2.subtext} />
            <Text style={styles.readTimeText}>{tip.readTime}</Text>
          </View>
        </View>
      </View>

      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.body}>
        {/* Title */}
        <Text style={styles.title}>{tip.title}</Text>

        {/* Vet Author */}
        <View style={styles.vetAuthor}>
          <View style={styles.vetAvatar}>
            <MaterialCommunityIcons name="doctor" size={20} color={COLORS2.primary} />
          </View>
          <View style={styles.vetInfo}>
            <Text style={styles.vetName}>{tip.vetName}</Text>
            <Text style={styles.vetTitle}>{tip.vetTitle}</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <MaterialCommunityIcons name="check-decagram" size={14} color={COLORS2.secondary} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Content */}
        <Text style={styles.content}>{tip.content}</Text>

        {/* Bullet Points */}
        <View style={styles.bulletSection}>
          <Text style={styles.bulletHeading}>Key Takeaways</Text>
          {tip.bulletPoints.map((point, index) => (
            <View key={index} style={styles.bulletItem}>
              <View style={styles.bulletDot}>
                <Text style={styles.bulletNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          ))}
        </View>

        {/* Vet Advice */}
        <View style={styles.vetAdviceCard}>
          <View style={styles.vetAdviceHeader}>
            <MaterialCommunityIcons name="stethoscope" size={18} color={COLORS2.primary} />
            <Text style={styles.vetAdviceTitle}>Vet's Advice</Text>
          </View>
          <Text style={styles.vetAdviceContent}>{tip.vetAdvice}</Text>
          <Text style={styles.vetAdviceAuthor}>— {tip.vetName}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="thumb-up" size={16} color={COLORS2.primary} />
            <Text style={styles.statValue}>{helpfulCount}</Text>
            <Text style={styles.statLabel}>Found helpful</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="bookmark" size={16} color={COLORS2.primary} />
            <Text style={styles.statValue}>{savedCount}</Text>
            <Text style={styles.statLabel}>Saved this tip</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS2.bg,
  },
  imageContainer: {
    width: '100%',
    height: 300,
  },

  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 38, 10, 0.38)',
  },
  imageMeta: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: COLORS2.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  readTimeBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS2.subtext,
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS2.text,
    lineHeight: 30,
    marginBottom: 16,
    letterSpacing: 0.1,
  },
  vetAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  vetAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS2.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS2.border,
  },
  vetInfo: {
    flex: 1,
  },
  vetName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS2.text,
  },
  vetTitle: {
    fontSize: 11,
    color: COLORS2.subtext,
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS2.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS2.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS2.border,
    marginBottom: 16,
  },
  content: {
    fontSize: 15,
    color: COLORS2.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  bulletSection: {
    marginBottom: 24,
  },
  bulletHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS2.text,
    marginBottom: 14,
    letterSpacing: 0.1,
  },
  bulletItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bulletDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS2.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS2.border,
    flexShrink: 0,
    marginTop: 1,
  },
  bulletNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS2.primary,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: COLORS2.text,
    lineHeight: 21,
  },
  vetAdviceCard: {
    backgroundColor: COLORS2.accent,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS2.primary,
  },
  vetAdviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  vetAdviceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS2.primary,
  },
  vetAdviceContent: {
    fontSize: 14,
    color: COLORS2.text,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  vetAdviceAuthor: {
    fontSize: 12,
    color: COLORS2.subtext,
    fontWeight: '600',
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS2.border,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS2.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS2.subtext,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS2.border,
  },
});

export default TipDetails;
