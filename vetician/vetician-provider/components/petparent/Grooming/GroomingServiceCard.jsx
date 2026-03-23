import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS } from '../../../constant/theme2';

const GroomingServiceCard = ({ service, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn  = () => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress?.(service)}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={1}
      >
        <View style={styles.iconBox}>
          <Icon name={service.icon} size={24} color={COLORS.primary} />
        </View>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.desc}>{service.desc}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: '48%', marginBottom: 12 },
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.card,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    minHeight: 110,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 3,
    lineHeight: 17,
  },
  desc: {
    fontSize: FONT.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 15,
  },
});

export default GroomingServiceCard;
