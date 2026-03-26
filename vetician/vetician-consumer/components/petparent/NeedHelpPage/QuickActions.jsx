// components/needhelp/QuickActions.js
import React from 'react';
import { View, Text, StyleSheet, Linking, Alert } from 'react-native';
import ActionCard from './ActionCard';
import { COLORS2 } from './colors';

const ACTIONS = [
  {
    id: 'call',
    icon: 'phone-in-talk',
    label: 'Call\nSupport',
    color: COLORS2.primary,
    action: () => Linking.openURL('tel:+18001234567'),
  },
  {
    id: 'chat',
    icon: 'chat',
    label: 'Live\nChat',
    color: COLORS2.secondary,
    badge: 'LIVE',
    action: (openDrawer) => openDrawer('chat'),
  },
  {
    id: 'emergency',
    icon: 'local-hospital',
    label: 'Emergency\nHelp',
    color: COLORS2.secondary,
    action: (openDrawer) => openDrawer('emergency'),
  },
];

export default function QuickActions({ onOpenDrawer }) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Help</Text>
        <View style={styles.dot} />
        <Text style={styles.sectionSub}>Get instant support</Text>
      </View>
      <View style={styles.row}>
        {ACTIONS.map((item) => (
          <ActionCard
            key={item.id}
            icon={item.icon}
            label={item.label}
            color={item.color}
            badge={item.badge}
            onPress={() =>
              item.id === 'call' ? item.action() : item.action(onOpenDrawer)
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
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
  row: {
    flexDirection: 'row',
    marginHorizontal: -5,
  },
});
