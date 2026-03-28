import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { COLORS2 } from './colors.jsx';

const EmptyState = ({ message = 'No tips available', subtitle = 'Check back later for helpful pet care advice.' }) => {
  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="book-open-page-variant-outline" size={48} color={COLORS2.border} />
      </View>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: COLORS2.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
  },
  message: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS2.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS2.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;
