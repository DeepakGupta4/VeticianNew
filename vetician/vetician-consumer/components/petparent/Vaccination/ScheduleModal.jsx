// vaccination/components/ScheduleModal.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet, Platform, ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 as COLORS } from '../../../constant/theme';
import DatePickerDrawer from './DatePickerDrawer';
import TimePickerDrawer from './TimePickerDrawer';

/**
 * ScheduleModal
 * Props:
 *   visible   – boolean
 *   vaccine   – UpcomingVaccine | null
 *   onClose   – () => void
 *   onConfirm – (id, formattedDateTime: string) => void
 */
export default function ScheduleModal({ visible, vaccine, onClose, onConfirm }) {
  const [date,      setDate]      = useState(new Date());
  const [showDate,  setShowDate]  = useState(false);
  const [showTime,  setShowTime]  = useState(false);

  useEffect(() => {
    if (vaccine) {
      setDate(new Date());
      setShowDate(false);
      setShowTime(false);
    }
  }, [vaccine?.id]);

  if (!vaccine) return null;

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const fmtDate = (d) =>
    `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

  const fmtTime = (d) => {
    let h = d.getHours();
    const m   = String(d.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
  };

  const fmtFull = (d) => `${fmtDate(d)} at ${fmtTime(d)}`;

  const handleConfirm = () => onConfirm(vaccine.id, fmtFull(date));

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
          <TouchableOpacity activeOpacity={1} style={styles.sheet}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* Handle */}
              <View style={styles.handle} />

              {/* Header */}
              <View style={styles.sheetHeader}>
                <View style={styles.headerLeft}>
                  <View style={styles.headerIcon}>
                    <MaterialIcons name="event" size={20} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.sheetTitle}>Schedule Appointment</Text>
                    <Text style={styles.sheetSub}>{vaccine.name}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose} accessibilityRole="button">
                  <MaterialIcons name="close" size={18} color={COLORS.subtext} />
                </TouchableOpacity>
              </View>

              {/* Pet row */}
              <View style={styles.petRow}>
                <MaterialIcons name="pets" size={14} color={COLORS.primary} />
                <Text style={styles.petText}>For: {vaccine.petName}</Text>
              </View>

              {/* Date field */}
              <Text style={styles.fieldLabel}>Select Date</Text>
              <TouchableOpacity
                style={styles.pickerRow}
                onPress={() => setShowDate(true)}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <View style={styles.pickerIconWrap}>
                  <MaterialIcons name="calendar-today" size={18} color={COLORS.primary} />
                </View>
                <View style={styles.pickerTextBlock}>
                  <Text style={styles.pickerLabel}>Date</Text>
                  <Text style={styles.pickerValue}>{fmtDate(date)}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={COLORS.subtext} />
              </TouchableOpacity>

              {/* Time field */}
              <Text style={styles.fieldLabel}>Select Time</Text>
              <TouchableOpacity
                style={styles.pickerRow}
                onPress={() => setShowTime(true)}
                activeOpacity={0.8}
                accessibilityRole="button"
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

              {/* Summary */}
              <View style={styles.summaryBox}>
                <MaterialIcons name="event-available" size={15} color={COLORS.primary} />
                <Text style={styles.summaryText}>{fmtFull(date)}</Text>
              </View>

              {/* Confirm */}
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirm}
                activeOpacity={0.85}
                accessibilityRole="button"
              >
                <MaterialIcons name="check" size={18} color={COLORS.white} />
                <Text style={styles.confirmText}>Confirm Schedule</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <View style={{ height: 8 }} />
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

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

const styles = StyleSheet.create({
  overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet:       { backgroundColor: COLORS.card, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, maxHeight: '85%' },
  handle:      { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  headerLeft:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon:  { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  sheetTitle:  { fontSize: 16, fontWeight: '700', color: COLORS.text },
  sheetSub:    { fontSize: 12, color: COLORS.subtext },
  closeBtn:    { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  petRow:      { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.card, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 14 },
  petText:     { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  fieldLabel:  { fontSize: 11, fontWeight: '700', color: COLORS.subtext, marginBottom: 6, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  pickerRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.border, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 12 },
  pickerIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  pickerTextBlock:{ flex: 1 },
  pickerLabel: { fontSize: 10, color: COLORS.subtext, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  pickerValue: { fontSize: 14, color: COLORS.text, fontWeight: '700', marginTop: 1 },
  summaryBox:  { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.accent, borderRadius: 12, padding: 12, marginVertical: 12, borderWidth: 1, borderColor: COLORS.border },
  summaryText: { fontSize: 13, color: COLORS.primary, fontWeight: '700', flex: 1 },
  confirmBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14, marginBottom: 10 },
  confirmText: { fontSize: 15, fontWeight: '800', color: COLORS.white },
  cancelBtn:   { alignItems: 'center', backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border },
  cancelText:  { fontSize: 14, fontWeight: '600', color: COLORS.subtext },
});
