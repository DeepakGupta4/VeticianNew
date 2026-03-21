import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FadeInCard from './FadeInCard';
import { COLORS2 } from '../../../constant/theme';

const DATES = ['Today', 'Tomorrow', 'This Week'];
const TIMES = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'];

export default function DaycareBookingSection({ selectedPlan, onBook, delay = 420 }) {
  const scale = useRef(new Animated.Value(1)).current;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handlePressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Incomplete Booking', 'Please select a date and drop-off time before booking.');
      return;
    }
    Alert.alert(
      'Booking Confirmed! 🐾',
      `Plan: ${selectedPlan || 'Not selected'}\nDate: ${selectedDate}\nDrop-off: ${selectedTime}`,
      [{ text: 'OK', onPress: onBook }]
    );
  };

  return (
    <FadeInCard delay={delay} style={styles.card}>
      <Text style={styles.title}>Book Your Slot</Text>

      {/* Selected Plan */}
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="card-text-outline" size={16} color={COLORS2.primary} />
        <Text style={styles.infoLabel}>Plan</Text>
        <Text style={styles.infoValue}>{selectedPlan || 'No plan selected'}</Text>
      </View>

      {/* Date picker */}
      <Text style={styles.fieldTitle}>Select Date</Text>
      <View style={styles.pillRow}>
        {DATES.map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.pill, selectedDate === d && styles.pillActive]}
            onPress={() => setSelectedDate(d)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillText, selectedDate === d && styles.pillTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Time picker */}
      <Text style={styles.fieldTitle}>Drop-off Time</Text>
      <View style={styles.pillRow}>
        {TIMES.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.pill, selectedTime === t && styles.pillActive]}
            onPress={() => setSelectedTime(t)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillText, selectedTime === t && styles.pillTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          onPress={handleBook}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          style={styles.ctaBtn}
        >
          <MaterialCommunityIcons name="paw" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.ctaText}>Book Day Care Slot</Text>
        </TouchableOpacity>
      </Animated.View>
    </FadeInCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS2.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS2.card,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS2.primary,
    marginLeft: 7,
    marginRight: 6,
  },
  infoValue: {
    fontSize: 12,
    color: COLORS2.text,
    fontWeight: '500',
    flex: 1,
  },
  fieldTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS2.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS2.card,
    borderWidth: 1.5,
    borderColor: COLORS2.border,
    marginRight: 8,
    marginBottom: 8,
  },
  pillActive: {
    backgroundColor: COLORS2.primary,
    borderColor: COLORS2.primary,
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS2.text,
  },
  pillTextActive: {
    color: '#fff',
  },
  ctaBtn: {
    backgroundColor: COLORS2.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: COLORS2.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  ctaText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
