// ─────────────────────────────────────────
//  components/BottomTabBar.jsx
//
//  WHAT IT SHOWS:
//    • Sticky 4-tab nav bar at screen bottom
//    • Active tab = green label + underline pip
//
//  HOW TO USE:
//    const [activeTab, setActiveTab] = useState('watch');
//    <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
// ─────────────────────────────────────────

import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet
} from 'react-native';
import { COLORS } from '../../../constant/theme';

// ── Tab definitions ──
const TABS = [
  { key: 'home',    emoji: '🏠', label: 'Home'     },
  { key: 'service', emoji: '🩺', label: 'Services' },
  { key: 'watch',   emoji: '📷', label: 'Watching' },
  { key: 'profile', emoji: '👤', label: 'Profile'  },
];

export default function BottomTabBar({ activeTab, onTabChange }) {
  return (
    <View style={styles.tabBar}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {/* Active underline pip */}
            {isActive && <View style={styles.activePip} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 12, // extra space for phones with home indicator
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    gap: 2,
  },

  tabEmoji: { fontSize: 20 },

  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabLabelActive: { color: COLORS.primary },

  activePip: {
    width: 18, height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
});
