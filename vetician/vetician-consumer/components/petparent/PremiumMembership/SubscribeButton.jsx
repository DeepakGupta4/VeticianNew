// components/SubscribeButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Icon } from 'react-native-paper';
import { COLORS2 } from './colors';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function SubscribeButton({ label = 'Upgrade Now', onPress }) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 10 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  return (
    <View style={styles.wrapper}>
      <AnimatedTouchable
        style={[styles.btn, animStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Icon source="crown" size={18} color={COLORS2.card} />
        <Text style={styles.label}>{label}</Text>
        <Icon source="arrow-right" size={16} color={COLORS2.card} />
      </AnimatedTouchable>
      <Text style={styles.footNote}>Cancel anytime. No hidden charges.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS2.primary,
    paddingVertical: 15,
    borderRadius: 14,
    width: '100%',
    gap: 10,
    shadowColor: COLORS2.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS2.card,
    letterSpacing: 0.3,
  },
  footNote: {
    fontSize: 11,
    color: COLORS2.subtext,
    marginTop: 10,
  },
});
