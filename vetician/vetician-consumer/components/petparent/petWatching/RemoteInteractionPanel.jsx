// ─────────────────────────────────────────
//  components/RemoteInteractionPanel.jsx
//
//  WHAT IT SHOWS:
//    • 3 interactive buttons: Speak, Toy Sound, Call Name
//    • Active button glows green + shows feedback text
//    • Audio wave animation when active
//
//  HOW TO USE:
//    <RemoteInteractionPanel />
// ─────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../../constant/theme';

// ── Button definitions ──
const BUTTONS = [
  { key: 'speak', icon: 'mic',          iconLib: Ionicons,               label: 'Speak to Pet',   desc: 'Send voice message',  feedbackKey: 'speak' },
  { key: 'toy',   icon: 'tennis-ball',   iconLib: MaterialCommunityIcons, label: 'Play Toy Sound', desc: 'Activate smart toy',  feedbackKey: 'toy'   },
  { key: 'call',  icon: 'notifications', iconLib: Ionicons,               label: 'Call Pet',       desc: 'Call pet by name',   feedbackKey: 'call'  },
];

export default function RemoteInteractionPanel({ petName = 'Your Pet' }) {

  // Which button is currently active (null = none)
  const [activeKey, setActiveKey] = useState(null);

  const handlePress = (key) => {
    // Tap same button again to deactivate
    setActiveKey(prev => (prev === key ? null : key));
  };

  // Get feedback text for the active button
  const feedbackMap = {
    speak: `Transmitting voice to ${petName}…`,
    toy:   'Activating play toy…',
    call:  `Calling ${petName}'s name…`,
  };
  const activeFeedback = activeKey ? feedbackMap[activeKey] : null;

  return (
    <View style={styles.container}>

      {/* Section title */}
      <Text style={styles.sectionTitle}>Remote Interaction </Text>

      {/* ── 3 buttons row ── */}
      <View style={styles.buttonRow}>
        {BUTTONS.map(btn => {
          const isActive = activeKey === btn.key;
          const IconComponent = btn.iconLib;
          return (
            <TouchableOpacity
              key={btn.key}
              style={[styles.button, isActive && styles.buttonActive]}
              onPress={() => handlePress(btn.key)}
              activeOpacity={0.8}
            >
              <IconComponent 
                name={btn.icon} 
                size={28} 
                color={isActive ? '#fff' : 'Black'} 
              />
              <Text style={[styles.btnLabel, isActive && styles.btnLabelActive]}>
                {btn.label}
              </Text>
              <Text style={[styles.btnDesc, isActive && styles.btnDescActive]}>
                {btn.desc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Feedback bar – shown when a button is active ── */}
      {activeKey && (
        <View style={styles.feedbackBar}>
          {/* Simple wave bars */}
          <View style={styles.waveRow}>
            {[8, 14, 10, 18, 10].map((h, i) => (
              <View key={i} style={[styles.waveBar, { height: h }]} />
            ))}
          </View>
          <Text style={styles.feedbackText}>{activeFeedback}</Text>
        </View>
      )}

    </View>
  );
}

// ─────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 22,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2D10',
    marginBottom: 12,
  },

  // button row
  buttonRow: {
    flexDirection: 'row',
    gap: 11,
  },

  button: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
    borderWidth: 0,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ translateY: -3 }],
  },

  btnLabel: {
    fontSize: 11, fontWeight: '700',
    color: '#1F2D10', textAlign: 'center',
  },
  btnLabelActive: { color: '#fff' },

  btnDesc: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  btnDescActive: { color: 'rgba(255,255,255,0.75)' },

  // feedback bar
  feedbackBar: {
    marginTop: 11,
    backgroundColor: COLORS.primaryPale,
    borderRadius: RADIUS.sm,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  waveRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  waveBar: {
    width: 3, borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  feedbackText: {
    fontSize: 12, fontWeight: '600',
    color: COLORS.primary,
  },
});
