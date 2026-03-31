import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS2 } from '../../../constant/theme';

function SkeletonBox({ width, height, borderRadius = 10, style }) {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[{ width, height, borderRadius, backgroundColor: COLORS2.border, opacity }, style]} />;
}

export default function Loader() {
  return (
    <View style={styles.container}>
      <SkeletonBox width="100%" height={180} borderRadius={22} style={{ marginBottom: 20 }} />
      <SkeletonBox width="50%" height={16} style={{ marginBottom: 14 }} />
      <View style={styles.row}>
        {[1, 2, 3, 4].map((i) => <SkeletonBox key={i} width={108} height={120} borderRadius={18} />)}
      </View>
      <SkeletonBox width="55%" height={16} style={{ marginTop: 24, marginBottom: 14 }} />
      {[1, 2, 3].map((i) => <SkeletonBox key={i} width="100%" height={82} borderRadius={18} style={{ marginBottom: 12 }} />)}
      <SkeletonBox width="50%" height={16} style={{ marginTop: 8, marginBottom: 14 }} />
      <SkeletonBox width="100%" height={160} borderRadius={22} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS2.bg, padding: 16, paddingTop: 20 },
  row: { flexDirection: 'row', gap: 10 },
});
