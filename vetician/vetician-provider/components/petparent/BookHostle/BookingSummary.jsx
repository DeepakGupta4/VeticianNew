import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '../../../constant/theme';
import { fmtDate } from './hostelData';

export default function BookingSummary({ selPet, selHostel, selRoom, checkin, checkout, nights, totalPrice, isReady, onConfirm }) {
  const rows = [
    { label: 'Pet',       value: selPet    ? `${selPet.name} · ${selPet.breed}`               : 'Not selected', icon: 'paw-outline'         },
    { label: 'Hostel',    value: selHostel ? selHostel.name                                    : 'Not selected', icon: 'home-city-outline'   },
    { label: 'Room',      value: selRoom   ? selRoom.name                                      : 'Not selected', icon: 'bed-outline'         },
    { label: 'Check-in',  value: checkin   ? `${fmtDate(checkin.date)}  ${checkin.time}`      : 'Not set',      icon: 'calendar-arrow-right'},
    { label: 'Check-out', value: checkout  ? `${fmtDate(checkout.date)}  ${checkout.time}`    : 'Not set',      icon: 'calendar-arrow-left' },
    { label: 'Stay',      value: nights > 0 ? `${nights} night${nights !== 1 ? 's' : ''}`    : '—',            icon: 'moon-waning-crescent'},
  ];

  return (
    <>
      <View style={styles.card}>
        {rows.map((row, i, arr) => (
          <View key={row.label} style={[styles.row, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.left}>
              <Icon name={row.icon} size={15} color="#1a1a1a" />
              <Text style={styles.label}>{row.label}</Text>
            </View>
            <Text style={styles.value} numberOfLines={1}>{row.value}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalVal}>{selRoom ? `₹${totalPrice.toLocaleString('en-IN')}` : '—'}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.confirmBtn, !isReady && styles.confirmBtnOff]}
        onPress={onConfirm}
        activeOpacity={0.85}
      >
        <Icon name={isReady ? 'check-circle-outline' : 'lock-outline'} size={20} color="#fff" />
        <Text style={styles.confirmTxt}>
          {isReady ? 'Confirm Booking' : 'Complete Selection First'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>Free cancellation up to 24 hrs before check-in.</Text>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: '#E2EDD5',
    overflow: 'hidden', marginBottom: 14,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  row:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  left:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label:     { fontSize: 13, color: '#666' },
  value:     { fontSize: 13, fontWeight: '600', color: '#1a1a1a', maxWidth: '52%', textAlign: 'right' },
  totalRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#F0F7E6' },
  totalLabel:{ fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  totalVal:  { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, marginBottom: 12,
    ...Platform.select({
      ios:     { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  confirmBtnOff: { backgroundColor: '#A5C490' },
  confirmTxt:    { color: '#fff', fontSize: 16, fontWeight: '700' },
  disclaimer:    { textAlign: 'center', fontSize: 12, color: '#aaa', marginBottom: 8 },
});
