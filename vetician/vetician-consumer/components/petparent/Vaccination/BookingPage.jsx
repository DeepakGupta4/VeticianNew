// vaccination/components/BookingPage.jsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS2 as COLORS } from '../../../constant/theme';
import DatePickerDrawer from './DatePickerDrawer';
import TimePickerDrawer from './TimePickerDrawer';

const VACCINE_LIST = [
  'Rabies', 'Parvovirus', 'Distemper', 'Leptospirosis',
  'Bordetella', 'Canine Influenza', 'Feline Leukemia',
];

const VETS = [
  { id: 1, name: 'Dr. Priya Sharma', clinic: 'Vetician Clinic, Koramangala' },
  { id: 2, name: 'Dr. Arjun Mehta',  clinic: 'PetCare Centre, Indiranagar'  },
  { id: 3, name: 'Dr. Sneha Reddy',  clinic: 'Animal Wellness, HSR Layout'  },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtDate(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function fmtDateDisplay(d) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtTime(d) {
  let h    = d.getHours();
  const m  = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${m} ${ap}`;
}

export default function BookingPage({ pet, onBack, onConfirm }) {
  const [step,          setStep]          = useState('form');
  const [vaccine,       setVaccine]       = useState(VACCINE_LIST[0]);
  const [vetIndex,      setVetIndex]      = useState(0);
  const [date,          setDate]          = useState(new Date());
  const [showDate,      setShowDate]      = useState(false);
  const [showTime,      setShowTime]      = useState(false);
  const [notes,         setNotes]         = useState('');
  const [vaccineOpen,   setVaccineOpen]   = useState(false);
  const [pendingRecord, setPendingRecord] = useState(null);

  const vet = VETS[vetIndex];

  const handleConfirm = () => {
    const record = {
      id:     Date.now(),
      name:   vaccine,
      date:   fmtDate(date),
      time:   fmtTime(date),
      doctor: vet.name,
      clinic: vet.clinic,
      notes:  notes.trim() || `Booked via Vetician. Administered by ${vet.name} at ${vet.clinic}.`,
    };
    setPendingRecord(record);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <SuccessPage
        vaccine={vaccine}
        vet={vet}
        date={fmtDateDisplay(date)}
        time={fmtTime(date)}
        onBack={() => onConfirm(pendingRecord)}
      />
    );
  }

  const isEmoji = (str) => typeof str === 'string' && /\p{Emoji}/u.test(str);
  const petIcon  = pet?.avatar ?? pet?.icon ?? 'paw';

  return (
    <>
      <View style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Book Appointment</Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              Schedule vaccination for {pet?.name}
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialIcons name="local-hospital" size={22} color={COLORS.primary} />
          </View>
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Pet card */}
          <View style={styles.petCard}>
            <View style={styles.petAvatarWrap}>
              {isEmoji(petIcon) ? (
                <Text style={styles.petEmoji}>{petIcon}</Text>
              ) : (
                <MaterialCommunityIcons name={petIcon} size={28} color={COLORS.primary} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.petName}>{pet?.name}</Text>
              <Text style={styles.petBreed}>{pet?.breed} · {pet?.age}</Text>
            </View>
            <View style={styles.petBadge}>
              <MaterialIcons name="verified" size={14} color={COLORS.primary} />
              <Text style={styles.petBadgeText}>Active</Text>
            </View>
          </View>

          {/* Vaccine selector */}
          <Text style={styles.fieldLabel}>Select Vaccine</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setVaccineOpen((o) => !o)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="vaccines" size={18} color={COLORS.primary} />
            <Text style={styles.dropdownText}>{vaccine}</Text>
            <MaterialIcons
              name={vaccineOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={20}
              color={COLORS.subtext}
            />
          </TouchableOpacity>
          {vaccineOpen && (
            <View style={styles.dropdownList}>
              {VACCINE_LIST.map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.dropdownItem, vaccine === v && styles.dropdownItemActive]}
                  onPress={() => { setVaccine(v); setVaccineOpen(false); }}
                >
                  <Text style={[styles.dropdownItemText, vaccine === v && styles.dropdownItemTextActive]}>
                    {v}
                  </Text>
                  {vaccine === v && <Ionicons name="checkmark" size={15} color={COLORS.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Vet selector */}
          <Text style={styles.fieldLabel}>Choose Veterinarian</Text>
          {VETS.map((v, i) => (
            <TouchableOpacity
              key={v.id}
              style={[styles.vetCard, vetIndex === i && styles.vetCardActive]}
              onPress={() => setVetIndex(i)}
              activeOpacity={0.8}
            >
              <View style={[styles.vetAvatar, vetIndex === i && styles.vetAvatarActive]}>
                <MaterialIcons name="person" size={20} color={vetIndex === i ? COLORS.white : COLORS.subtext} />
              </View>
              <View style={styles.vetInfo}>
                <Text style={styles.vetName}>{v.name}</Text>
                <View style={styles.clinicRow}>
                  <MaterialIcons name="local-hospital" size={12} color={COLORS.subtext} />
                  <Text style={styles.clinicText}>{v.clinic}</Text>
                </View>
              </View>
              {vetIndex === i && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
            </TouchableOpacity>
          ))}

          {/* Date picker field */}
          <Text style={styles.fieldLabel}>Select Date</Text>
          <TouchableOpacity
            style={styles.pickerRow}
            onPress={() => setShowDate(true)}
            activeOpacity={0.8}
          >
            <View style={styles.pickerIconWrap}>
              <MaterialIcons name="calendar-today" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.pickerTextBlock}>
              <Text style={styles.pickerLabel}>Date</Text>
              <Text style={styles.pickerValue}>{fmtDateDisplay(date)}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.subtext} />
          </TouchableOpacity>

          {/* Time picker field */}
          <Text style={styles.fieldLabel}>Select Time</Text>
          <TouchableOpacity
            style={styles.pickerRow}
            onPress={() => setShowTime(true)}
            activeOpacity={0.8}
          >
            <View style={styles.pickerIconWrap}>
              <MaterialIcons name="schedule" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.pickerTextBlock}>
              <Text style={styles.pickerLabel}>Time</Text>
              <Text style={styles.pickerValue}>{fmtTime(date)}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.subtext} />
          </TouchableOpacity>

          {/* Notes */}
          <Text style={styles.fieldLabel}>Notes (optional)</Text>
          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special requirements or concerns..."
            placeholderTextColor={COLORS.subtext}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Confirm */}
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.confirmGradient}
            >
              <MaterialIcons name="check-circle" size={20} color={COLORS.white} />
              <Text style={styles.confirmText}>Confirm Booking</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>

      <DatePickerDrawer
        visible={showDate}
        value={date}
        minDate={new Date()}
        onClose={() => setShowDate(false)}
        onConfirm={(d) => { setDate(d); setShowDate(false); }}
      />

      <TimePickerDrawer
        visible={showTime}
        value={date}
        onClose={() => setShowTime(false)}
        onConfirm={(d) => { setDate(d); setShowTime(false); }}
      />
    </>
  );
}

function SuccessPage({ vaccine, vet, date, time, onBack }) {
  return (
    <View style={styles.successPage}>
      <View style={styles.successIconWrap}>
        <Ionicons name="checkmark-circle" size={72} color={COLORS.primary} />
      </View>
      <Text style={styles.successTitle}>Appointment Booked!</Text>
      <Text style={styles.successSub}>Your vaccination appointment has been confirmed.</Text>

      <View style={styles.successCard}>
        {[
          { icon: 'vaccines',       label: 'Vaccine', value: vaccine    },
          { icon: 'person',         label: 'Doctor',  value: vet.name   },
          { icon: 'local-hospital', label: 'Clinic',  value: vet.clinic },
          { icon: 'calendar-today', label: 'Date',    value: date       },
          { icon: 'schedule',       label: 'Time',    value: time       },
        ].map((row) => (
          <View key={row.label} style={styles.successRow}>
            <View style={styles.successRowLeft}>
              <MaterialIcons name={row.icon} size={15} color={COLORS.subtext} />
              <Text style={styles.successLabel}>{row.label}</Text>
            </View>
            <Text style={styles.successValue} numberOfLines={1}>{row.value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.backToVaccBtn} onPress={onBack} activeOpacity={0.85}>
        <MaterialIcons name="arrow-back" size={18} color={COLORS.white} />
        <Text style={styles.backToVaccText}>Back to Vaccination</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page:            { flex: 1, backgroundColor: COLORS.bg },
  header:          { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 10 },
  backBtn:         { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 },
  headerText:      { flex: 1, gap: 2 },
  headerTitle:     { fontSize: 20, fontWeight: '800', color: COLORS.text },
  headerSub:       { fontSize: 12, color: COLORS.subtext },
  headerIcon:      { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  body:            { flex: 1 },
  bodyContent:     { paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  petCard:         { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1.5, borderColor: COLORS.border, padding: 14, gap: 12, marginBottom: 4 },
  petAvatarWrap:   { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  petEmoji:        { fontSize: 26 },
  petName:         { fontSize: 15, fontWeight: '700', color: COLORS.text },
  petBreed:        { fontSize: 12, color: COLORS.subtext },
  petBadge:        { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.accent, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8 },
  petBadgeText:    { fontSize: 11, fontWeight: '600', color: COLORS.primary },
  fieldLabel:      { fontSize: 11, fontWeight: '700', color: COLORS.subtext, marginTop: 4, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  dropdown:        { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.accent, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border, paddingVertical: 12, paddingHorizontal: 14 },
  dropdownText:    { flex: 1, fontSize: 14, color: COLORS.text, fontWeight: '500' },
  dropdownList:    { backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginTop: -6 },
  dropdownItem:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dropdownItemActive:     { backgroundColor: COLORS.accent },
  dropdownItemText:       { fontSize: 13, color: COLORS.text },
  dropdownItemTextActive: { fontWeight: '700', color: COLORS.primary },
  vetCard:         { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.border, padding: 12 },
  vetCardActive:   { borderColor: COLORS.primary, backgroundColor: COLORS.card },
  vetAvatar:       { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  vetAvatarActive: { backgroundColor: COLORS.primary },
  vetInfo:         { flex: 1, gap: 3 },
  vetName:         { fontSize: 13, fontWeight: '700', color: COLORS.text },
  clinicRow:       { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clinicText:      { fontSize: 11, color: COLORS.subtext },
  pickerRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.border, paddingVertical: 12, paddingHorizontal: 14 },
  pickerIconWrap:  { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  pickerTextBlock: { flex: 1 },
  pickerLabel:     { fontSize: 10, color: COLORS.subtext, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  pickerValue:     { fontSize: 14, color: COLORS.text, fontWeight: '700', marginTop: 1 },
  textArea:        { backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border, padding: 14, fontSize: 14, color: COLORS.text, minHeight: 90, fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto' },
  confirmBtn:      { borderRadius: 14, overflow: 'hidden', marginTop: 6, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 5 },
  confirmGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingVertical: 15 },
  confirmText:     { fontSize: 16, fontWeight: '800', color: COLORS.white },
  successPage:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14, backgroundColor: COLORS.bg },
  successIconWrap: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.border, marginBottom: 4 },
  successTitle:    { fontSize: 22, fontWeight: '800', color: COLORS.text },
  successSub:      { fontSize: 14, color: COLORS.subtext, textAlign: 'center', lineHeight: 20 },
  successCard:     { width: '100%', backgroundColor: COLORS.card, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  successRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  successRowLeft:  { flexDirection: 'row', alignItems: 'center', gap: 7 },
  successLabel:    { fontSize: 13, color: COLORS.subtext },
  successValue:    { fontSize: 13, fontWeight: '600', color: COLORS.text, maxWidth: '55%', textAlign: 'right' },
  backToVaccBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28, marginTop: 4, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  backToVaccText:  { fontSize: 15, fontWeight: '700', color: COLORS.white },
});
