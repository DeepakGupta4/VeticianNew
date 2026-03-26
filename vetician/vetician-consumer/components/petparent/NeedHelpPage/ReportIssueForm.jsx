// components/needhelp/ReportIssueForm.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

const ISSUE_TYPES = [
  'App Not Loading',
  'Payment Issue',
  'Booking Issue',
  'Location Issue',
  'Vet Connection Issue',
  'Account Issue',
  'Other',
];

export default function ReportIssueForm() {
  const [selectedType, setSelectedType] = useState(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showTypes, setShowTypes] = useState(false);

  const handleSubmit = () => {
    if (!selectedType) {
      Alert.alert('Select Issue', 'Please select an issue type before submitting.');
      return;
    }
    if (message.trim().length < 10) {
      Alert.alert('Add Details', 'Please describe your issue in at least 10 characters.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedType(null);
      setMessage('');
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Report an Issue</Text>
        <View style={styles.dot} />
        <Text style={styles.sectionSub}>Tell us what went wrong</Text>
      </View>

      <View style={styles.card}>
        {submitted ? (
          <View style={styles.successBox}>
            <View style={styles.successIcon}>
              <MaterialIcons name="check-circle" size={40} color={COLORS2.primary} />
            </View>
            <Text style={styles.successTitle}>Report Submitted!</Text>
            <Text style={styles.successText}>
              We've received your report. Our team will reach out within 24 hours.
            </Text>
            <Text style={styles.ticketLabel}>Ticket ID: #VT-{Math.floor(1000 + Math.random() * 9000)}</Text>
          </View>
        ) : (
          <>
            {/* Issue Type Selector */}
            <Text style={styles.fieldLabel}>Issue Type *</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowTypes(!showTypes)}
              activeOpacity={0.8}
            >
              <Text style={[styles.selectorText, !selectedType && { color: COLORS2.subtext }]}>
                {selectedType || 'Select issue type...'}
              </Text>
              <MaterialIcons
                name={showTypes ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={20}
                color={COLORS2.subtext}
              />
            </TouchableOpacity>

            {showTypes && (
              <View style={styles.dropdown}>
                {ISSUE_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.dropdownItem,
                      selectedType === type && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setSelectedType(type);
                      setShowTypes(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        selectedType === type && styles.dropdownTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                    {selectedType === type && (
                      <MaterialIcons name="check" size={16} color={COLORS2.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Message */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Describe Your Issue *</Text>
            <TextInput
              style={styles.textArea}
              value={message}
              onChangeText={setMessage}
              placeholder="Explain your issue in detail... (minimum 10 characters)"
              placeholderTextColor={COLORS2.subtext}
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{message.length}/500</Text>

            {/* Submit */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!selectedType || message.trim().length < 10) && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <MaterialIcons name="send" size={16} color="#fff" />
              <Text style={styles.submitBtnText}>Submit Report</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS2.text,
    letterSpacing: -0.2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS2.secondary,
    marginHorizontal: 8,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS2.subtext,
  },
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS2.border,
    shadowColor: COLORS2.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS2.text,
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS2.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: COLORS2.bg,
  },
  selectorText: {
    fontSize: 14,
    color: COLORS2.text,
    fontWeight: '500',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS2.border,
    borderRadius: 12,
    marginTop: 6,
    overflow: 'hidden',
    backgroundColor: COLORS2.card,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS2.border,
  },
  dropdownItemActive: {
    backgroundColor: COLORS2.accent,
  },
  dropdownText: {
    fontSize: 14,
    color: COLORS2.text,
  },
  dropdownTextActive: {
    color: COLORS2.primary,
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS2.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS2.text,
    backgroundColor: COLORS2.bg,
    minHeight: 100,
  },
  charCount: {
    fontSize: 11,
    color: COLORS2.subtext,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 4,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS2.secondary,
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 10,
    gap: 8,
    shadowColor: COLORS2.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitBtnDisabled: {
    backgroundColor: COLORS2.subtext,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS2.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS2.text,
    marginBottom: 8,
  },
  successText: {
    fontSize: 13,
    color: COLORS2.subtext,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 12,
  },
  ticketLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS2.primary,
    backgroundColor: COLORS2.accent,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
