import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

const Row = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}>
      <MaterialCommunityIcons name={icon} size={16} color={COLORS2.primary} />
    </View>
    <View style={styles.rowBody}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  </View>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const OrderDetails = ({ order }) => {
  if (!order) return null;

  return (
    <View style={styles.container}>
      <Section title="Service Info">
        <Row icon="paw" label="Pet" value={`${order.pet.name} · ${order.pet.breed} · ${order.pet.age}`} />
        <Row icon="map-marker-outline" label="Location" value={order.location} />
        <Row icon="home-outline" label="Address" value={order.address} />
        <Row icon="note-text-outline" label="Notes" value={order.notes} />
      </Section>

      <Section title="Professional">
        <Row icon="account-outline" label="Name" value={order.professional.name} />
        <Row icon="briefcase-outline" label="Role" value={order.professional.role} />
      </Section>

      <Section title="Payment">
        <Row icon="credit-card-outline" label="Method" value={order.payment.method} />
        <Row icon="currency-inr" label="Amount" value={`₹${order.payment.amount.toLocaleString('en-IN')}`} />
        <Row icon="check-circle-outline" label="Status" value={order.payment.status} />
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 16 },
  section: {
    backgroundColor: COLORS2.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS2.border,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS2.primary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS2.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowBody: { flex: 1 },
  rowLabel: { fontSize: 11, color: COLORS2.subtext, fontWeight: '600', marginBottom: 2 },
  rowValue: { fontSize: 13, color: COLORS2.text, fontWeight: '600', lineHeight: 18 },
});

export default OrderDetails;
