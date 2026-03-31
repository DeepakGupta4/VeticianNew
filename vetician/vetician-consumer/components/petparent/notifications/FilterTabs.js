import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

const TABS = [
  { key: 'all',    label: 'All',    icon: 'bell-outline' },
  { key: 'unread', label: 'Unread', icon: 'bell-badge-outline' },
];

const FilterTabs = ({ activeFilter, onFilterChange, unreadCount }) => (
  <View style={styles.container}>
    {TABS.map((tab) => {
      const isActive = activeFilter === tab.key;
      return (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, isActive && styles.tabActive]}
          onPress={() => onFilterChange(tab.key)}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons
            name={tab.icon}
            size={14}
            color={isActive ? '#fff' : COLORS2.subtext}
          />
          <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
            {tab.label}
          </Text>
          {tab.key === 'unread' && unreadCount > 0 && (
            <View style={[styles.pill, isActive && styles.pillActive]}>
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: COLORS2.card,
    borderBottomWidth: 1, borderBottomColor: COLORS2.border,
    gap: 8,
  },
  tab: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: COLORS2.border,
    backgroundColor: COLORS2.accent, gap: 6,
  },
  tabActive: { backgroundColor: COLORS2.primary, borderColor: COLORS2.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS2.subtext },
  tabTextActive: { color: '#fff', fontWeight: '700' },
  pill: {
    backgroundColor: COLORS2.border, borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 1, minWidth: 20, alignItems: 'center',
  },
  pillActive: { backgroundColor: 'rgba(255,255,255,0.28)' },
  pillText: { fontSize: 11, fontWeight: '700', color: COLORS2.primary },
  pillTextActive: { color: '#fff' },
});

export default FilterTabs;
