import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS2 } from './colors';

const SkeletonBox = ({ width, height, style }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });

  return (
    <Animated.View
      style={[
        styles.skel,
        { width, height, opacity },
        style,
      ]}
    />
  );
};

const SkeletonCard = () => (
  <View style={styles.card}>
    <View style={styles.accentBar} />
    <View style={styles.body}>
      <View style={styles.row}>
        <SkeletonBox width={42} height={42} style={{ borderRadius: 12 }} />
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonBox width="60%" height={14} style={{ borderRadius: 6 }} />
          <SkeletonBox width="40%" height={11} style={{ borderRadius: 6 }} />
          <SkeletonBox width="30%" height={10} style={{ borderRadius: 6 }} />
        </View>
        <SkeletonBox width={70} height={24} style={{ borderRadius: 20 }} />
      </View>
      <View style={styles.divider} />
      <View style={styles.bottomRow}>
        <SkeletonBox width={140} height={12} style={{ borderRadius: 6 }} />
        <SkeletonBox width={50} height={16} style={{ borderRadius: 6 }} />
      </View>
    </View>
    <View style={styles.actions}>
      <SkeletonBox width="46%" height={34} style={{ borderRadius: 10 }} />
      <SkeletonBox width="46%" height={34} style={{ borderRadius: 10 }} />
    </View>
  </View>
);

const Loader = () => (
  <View style={styles.container}>
    {[1, 2, 3].map((i) => (
      <SkeletonCard key={i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS2.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  accentBar: {
    height: 4,
    backgroundColor: COLORS2.border,
  },
  skel: {
    backgroundColor: COLORS2.border,
  },
  body: {
    padding: 14,
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS2.accent,
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
    justifyContent: 'space-between',
  },
});

export default Loader;
