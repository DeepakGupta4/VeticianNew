// components/petparent/Vaccination/DatePickerDrawer.jsx
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 as COLORS } from '../../../constant/theme';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

/**
 * DatePickerDrawer
 * Props:
 *   visible    – boolean
 *   value      – Date
 *   minDate    – Date (optional, defaults to today)
 *   onClose    – () => void
 *   onConfirm  – (date: Date) => void
 */
export default function DatePickerDrawer({ visible, value, minDate, onClose, onConfirm }) {
  const today   = minDate ?? new Date();
  const initial = value instanceof Date && !isNaN(value) ? value : today;

  const [viewYear,  setViewYear]  = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [selected,  setSelected]  = useState(initial);

  const cells = buildCalendar(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const isPast = (day) => {
    if (!day) return false;
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date(today);
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const isSelected = (day) =>
    day &&
    selected.getDate()     === day &&
    selected.getMonth()    === viewMonth &&
    selected.getFullYear() === viewYear;

  const isToday = (day) => {
    const t = new Date();
    return day &&
      t.getDate()     === day &&
      t.getMonth()    === viewMonth &&
      t.getFullYear() === viewYear;
  };

  const handleDay = (day) => {
    if (!day || isPast(day)) return;
    const d = new Date(selected);
    d.setFullYear(viewYear);
    d.setMonth(viewMonth);
    d.setDate(day);
    setSelected(d);
  };

  const handleConfirm = () => onConfirm(selected);

  const fmt = (d) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity style={s.overlay} onPress={onClose} activeOpacity={1}>
        <TouchableOpacity activeOpacity={1} style={s.sheet}>
          {/* Handle */}
          <View style={s.handle} />

          {/* Header */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <View style={s.headerIcon}>
                <MaterialIcons name="calendar-today" size={18} color={COLORS.primary} />
              </View>
              <View>
                <Text style={s.headerTitle}>Select Date</Text>
                <Text style={s.headerSub}>{fmt(selected)}</Text>
              </View>
            </View>
            <TouchableOpacity style={s.closeBtn} onPress={onClose}>
              <MaterialIcons name="close" size={18} color={COLORS.subtext} />
            </TouchableOpacity>
          </View>

          {/* Month nav */}
          <View style={s.monthNav}>
            <TouchableOpacity style={s.navBtn} onPress={prevMonth}>
              <MaterialIcons name="chevron-left" size={22} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={s.monthLabel}>{MONTHS[viewMonth]} {viewYear}</Text>
            <TouchableOpacity style={s.navBtn} onPress={nextMonth}>
              <MaterialIcons name="chevron-right" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Day headers */}
          <View style={s.dayRow}>
            {DAYS.map((d) => (
              <Text key={d} style={s.dayHeader}>{d}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={s.grid}>
            {cells.map((day, i) => {
              const past = isPast(day);
              const sel  = isSelected(day);
              const tod  = isToday(day);
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    s.cell,
                    sel  && s.cellSelected,
                    tod  && !sel && s.cellToday,
                    (!day || past) && s.cellDisabled,
                  ]}
                  onPress={() => handleDay(day)}
                  activeOpacity={day && !past ? 0.7 : 1}
                >
                  {day ? (
                    <Text style={[
                      s.cellText,
                      sel  && s.cellTextSelected,
                      tod  && !sel && s.cellTextToday,
                      past && s.cellTextDisabled,
                    ]}>
                      {day}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Actions */}
          <View style={s.actions}>
            <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.confirmBtn} onPress={handleConfirm}>
              <MaterialIcons name="check" size={16} color={COLORS.white} />
              <Text style={s.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: Platform.OS === 'ios' ? 24 : 8 }} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const CELL = 40;

const s = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet:      { backgroundColor: COLORS.card, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 20, paddingTop: 0 },
  handle:     { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  headerTitle:{ fontSize: 15, fontWeight: '700', color: COLORS.text },
  headerSub:  { fontSize: 12, color: COLORS.subtext },
  closeBtn:   { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  monthNav:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  navBtn:     { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  monthLabel: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  dayRow:     { flexDirection: 'row', marginBottom: 6 },
  dayHeader:  { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: COLORS.subtext },
  grid:       { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 18 },
  cell:       { width: `${100 / 7}%`, height: CELL, alignItems: 'center', justifyContent: 'center' },
  cellSelected:      { backgroundColor: COLORS.primary, borderRadius: 10 },
  cellToday:         { borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 10 },
  cellDisabled:      { opacity: 0.3 },
  cellText:          { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  cellTextSelected:  { color: COLORS.white, fontWeight: '700' },
  cellTextToday:     { color: COLORS.primary, fontWeight: '700' },
  cellTextDisabled:  { color: COLORS.subtext },
  actions:    { flexDirection: 'row', gap: 10 },
  cancelBtn:  { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 13, borderWidth: 1, borderColor: COLORS.border },
  cancelText: { fontSize: 14, fontWeight: '600', color: COLORS.subtext },
  confirmBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 13 },
  confirmText:{ fontSize: 14, fontWeight: '700', color: COLORS.white },
});
