import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { COLORS2 } from './colors.jsx';

const SkeletonBox = ({ width, height, borderRadius = 8, style }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [COLORS2.border, COLORS2.accent]
    ),
  }));

  return (
    <Animated.View
      style={[{ width, height, borderRadius }, animStyle, style]}
    />
  );
};

const SkeletonCard = () => (
  <View style={styles.card}>
    <SkeletonBox width={100} height={110} borderRadius={0} />
    <View style={styles.cardContent}>
      <SkeletonBox width={70} height={16} borderRadius={20} style={{ marginBottom: 8 }} />
      <SkeletonBox width="90%" height={14} style={{ marginBottom: 5 }} />
      <SkeletonBox width="70%" height={14} style={{ marginBottom: 12 }} />
      <SkeletonBox width={80} height={12} borderRadius={6} />
    </View>
  </View>
);

const Loader = () => {
  return (
    <View style={styles.container}>
      {/* Featured skeleton */}
      <View style={styles.featured}>
        <SkeletonBox width={120} height={14} borderRadius={20} style={{ marginBottom: 12 }} />
        <SkeletonBox width="100%" height={220} borderRadius={20} />
      </View>

      {/* Cards skeleton */}
      <View style={styles.listSection}>
        <SkeletonBox width={100} height={12} borderRadius={6} style={{ marginBottom: 12 }} />
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.cardWrapper}>
            <SkeletonCard />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS2.bg,
  },
  featured: {
    padding: 16,
  },
  listSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS2.border,
    height: 110,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
});

export default Loader;
