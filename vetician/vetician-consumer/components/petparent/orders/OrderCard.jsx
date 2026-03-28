import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2, STATUS_COLORS } from './colors';
import { SERVICE_ICONS } from './ordersData';

const OrderCard = ({ order, onPress }) => {
  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.Completed;
  const svcIcon = SERVICE_ICONS[order.serviceType] || { name: 'paw', color: COLORS2.primary };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(order)} activeOpacity={0.8}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: svcIcon.color + '18' }]}>
          <MaterialCommunityIcons name={svcIcon.name} size={22} color={svcIcon.color} />
        </View>
        <View style={styles.info}>
          <Text style={styles.service}>{order.service}</Text>
          <Text style={styles.pet}>{order.pet.name} · {order.pet.breed}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
          <View style={[styles.statusDot, { backgroundColor: statusStyle.text }]} />
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="calendar-outline" size={13} color={COLORS2.subtext} />
          <Text style={styles.metaText}>{order.date}</Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="clock-outline" size={13} color={COLORS2.subtext} />
          <Text style={styles.metaText}>{order.time}</Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="currency-inr" size={13} color={COLORS2.primary} />
          <Text style={[styles.metaText, { color: COLORS2.primary, fontWeight: '700' }]}>
            {order.price.toLocaleString('en-IN')}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS2.subtext} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS2.border,
    padding: 14,
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 3 },
    }),
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  service: { fontSize: 15, fontWeight: '700', color: COLORS2.text },
  pet: { fontSize: 12, color: COLORS2.subtext, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  divider: { height: 1, backgroundColor: COLORS2.border, marginVertical: 12 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: COLORS2.subtext, fontWeight: '500' },
});

export default OrderCard;
