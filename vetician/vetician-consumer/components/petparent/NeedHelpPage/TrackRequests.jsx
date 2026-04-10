// components/needhelp/TrackRequests.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const STATUS_COLORS = {
  'in-progress': { bg: '#FFF8E1', text: '#F57F17', dot: '#FFB300' },
  'resolved': { bg: '#E8F5E9', text: '#2E7D32', dot: '#43A047' },
  'open': { bg: '#E3F2FD', text: '#1565C0', dot: '#1E88E5' },
  'closed': { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
};

function TicketCard({ ticket }) {
  const s = STATUS_COLORS[ticket.status] || STATUS_COLORS['open'];
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatStatus = (status) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <View style={styles.ticketCard}>
      <View style={styles.ticketLeft}>
        <View style={styles.ticketIconWrap}>
          <MaterialIcons name="confirmation-number" size={18} color={COLORS2.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.ticketId}>{ticket.ticketId}</Text>
          <Text style={styles.ticketIssue}>{ticket.issueType}</Text>
          <Text style={styles.ticketDate}>{formatDate(ticket.createdAt)}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
        <View style={[styles.statusDot, { backgroundColor: s.dot }]} />
        <Text style={[styles.statusText, { color: s.text }]}>{formatStatus(ticket.status)}</Text>
      </View>
    </View>
  );
}

export default function TrackRequests({ onViewAll }) {
  const { user } = useSelector(state => state.auth);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserEnquiries();
  }, []);

  const fetchUserEnquiries = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      
      const response = await fetch(`${API_URL}/support/enquiries/user/${userId || user?._id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.enquiries) {
        // Show only the 3 most recent enquiries
        setTickets(data.enquiries.slice(0, 3));
        console.log('✅ Enquiries loaded:', data.enquiries.length);
      }
    } catch (error) {
      console.error('❌ Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Requests</Text>
            <View style={styles.dot} />
            <Text style={styles.sectionSub}>Track your tickets</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS2.primary} />
          <Text style={styles.loadingText}>Loading your requests...</Text>
        </View>
      </View>
    );
  }

  if (tickets.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Requests</Text>
            <View style={styles.dot} />
            <Text style={styles.sectionSub}>Track your tickets</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <MaterialIcons name="inbox" size={48} color={COLORS2.subtext} />
          <Text style={styles.emptyText}>No support requests yet</Text>
          <Text style={styles.emptySubtext}>Your submitted tickets will appear here</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Requests</Text>
          <View style={styles.dot} />
          <Text style={styles.sectionSub}>Track your tickets</Text>
        </View>
        {tickets.length > 0 && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.ticketsList}>
        {tickets.map((t) => (
          <TicketCard key={t._id} ticket={t} />
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS2.subtext,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS2.text,
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS2.subtext,
  },
});
