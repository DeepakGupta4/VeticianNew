import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2, STATUS_COLORS } from './colors';

const CARD_SHADOW = Platform.select({
  ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.11, shadowRadius: 16 },
  android: { elevation: 5 },
});

/* ─── Detail Row ─────────────────────────────────────────── */
const DetailRow = ({ icon, label, value, valueColor, last }) => (
  <View style={[styles.detailRow, last && styles.detailRowLast]}>
    <View style={styles.detailLeft}>
      <View style={styles.detailIconWrap}>
        <MaterialCommunityIcons name={icon} size={13} color={COLORS2.primary} />
      </View>
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={[styles.detailValue, valueColor && { color: valueColor }]} numberOfLines={2}>
      {value}
    </Text>
  </View>
);

/* ─── Section Card ───────────────────────────────────────── */
const SectionCard = ({ children }) => (
  <View style={styles.section}>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

/* ─── Main Component ─────────────────────────────────────── */
const OrderDetails = ({ order }) => {
  if (!order) return null;

  return (
    <View style={styles.container}>

      {/* ── Pet Details ── */}
      <SectionCard>
        <DetailRow icon="tag-outline"          label="Pet Name" value={order.pet.name} />
        <DetailRow icon="dog"                  label="Breed"    value={order.pet.breed} />
        <DetailRow icon="cake-variant-outline" label="Age"      value={order.pet.age} last />
      </SectionCard>

      {/* ── Booking Details ── */}
      <SectionCard>
        <DetailRow icon="calendar-month-outline" label="Date"     value={order.date} />
        <DetailRow icon="clock-outline"          label="Time"     value={order.time} />
        <DetailRow icon="map-marker-outline"     label="Location" value={order.location} />
        <DetailRow icon="home-city-outline"      label="Address"  value={order.address} last />
      </SectionCard>

      {/* ── Professional ── */}
      <SectionCard>
        <DetailRow icon="account-outline"   label="Name" value={order.professional.name} />
        <DetailRow icon="briefcase-outline" label="Role" value={order.professional.role} last />
      </SectionCard>

      {/* ── Payment ── */}
      <SectionCard>
        <DetailRow
          icon="currency-inr"
          label="Amount"
          value={`${order.currency}${order.price.toLocaleString('en-IN')}`}
          valueColor={COLORS2.primary}
        />
        <DetailRow icon="contactless-payment" label="Method" value={order.payment.method} />
        <DetailRow
          icon="check-circle-outline"
          label="Status"
          value={order.payment.status}
          valueColor={
            order.payment.status === 'Paid'     ? '#2E7D32' :
            order.payment.status === 'Refunded' ? '#F57C00' : COLORS2.subtext
          }
          last
        />
      </SectionCard>

      {/* ── Notes ── */}
      {order.notes ? (
        <SectionCard>
          <View style={styles.notesWrap}>
            <View style={styles.quoteBar} />
            <Text style={styles.notes}>{order.notes}</Text>
          </View>
        </SectionCard>
      ) : null}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS2.border,
    ...CARD_SHADOW,
  },
  sectionBody: {
    backgroundColor: '#fff',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F7F1',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  detailIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS2.accent,
    borderWidth: 1,
    borderColor: COLORS2.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS2.subtext,
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS2.text,
    flex: 1,
    textAlign: 'right',
    paddingLeft: 8,
  },
  notesWrap: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  quoteBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: COLORS2.primary,
    alignSelf: 'stretch',
    minHeight: 40,
  },
  notes: {
    flex: 1,
    fontSize: 13,
    color: COLORS2.subtext,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});

export default OrderDetails;
