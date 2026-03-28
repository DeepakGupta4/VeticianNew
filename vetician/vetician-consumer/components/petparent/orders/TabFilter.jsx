import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS2 } from './colors';
import { FILTER_TABS } from './ordersData';

const TabFilter = ({ activeTab, onTabChange }) => (
  <View style={styles.wrapper}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {FILTER_TABS.map((tab) => {
        const active = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onTabChange(tab)}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS2.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS2.border,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS2.accent,
    borderWidth: 1,
    borderColor: COLORS2.border,
  },
  tabActive: {
    backgroundColor: COLORS2.primary,
    borderColor: COLORS2.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS2.subtext,
  },
  tabTextActive: {
    color: '#fff',
  },
});

export default TabFilter;
