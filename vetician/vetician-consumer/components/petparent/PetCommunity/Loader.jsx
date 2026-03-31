import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { COLORS2 } from '../../../constant/theme';

function SkeletonBox({ width, height, borderRadius = 8, style }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [COLORS2.border, COLORS2.accent]),
  }));

  return <Animated.View style={[{ width, height, borderRadius }, animStyle, style]} />;
}

function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <SkeletonBox width={44} height={44} borderRadius={22} />
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonBox width="60%" height={12} />
          <SkeletonBox width="40%" height={10} />
        </View>
      </View>
      <SkeletonBox width="100%" height={14} style={{ marginTop: 12 }} />
      <SkeletonBox width="80%" height={14} style={{ marginTop: 6 }} />
      <SkeletonBox width="90%" height={14} style={{ marginTop: 6 }} />
    </View>
  );
}

export default function Loader() {
  return (
    <View>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 18,
    padding: 15,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
