// components/FadeInCard.jsx
import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

/**
 * FadeInCard — lightweight fade + slide-up wrapper.
 * Wraps any child with a subtle entrance animation.
 *
 * Props:
 *   delay  {number}  — ms before animation starts (default 0)
 *   style  {object}  — additional styles applied to the Animated.View
 */
export default function FadeInCard({ delay = 0, children, style }) {
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 420,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
