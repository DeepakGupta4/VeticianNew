// components/TrainingProgramCard.js
// Vatecian App — Training program list card

import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../../constant/theme';

const LEVEL_COLOR = {
  Beginner: '#558B2F',
  Puppy:    '#7CB342',
  Advanced: '#33691E',
};

const TrainingProgramCard = ({ program, index, onEnroll, isSelected, onSelect }) => {
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-16)).current;
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 380, delay: index * 100, useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0, duration: 380, delay: index * 100, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isSelected ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isSelected]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleSelect = () => onSelect && onSelect(program.id);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primaryGreen],
  });

  return (
    <Animated.View style={[styles.cardBorder, { borderColor }]}>
      <Animated.View style={[
        styles.card,
        isSelected && styles.cardSelected,
        { opacity: fadeAnim, transform: [{ translateX }, { scale: scaleAnim }] },
      ]}>

        {/* Invisible full-card tap target behind content */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleSelect}
          activeOpacity={1}
        />

        {/* Selected check */}
        {isSelected && (
          <View style={styles.checkBadge}>
            <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.primaryGreen} />
          </View>
        )}

        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.name}>{program.name}</Text>
            <View style={[styles.levelBadge, { backgroundColor: LEVEL_COLOR[program.level] + '18' }]}>
              <Text style={[styles.levelText, { color: LEVEL_COLOR[program.level] }]}>
                {program.level}
              </Text>
            </View>
          </View>
          <Text style={styles.price}>₹{program.price.toLocaleString('en-IN')}</Text>
        </View>

        {/* Details row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="calendar-range" size={14} color={COLORS.textPrimary} />
            <Text style={styles.detailText}>{program.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={14} color={COLORS.textPrimary} />
            <Text style={styles.detailText}>{program.sessions} sessions</Text>
          </View>
        </View>

        {/* Focus */}
        <View style={styles.focusRow}>
          <MaterialCommunityIcons name="bullseye-arrow" size={14} color={COLORS.textPrimary} />
          <Text style={styles.focusText}>{program.focus}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Enroll button */}
        <TouchableOpacity
          style={styles.enrollButton}
          onPress={() => {
            handleSelect();
            onEnroll && onEnroll(program);
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.enrollText}>Enroll Now</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.white} />
        </TouchableOpacity>

      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardBorder: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  cardSelected: {
    backgroundColor: COLORS.white,
  },
  checkBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    paddingRight: 24,
  },
  titleBlock: {
    flex: 1,
    marginRight: SPACING.sm,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 21,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryGreen,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  focusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: SPACING.md,
  },
  focusText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  enrollButton: {
    backgroundColor: COLORS.primaryGreen,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    gap: 4,
  },
  enrollText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default TrainingProgramCard;
