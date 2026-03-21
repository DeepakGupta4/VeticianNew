import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, Pressable, Platform } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '../../../constant/theme';
import { TIMES, fmtDate, fmtDay } from './hostelData';

export default function DateTimePicker({ checkin, checkout, nights, onCheckin, onCheckout }) {
  const [picker, setPicker]           = useState(null); // { field, step }
  const [pendingDate, setPendingDate] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const DAYS = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const openPicker = (field) => {
    setPendingDate(null);
    setPicker({ field, step: 'date' });
  };

  const selectDay = (day) => {
    if (picker.field === 'checkout' && checkin && day < checkin.date) {
      Alert.alert('Invalid date', 'Check-out must be on or after check-in.');
      return;
    }
    setPendingDate(day);
    setPicker({ ...picker, step: 'time' });
  };

  const selectTime = (time) => {
    const val = { date: pendingDate, time };
    if (picker.field === 'checkin') onCheckin(val);
    else onCheckout(val);
    setPicker(null);
    setPendingDate(null);
  };

  return (
    <>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.box, checkin && styles.boxFilled]}
          onPress={() => openPicker('checkin')}
          activeOpacity={0.8}
        >
          <View style={styles.boxHeader}>
            <Icon name="calendar-arrow-right" size={16} color="#1a1a1a" />
            <Text style={styles.boxLabel}>Check-in</Text>
          </View>
          {checkin ? (
            <>
              <Text style={styles.boxDate}>{fmtDate(checkin.date)}</Text>
              <View style={styles.timePill}>
                <Icon name="clock-outline" size={12} color="#1a1a1a" />
                <Text style={styles.timeVal}>{checkin.time}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.placeholder}>Tap to select</Text>
          )}
        </TouchableOpacity>

        <View style={styles.arrow}>
          <Icon name="arrow-right" size={18} color="#1a1a1a" />
          {nights > 0 && (
            <View style={styles.nightsBadge}>
              <Text style={styles.nightsTxt}>{nights}N</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.box, checkout && styles.boxFilled]}
          onPress={() => openPicker('checkout')}
          activeOpacity={0.8}
        >
          <View style={styles.boxHeader}>
            <Icon name="calendar-arrow-left" size={16} color="#1a1a1a" />
            <Text style={styles.boxLabel}>Check-out</Text>
          </View>
          {checkout ? (
            <>
              <Text style={styles.boxDate}>{fmtDate(checkout.date)}</Text>
              <View style={styles.timePill}>
                <Icon name="clock-outline" size={12} color="#1a1a1a" />
                <Text style={styles.timeVal}>{checkout.time}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.placeholder}>Tap to select</Text>
          )}
        </TouchableOpacity>
      </View>

      {nights > 0 && (
        <View style={styles.nightsRow}>
          <Icon name="moon-waning-crescent" size={14} color="#1a1a1a" />
          <Text style={styles.nightsRowTxt}>
            {nights} night{nights !== 1 ? 's' : ''} · {fmtDate(checkin.date)} → {fmtDate(checkout.date)}
          </Text>
        </View>
      )}

      <Modal visible={!!picker} transparent animationType="slide" onRequestClose={() => setPicker(null)}>
        <Pressable style={styles.overlay} onPress={() => setPicker(null)}>
          <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
            <View style={styles.handle} />

            {picker?.step === 'date' && (
              <>
                <Text style={styles.sheetTitle}>
                  {picker.field === 'checkin' ? 'Check-in Date' : 'Check-out Date'}
                </Text>
                <Text style={styles.sheetSub}>Choose from the next 14 days</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 14 }}>
                  <View style={styles.daysGrid}>
                    {DAYS.map((day, i) => {
                      const disabled = picker.field === 'checkout' && checkin && day < checkin.date;
                      const isToday  = day.toDateString() === today.toDateString();
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[styles.dayBtn, disabled && styles.dayBtnOff]}
                          onPress={() => !disabled && selectDay(day)}
                          activeOpacity={disabled ? 1 : 0.75}
                        >
                          <Text style={[styles.dayWd,  disabled && { color: '#ccc' }]}>{fmtDay(day)}</Text>
                          <Text style={[styles.dayNum, disabled && { color: '#ccc' }]}>{day.getDate()}</Text>
                          <Text style={[styles.dayMon, disabled && { color: '#ccc' }]}>
                            {day.toLocaleDateString('en-IN', { month: 'short' })}
                          </Text>
                          {isToday && <View style={styles.todayDot} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </>
            )}

            {picker?.step === 'time' && (
              <>
                <Text style={styles.sheetTitle}>
                  {picker.field === 'checkin' ? 'Check-in Time' : 'Check-out Time'}
                </Text>
                <Text style={styles.sheetSub}>{pendingDate ? fmtDate(pendingDate) : ''}</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 14 }}>
                  {TIMES.map(t => (
                    <TouchableOpacity key={t} style={styles.timeBtn} onPress={() => selectTime(t)} activeOpacity={0.75}>
                      <Icon name="clock-outline" size={18} color="#1a1a1a" />
                      <Text style={styles.timeBtnTxt}>{t}</Text>
                      <Icon name="chevron-right" size={18} color="#1a1a1a" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setPicker(null)} activeOpacity={0.8}>
              <Text style={styles.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row:          { flexDirection: 'row', alignItems: 'stretch', gap: 8, marginBottom: 10 },
  box:          { flex: 1, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#E2EDD5', padding: 12 },
  boxFilled:    { borderColor: COLORS.primary, backgroundColor: '#fff' },
  boxHeader:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  boxLabel:     { fontSize: 11, color: '#888', fontWeight: '600' },
  boxDate:      { fontSize: 13, fontWeight: '700', color: '#1a1a1a', marginBottom: 5 },
  timePill:     { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  timeVal:      { fontSize: 11, color: '#1a1a1a', fontWeight: '700' },
  placeholder:  { fontSize: 12, color: '#bbb', marginTop: 2 },
  arrow:        { alignItems: 'center', justifyContent: 'center', gap: 4 },
  nightsBadge:  { backgroundColor: COLORS.primary, borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
  nightsTxt:    { fontSize: 10, color: '#fff', fontWeight: '700' },
  nightsRow:    { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E2EDD5', paddingHorizontal: 14, paddingVertical: 10, marginBottom: 22 },
  nightsRowTxt: { fontSize: 13, color: COLORS.primary, fontWeight: '600', flex: 1 },
  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 24, maxHeight: '72%' },
  handle:       { width: 38, height: 4, borderRadius: 2, backgroundColor: '#DDD', alignSelf: 'center', marginBottom: 16 },
  sheetTitle:   { fontSize: 17, fontWeight: '800', color: '#1a1a1a', marginBottom: 2 },
  sheetSub:     { fontSize: 12, color: '#888' },
  daysGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 8 },
  dayBtn:       { width: '13%', minWidth: 44, backgroundColor: '#F7FAF4', borderRadius: 12, borderWidth: 1, borderColor: '#E2EDD5', paddingVertical: 10, alignItems: 'center', position: 'relative' },
  dayBtnOff:    { backgroundColor: '#fafafa', borderColor: '#eee' },
  dayWd:        { fontSize: 10, color: '#888', marginBottom: 3 },
  dayNum:       { fontSize: 16, fontWeight: '800', color: '#1a1a1a' },
  dayMon:       { fontSize: 10, color: '#888', marginTop: 2 },
  todayDot:     { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.primary, position: 'absolute', bottom: 4 },
  timeBtn:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  timeBtnTxt:   { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  cancelBtn:    { marginTop: 14, backgroundColor: '#F5F5F5', borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  cancelTxt:    { fontSize: 15, fontWeight: '600', color: '#555' },
});
