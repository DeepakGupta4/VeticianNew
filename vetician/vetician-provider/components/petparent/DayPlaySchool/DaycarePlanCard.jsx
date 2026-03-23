import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import FadeInCard from './FadeInCard';
import { COLORS2 } from '../../../constant/theme';

export default function DaycarePlanCard({ plan, isSelected, onSelect, onBook, delay = 0 }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <FadeInCard delay={delay} style={styles.wrap}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          onPress={onSelect}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={[styles.card, isSelected && styles.cardActive]}
        >
          <View style={styles.topRow}>
            <Text style={[styles.name, isSelected && styles.nameActive]}>{plan.name}</Text>
            <Text style={styles.price}>{plan.price}</Text>
          </View>
          <Text style={styles.duration}>{plan.duration}</Text>
          <Text style={styles.desc}>{plan.desc}</Text>
          {isSelected && (
            <TouchableOpacity onPress={onBook} style={styles.bookBtn} activeOpacity={0.85}>
              <Text style={styles.bookBtnText}>Book Slot</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Animated.View>
    </FadeInCard>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
    shadowColor: COLORS2.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardActive: {
    borderColor: COLORS2.primary,
    backgroundColor: COLORS2.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS2.text,
    flex: 1,
    marginRight: 8,
  },
  nameActive: {
    color: COLORS2.primary,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS2.primary,
  },
  duration: {
    fontSize: 12,
    color: COLORS2.secondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12.5,
    color: COLORS2.subtext,
    lineHeight: 18,
  },
  bookBtn: {
    marginTop: 14,
    backgroundColor: COLORS2.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13.5,
  },
});
