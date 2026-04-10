import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FadeInCard from './FadeInCard';
import { COLORS2 } from '../../../constant/theme';

// Generate next 7 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    dates.push({
      label: `${dayName}, ${dateStr}`,
      value: date.toISOString().split('T')[0],
      date: date
    });
  }
  
  return dates;
};

// Generate time slots (9 AM to 6 PM, every 2 hours)
const generateTimeSlots = () => {
  const times = [];
  for (let hour = 9; hour <= 18; hour += 2) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    times.push({
      label: `${displayHour}:00 ${period}`,
      value: `${String(hour).padStart(2, '0')}:00`
    });
  }
  return times;
};

export default function DaycareBookingSection({ selectedPlan, selectedPlanPrice, onBook, delay = 420 }) {
  const scale = useRef(new Animated.Value(1)).current;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dates] = useState(generateDates());
  const [times] = useState(generateTimeSlots());

  const handlePressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  const handleBook = () => {
    if (!selectedPlan) {
      Alert.alert('No Plan Selected', 'Please select a plan from the Available Plans section above.');
      return;
    }
    if (!selectedDate || !selectedTime) {
      Alert.alert('Incomplete Booking', 'Please select a date and drop-off time before booking.');
      return;
    }
    
    const selectedDateObj = dates.find(d => d.value === selectedDate);
    const selectedTimeObj = times.find(t => t.value === selectedTime);
    
    Alert.alert(
      'Booking Confirmed! 🐾',
      `Plan: ${selectedPlan}\nPrice: ₹${selectedPlanPrice?.toLocaleString('en-IN') || 'N/A'}\nDate: ${selectedDateObj?.label}\nDrop-off: ${selectedTimeObj?.label}`,
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

      {/* Price Display */}
      {selectedPlanPrice && (
        <View style={[styles.infoRow, { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' }]}>
          <MaterialCommunityIcons name="currency-inr" size={16} color="#4CAF50" />
          <Text style={[styles.infoLabel, { color: '#4CAF50' }]}>Price</Text>
          <Text style={[styles.infoValue, { color: '#2E7D32', fontWeight: '700' }]}>
            ₹{selectedPlanPrice.toLocaleString('en-IN')}
          </Text>
        </View>
      )}

      {/* Date picker */}
      <Text style={styles.fieldTitle}>Select Date</Text>
      <View style={styles.pillRow}>
        {dates.map(d => (
          <TouchableOpacity
            key={d.value}
            style={[styles.pill, selectedDate === d.value && styles.pillActive]}
            onPress={() => setSelectedDate(d.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillText, selectedDate === d.value && styles.pillTextActive]}>
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Time picker */}
      <Text style={styles.fieldTitle}>Drop-off Time</Text>
      <View style={styles.pillRow}>
        {times.map(t => (
          <TouchableOpacity
            key={t.value}
            style={[styles.pill, selectedTime === t.value && styles.pillActive]}
            onPress={() => setSelectedTime(t.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillText, selectedTime === t.value && styles.pillTextActive]}>
              {t.label}
            </Text>
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
          style={[styles.ctaBtn, !selectedPlan && styles.ctaBtnDisabled]}
          disabled={!selectedPlan}
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
    marginBottom: 12,
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
    marginTop: 8,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    fontSize: 11.5,
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
    marginTop: 8,
  },
  ctaBtnDisabled: {
    backgroundColor: COLORS2.subtext,
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
