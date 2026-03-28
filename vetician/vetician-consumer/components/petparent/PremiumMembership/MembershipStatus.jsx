import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS2 } from './colors';

export default function MembershipStatus({ isSubscribed = false, planName, expiry, previousPlans = [] }) {
  return (
    <View style={styles.wrapper}>

      {/* Active / Inactive card */}
      {isSubscribed ? (
        <View style={[styles.card, styles.activeCard]}>
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Icon source="crown-circle" size={24} color={COLORS2.primary} />
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.activeTitle}>Active Membership</Text>
              <Text style={styles.planName}>{planName} Plan</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE</Text>
            </View>
          </View>
          <View style={styles.expiryRow}>
            <Icon source="calendar-check" size={14} color={COLORS2.subtext} />
            <Text style={styles.expiryText}>Valid until {expiry}</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.card, styles.inactiveCard]}>
          <View style={styles.row}>
            <View style={[styles.iconBox, styles.inactiveIcon]}>
              <Icon source="crown-outline" size={24} color={COLORS2.subtext} />
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.inactiveTitle}>No Active Membership</Text>
              <Text style={styles.inactiveSub}>Subscribe to a plan to unlock premium benefits</Text>
            </View>
          </View>
        </View>
      )}

      {/* Previous plans */}
      {previousPlans.length > 0 && (
        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <MaterialCommunityIcons name="history" size={16} color={COLORS2.primary} />
            <Text style={styles.historyTitle}>Previous Plans</Text>
          </View>
          {previousPlans.map((p, i) => (
            <View key={i} style={[styles.historyRow, i < previousPlans.length - 1 && styles.historyRowBorder]}>
              <View style={styles.historyLeft}>
                <MaterialCommunityIcons name="crown" size={14} color={COLORS2.subtext} />
                <View>
                  <Text style={styles.historyPlan}>{p.planName} Plan</Text>
                  <Text style={styles.historyDate}>{p.billing} · Expired {p.expiry}</Text>
                </View>
              </View>
              <View style={styles.expiredBadge}>
                <Text style={styles.expiredBadgeText}>EXPIRED</Text>
              </View>
            </View>
          ))}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
  },
  activeCard: {
    backgroundColor: COLORS2.accent,
    borderColor: COLORS2.primary,
  },
  inactiveCard: {
    backgroundColor: COLORS2.card,
    borderColor: COLORS2.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS2.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  inactiveIcon: {
    backgroundColor: COLORS2.accent,
  },
  textBlock: {
    flex: 1,
  },
  activeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS2.primary,
  },
  planName: {
    fontSize: 12,
    color: COLORS2.subtext,
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: COLORS2.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.8,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS2.border,
  },
  expiryText: {
    fontSize: 12,
    color: COLORS2.subtext,
  },
  inactiveTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS2.text,
  },
  inactiveSub: {
    fontSize: 12,
    color: COLORS2.subtext,
    marginTop: 2,
    lineHeight: 17,
  },
  historyCard: {
    backgroundColor: COLORS2.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS2.text,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  historyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS2.border,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  historyPlan: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS2.text,
  },
  historyDate: {
    fontSize: 11,
    color: COLORS2.subtext,
    marginTop: 2,
  },
  expiredBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  expiredBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 0.6,
  },
});
