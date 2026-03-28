import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { COLORS2 } from './colors.jsx';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CategoryItem = ({ item, isSelected, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.93, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 });
    });
    onPress(item.id);
  };

  return (
    <AnimatedTouchable
      style={[styles.container, isSelected && styles.selectedContainer, animatedStyle]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <MaterialCommunityIcons
        name={item.icon}
        size={15}
        color={isSelected ? COLORS2.card : COLORS2.primary}
        style={styles.icon}
      />
      <Text style={[styles.label, isSelected && styles.selectedLabel]}>{item.label}</Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS2.card,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
    marginRight: 8,
  },
  selectedContainer: {
    backgroundColor: COLORS2.primary,
    borderColor: COLORS2.primary,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS2.primary,
    letterSpacing: 0.1,
  },
  selectedLabel: {
    color: COLORS2.card,
  },
});

export default CategoryItem;
