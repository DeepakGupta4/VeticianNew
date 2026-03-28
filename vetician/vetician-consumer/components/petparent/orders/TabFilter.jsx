import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';
import { FILTER_TABS } from './ordersData';

const TAB_ICONS = {
  All:       'view-grid-outline',
  Active:    'progress-clock',
  Completed: 'check-circle-outline',
  Cancelled: 'close-circle-outline',
};

const TabFilter = ({ activeTab, onTabChange }) => (
  <View style={styles.container}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
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
              name={TAB_ICONS[tab]}
              size={14}
              color={isActive ? '#FFFFFF' : COLORS2.subtext}
            />
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS2.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS2.border,
    ...Platform.select({
      ios: {
        shadowColor: '#2D3A1F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    borderWidth: 1,
    borderColor: COLORS2.border,
    backgroundColor: COLORS2.bg,
    marginRight: 6,
  },
  tabActive: {
    backgroundColor: COLORS2.primary,
    borderColor: COLORS2.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS2.subtext,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default TabFilter;
