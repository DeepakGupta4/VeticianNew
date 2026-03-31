import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

const CATEGORY_ICONS = {
  '1': 'dog',
  '2': 'cat',
  '3': 'bird',
  '4': 'snake',
  '5': 'whistle',
  '6': 'heart-pulse',
};

export default function CategoryItem({ item, selected, onPress }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const icon = CATEGORY_ICONS[item.id] || 'paw';

  const handlePress = () => {
    scale.value = withSpring(0.9, {}, () => { scale.value = withSpring(1); });
    onPress(item.id);
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[styles.chip, selected && styles.chipSelected]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
          <MaterialCommunityIcons
            name={icon}
            size={14}
            color={selected ? '#fff' : COLORS2.primary}
          />
        </View>
        <Text style={[styles.label, selected && styles.labelSelected]}>{item.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS2.card, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7,
    marginRight: 8, borderWidth: 1.5, borderColor: COLORS2.border, gap: 6,
  },
  chipSelected: { backgroundColor: COLORS2.primary, borderColor: COLORS2.primary },
  iconWrap: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: COLORS2.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  iconWrapSelected: { backgroundColor: 'rgba(255,255,255,0.25)' },
  label: { fontSize: 12.5, fontWeight: '700', color: COLORS2.text },
  labelSelected: { color: '#fff' },
});
