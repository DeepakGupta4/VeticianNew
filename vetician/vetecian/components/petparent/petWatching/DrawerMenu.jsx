// ─────────────────────────────────────────
//  components/DrawerMenu.jsx
//
//  WHAT IT SHOWS:
//    • Slide-in side navigation drawer
//    • Green gradient header with pet info
//    • Nav links (active = green highlight)
//    • App branding footer
//
//  HOW TO USE:
//    <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
// ─────────────────────────────────────────

import React from 'react';
import {
  View, Text, TouchableOpacity,
  Modal, StyleSheet, Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../../constant/theme';

// ── Nav items ──
// Set active:true for the current screen
const NAV_ITEMS = [
  { icon: 'home-outline',           label: 'Home',         active: false },
  { icon: 'stethoscope',            label: 'Services',     active: false },
  { icon: 'camera-outline',         label: 'Pet Watching', active: true  },
  { icon: 'hospital-building',      label: 'Clinics',      active: false },
  { icon: 'account-outline',        label: 'Profile',      active: false },
];

export default function DrawerMenu({ open, onClose }) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Dark backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}>

        {/* Drawer panel – stop tap propagation so drawer doesn't close on content tap */}
        <Pressable style={styles.drawer}>

          {/* ── Green header ── */}
          <LinearGradient
            colors={[COLORS.primaryDark, COLORS.primary]}
            style={styles.drawerHeader}
          >
            {/* Pet avatar */}
            <View style={styles.drawerAvatar}>
              <Text style={{ fontSize: 26 }}>🐕</Text>
            </View>
            <View>
              <Text style={styles.drawerGreeting}>Hey, Pet Parent! 🌿</Text>
              <Text style={styles.drawerStatus}>Max is safe &amp; happy</Text>
            </View>
          </LinearGradient>

          {/* ── Nav links ── */}
          <View style={styles.navList}>
            {NAV_ITEMS.map(item => (
              <TouchableOpacity
                key={item.label}
                style={[styles.navItem, item.active && styles.navItemActive]}
                onPress={onClose}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color={item.active ? COLORS.primary : COLORS.textMuted}
                />
                <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
                  {item.label}
                </Text>

                {/* Active right-edge bar */}
                {item.active && <View style={styles.activeBar} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Footer branding ── */}
          <View style={styles.drawerFooter}>
            <Text style={styles.brandName}>Vetician</Text>
            <Text style={styles.brandVersion}>v2.4.1 · Premium Plan</Text>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  // backdrop
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    flexDirection: 'row',
  },

  // drawer panel
  drawer: {
    width: 255,
    backgroundColor: COLORS.card,
    height: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    flexDirection: 'column',
  },

  // header
  drawerHeader: {
    padding: 24,
    paddingTop: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.primaryPale,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center', justifyContent: 'center',
  },
  drawerGreeting: { color: '#fff', fontSize: 14, fontWeight: '800' },
  drawerStatus:   { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },

  // nav items
  navList: { flex: 1, paddingTop: 8 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    position: 'relative',
  },
  navItemActive: { backgroundColor: COLORS.primaryPale },
  navLabel:       { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  navLabelActive: { fontWeight: '800', color: COLORS.primary },

  activeBar: {
    position: 'absolute',
    right: 0, top: 0, bottom: 0,
    width: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },

  // footer
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  brandName:    { fontSize: 17, fontWeight: '800', color: COLORS.primary },
  brandVersion: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
