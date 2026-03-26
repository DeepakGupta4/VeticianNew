// components/needhelp/TrackRequests.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

const STATUS_COLORS = {
  'In Progress': { bg: '#FFF8E1', text: '#F57F17', dot: '#FFB300' },
  'Resolved': { bg: '#E8F5E9', text: '#2E7D32', dot: '#43A047' },
  'Open': { bg: '#E3F2FD', text: '#1565C0', dot: '#1E88E5' },
};

const SAMPLE_TICKETS = [
  { id: '#VT-1042', issue: 'Payment not processed', date: 'Mar 23, 2025', status: 'In Progress' },
  { id: '#VT-1038', issue: 'Location not detected', date: 'Mar 20, 2025', status: 'Resolved' },
  { id: '#VT-1031', issue: 'App loading slowly', date: 'Mar 15, 2025', status: 'Resolved' },
];

function TicketCard({ ticket }) {
  const s = STATUS_COLORS[ticket.status] || STATUS_COLORS['Open'];
  return (
    <View style={styles.ticketCard}>
      <View style={styles.ticketLeft}>
        <View style={styles.ticketIconWrap}>
          <MaterialIcons name="confirmation-number" size={18} color={COLORS2.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.ticketId}>{ticket.id}</Text>
          <Text style={styles.ticketIssue}>{ticket.issue}</Text>
          <Text style={styles.ticketDate}>{ticket.date}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
        <View style={[styles.statusDot, { backgroundColor: s.dot }]} />
        <Text style={[styles.statusText, { color: s.text }]}>{ticket.status}</Text>
      </View>
    </View>
  );
}

export default function TrackRequests({ onViewAll }) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Requests</Text>
          <View style={styles.dot} />
          <Text style={styles.sectionSub}>Track your tickets</Text>
        </View>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.ticketsList}>
        {SAMPLE_TICKETS.map((t) => (
          <TicketCard key={t.id} ticket={t} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  viewAll: {
    fontSize: 13,
    color: COLORS2.primary,
    fontWeight: '600',
  },
  ticketsList: {
    gap: 10,
  },
  ticketCard: {
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS2.border,
    shadowColor: COLORS2.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  ticketIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS2.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketId: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS2.primary,
  },
  ticketIssue: {
    fontSize: 13,
    color: COLORS2.text,
    fontWeight: '600',
    marginTop: 1,
  },
  ticketDate: {
    fontSize: 11,
    color: COLORS2.subtext,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
    marginLeft: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
