import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';
import { FILTER_TABS } from './ordersData';

const TAB_META = {
  All:       { icon: 'view-grid-outline' },
  Active:    { icon: 'progress-clock' },
  Completed: { icon: 'check-circle-outline' },
  Cancelled: { icon: 'close-circle-outline' },
};

const Header = ({ onBack, activeTab, onTabChange }) => (
  <View style={styles.container}>
    {/* ── Top row: back · title · icon ── */}
    <View style={styles.topRow}>
      <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.75}>
        <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.titleWrap}>
        <Text style={styles.title}>Orders & Purchases</Text>
        <Text style={styles.subtitle}>Track your bookings and services</Text>
      </View>

      <View style={styles.iconBtn}>
        <MaterialCommunityIcons name="package-variant-closed" size={20} color="#fff" />
      </View>
    </View>

    {/* ── Filter tabs row ── */}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsRow}
    >
      {FILTER_TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabChange(tab)}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name={TAB_META[tab].icon}
              size={13}
              color={isActive ? COLORS2.primary : 'rgba(255,255,255,0.75)'}
            />
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS2.primary,
    paddingTop: 14,
    paddingBottom: 12,
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 10 },
      android: { elevation: 8 },
    }),
  },

  /* Top row */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 14,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { flex: 1 },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },

  /* Tabs */
  tabsRow: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 8,
    flexDirection: 'row',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginRight: 6,
  },
  tabActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.1,
  },
  tabTextActive: {
    color: COLORS2.primary,
    fontWeight: '700',
  },
});

export default Header;
