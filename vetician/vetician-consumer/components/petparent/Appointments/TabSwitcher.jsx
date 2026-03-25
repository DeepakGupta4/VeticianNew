// components/appointments/TabSwitcher.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS2 } from './colors';

const TABS = ['Book Appointment', 'My Appointments'];

/**
 * TabSwitcher
 * Props:
 *   activeTab   — 0 | 1
 *   onTabChange — (index: number) => void
 */
export default function TabSwitcher({ activeTab, onTabChange }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.track}>
        {TABS.map((label, index) => {
          const isActive = activeTab === index;
          return (
            <TouchableOpacity
              key={label}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabChange(index)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor:   COLORS2.card,
    paddingHorizontal: 20,
    paddingVertical:   14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS2.border,
  },
  track: {
    flexDirection:   'row',
    backgroundColor: COLORS2.accent,
    borderRadius:    14,
    padding:          4,
  },
  tab: {
    flex:           1,
    paddingVertical: 10,
    alignItems:     'center',
    borderRadius:   11,
  },
  tabActive: {
    backgroundColor: COLORS2.primary,
    shadowColor:     COLORS2.primary,
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.25,
    shadowRadius:    6,
    elevation:       3,
  },
  tabText: {
    fontSize:   13,
    fontWeight: '600',
    color:      COLORS2.subtext,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
});
