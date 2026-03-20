// components/TrainingBookingSection.js
// Vatecian App — Booking form section

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Platform, Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../../constant/theme';
import { TRAINING_CATEGORIES, TRAINERS, TIME_SLOTS } from '../../../constant/trainingData';

const PickerRow = ({ label, value, options, onChange, icon }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.pickerBlock}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setOpen(!open)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name={icon} size={18} color={COLORS.textPrimary} />
        <Text style={styles.selectorText}>{value || `Select ${label}`}</Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={COLORS.textMuted}
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.dropdownItem, value === opt && styles.dropdownItemActive]}
              onPress={() => { onChange(opt); setOpen(false); }}
            >
              <Text style={[styles.dropdownText, value === opt && styles.dropdownTextActive]}>
                {opt}
              </Text>
              {value === opt && (
                <MaterialCommunityIcons name="check" size={14} color={COLORS.primaryGreen} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const TrainingBookingSection = () => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const trainingNames = TRAINING_CATEGORIES.map((c) => c.name);

  const handleBook = () => {
    if (!selectedType || !selectedTrainer || !selectedTime) {
      Alert.alert('Incomplete', 'Please fill in all fields before booking.');
      return;
    }
    Alert.alert(
      'Session Booked!',
      `${selectedType} with ${selectedTrainer} at ${selectedTime}`,
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="calendar-check" size={20} color={COLORS.textPrimary} />
        <Text style={styles.cardTitle}>Book a Training Session</Text>
      </View>
      <Text style={styles.subtitle}>Fill in the details below to schedule your session.</Text>

      <View style={styles.divider} />

      <PickerRow
        label="Training Type"
        value={selectedType}
        options={trainingNames}
        onChange={setSelectedType}
        icon="paw"
      />
      <PickerRow
        label="Trainer"
        value={selectedTrainer}
        options={TRAINERS}
        onChange={setSelectedTrainer}
        icon="account-tie"
      />
      <PickerRow
        label="Time Slot"
        value={selectedTime}
        options={TIME_SLOTS}
        onChange={setSelectedTime}
        icon="clock-outline"
      />

      <TouchableOpacity style={styles.bookButton} onPress={handleBook} activeOpacity={0.88}>
        <MaterialCommunityIcons name="calendar-plus" size={20} color={COLORS.white} />
        <Text style={styles.bookButtonText}>Book Training Session</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  pickerBlock: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    gap: 8,
  },
  selectorText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemActive: {
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryGreen,
  },
  dropdownText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  dropdownTextActive: {
    color: COLORS.primaryGreen,
    fontWeight: '700',
  },
  bookButton: {
    backgroundColor: COLORS.primaryGreen,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
    marginTop: 4,
    ...SHADOWS.card,
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default TrainingBookingSection;
