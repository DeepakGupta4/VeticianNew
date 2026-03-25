// components/appointments/BookingForm.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';
import { SERVICES, PETS } from './data';
import ServiceSelector from './ServiceSelector';
import PetSelector     from './PetSelector';
import DateTimePicker  from './DateTimePicker';

/**
 * BookingForm
 * Handles all booking form state locally.
 * Calls onBookingConfirmed(newAppointment) when the user confirms —
 * the parent is responsible for adding it to the shared list and
 * showing the success toast.
 *
 * Props:
 *   onBookingConfirmed — (appointment: object) => void
 */
export default function BookingForm({ onBookingConfirmed }) {
  const [service, setService] = useState(null);
  const [pet,     setPet    ] = useState(null);
  const [date,    setDate   ] = useState(null);
  const [time,    setTime   ] = useState(null);
  const [notes,   setNotes  ] = useState('');

  const scaleAnim     = useRef(new Animated.Value(1)).current;
  const isFormComplete = !!(service && pet && date && time);

  /* ── Button press micro-animation ── */
  const handlePressIn  = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();

  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  /* ── Reset after successful booking ── */
  const resetForm = () => {
    setService(null);
    setPet(null);
    setDate(null);
    setTime(null);
    setNotes('');
  };

  /* ── Confirm booking ── */
  const handleConfirm = () => {
    if (!isFormComplete) return;

    const serviceObj = SERVICES.find((s) => s.id === service);
    const petObj     = PETS.find((p) => p.id === pet);

    const newAppointment = {
      id:          `appt_${Date.now()}`,
      service:     serviceObj.label,
      serviceIcon: serviceObj.icon,
      pet:         petObj.name,
      petIcon:     petObj.icon,
      date,
      time,
      status:      'upcoming',
      address:     '24 Green Paws Clinic, MG Road',
      assignedTo:  'Dr. Priya Sharma',
      notes:       notes.trim(),
    };

    onBookingConfirmed(newAppointment);
    resetForm();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <ServiceSelector selected={service} onSelect={setService} />

      <View style={styles.divider} />

      <PetSelector selected={pet} onSelect={setPet} />

      <View style={styles.divider} />

      <DateTimePicker
        selectedDate={date}
        selectedTime={time}
        onDateChange={setDate}
        onTimeChange={setTime}
      />

      <View style={styles.divider} />

      {/* Notes */}
      <View style={styles.notesSection}>
        <Text style={styles.label}>Add Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="e.g. Allergic to certain medications..."
          placeholderTextColor={COLORS2.shadow}
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
      </View>

      {/* Confirm CTA */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            !isFormComplete && styles.confirmBtnDisabled,
          ]}
          onPress={handleConfirm}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          disabled={!isFormComplete}
        >
          <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
          <Text style={styles.confirmText}>Confirm Appointment</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:       20,
    paddingBottom: 40,
  },
  divider: {
    height:          1,
    backgroundColor: COLORS2.border,
    marginBottom:    22,
  },
  notesSection: {
    marginBottom: 22,
  },
  label: {
    fontSize:      13,
    fontWeight:    '600',
    color:         COLORS2.subtext,
    marginBottom:  12,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  notesInput: {
    backgroundColor: COLORS2.card,
    borderRadius:    14,
    borderWidth:     1.5,
    borderColor:     COLORS2.border,
    padding:         14,
    fontSize:        14,
    color:           COLORS2.text,
    minHeight:       90,
  },
  confirmBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: COLORS2.primary,
    borderRadius:    16,
    paddingVertical: 16,
    gap:              8,
    shadowColor:     COLORS2.primary,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.3,
    shadowRadius:    10,
    elevation:       6,
    marginTop:        8,
  },
  confirmBtnDisabled: {
    backgroundColor: COLORS2.shadow,
    shadowOpacity:   0,
    elevation:       0,
  },
  confirmText: {
    fontSize:      16,
    fontWeight:    '700',
    color:         '#FFFFFF',
    letterSpacing: 0.3,
  },
  bottomSpacer: {
    height: 20,
  },
});
