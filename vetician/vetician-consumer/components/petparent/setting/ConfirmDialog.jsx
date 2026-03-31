import React, { useState, useRef, useEffect } from 'react';
import {
  Modal, View, Text, TextInput,
  TouchableOpacity, StyleSheet, Platform, Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

const DANGER      = '#C62828';
const DANGER_MID  = '#E53935';
const DANGER_LIGHT = '#FFEBEE';
const DANGER_BORDER = '#FFCDD2';

export default function ConfirmDialog({
  visible,
  title,
  message,
  icon,
  confirmText = 'Confirm',
  confirmColor = COLORS2.primary,
  requireTyping,
  onConfirm,
  onCancel,
}) {
  const [typed, setTyped] = useState('');
  const scaleAnim   = useRef(new Animated.Value(0.88)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const canConfirm = requireTyping ? typed.trim() === requireTyping : true;
  const isDelete   = requireTyping === 'DELETE';

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim,   { toValue: 1, useNativeDriver: true, friction: 8, tension: 90 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(0.88);
      opacityAnim.setValue(0);
      setTyped('');
    }
  }, [visible]);

  const handleConfirm = () => { if (!canConfirm) return; setTyped(''); onConfirm(); };
  const handleCancel  = () => { setTyped(''); onCancel(); };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleCancel}>
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleCancel} activeOpacity={1} />

        <Animated.View style={[styles.dialog, { transform: [{ scale: scaleAnim }] }]}>

          {/* ── Icon hero ── */}
          <View style={[styles.iconHero, { backgroundColor: confirmColor + '12' }]}>
            <View style={[styles.iconRing, { borderColor: confirmColor + '35', backgroundColor: confirmColor + '20' }]}>
              <MaterialCommunityIcons name={icon || 'help-circle-outline'} size={34} color={confirmColor} />
            </View>
          </View>

          {/* ── Title & message ── */}
          <Text style={[styles.title, { color: confirmColor }]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* ── Info strip (logout) ── */}
          {!isDelete && (
            <View style={styles.infoStrip}>
              <MaterialCommunityIcons name="information-outline" size={14} color={COLORS2.primary} />
              <Text style={styles.infoText}>You can log back in anytime with your credentials.</Text>
            </View>
          )}

          {/* ── Warning strip (delete) ── */}
          {isDelete && (
            <View style={styles.warningStrip}>
              <MaterialCommunityIcons name="alert-circle" size={15} color={DANGER} />
              <Text style={styles.warningText}>
                All your pets, bookings, rewards and data will be permanently erased.
              </Text>
            </View>
          )}

          {/* ── Type to confirm (delete only) ── */}
          {isDelete && (
            <View style={styles.typeSection}>
              <Text style={styles.typeHint}>
                Type{' '}
                <Text style={styles.typeKeyword}>"DELETE"</Text>
                {' '}to confirm
              </Text>
              <TextInput
                style={[styles.typeInput, typed === 'DELETE' && styles.typeInputDone]}
                value={typed}
                onChangeText={setTyped}
                placeholder="DELETE"
                placeholderTextColor={COLORS2.subtext}
                autoCapitalize="characters"
                autoCorrect={false}
                textAlign="center"
              />
              {typed.length > 0 && typed !== 'DELETE' && (
                <View style={styles.typeError}>
                  <MaterialCommunityIcons name="close-circle" size={12} color={DANGER_MID} />
                  <Text style={styles.typeErrorText}>Must match exactly</Text>
                </View>
              )}
              {typed === 'DELETE' && (
                <View style={styles.typeSuccess}>
                  <MaterialCommunityIcons name="check-circle" size={12} color={COLORS2.primary} />
                  <Text style={styles.typeSuccessText}>Confirmed — you may proceed</Text>
                </View>
              )}
            </View>
          )}

          {/* ── Buttons ── */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.75}>
              <MaterialCommunityIcons name="close" size={15} color={COLORS2.subtext} />
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                { backgroundColor: canConfirm ? confirmColor : confirmColor + '50' },
              ]}
              onPress={handleConfirm}
              activeOpacity={0.8}
              disabled={!canConfirm}
            >
              <MaterialCommunityIcons
                name={isDelete ? 'delete-forever' : 'logout-variant'}
                size={16}
                color="#fff"
              />
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: COLORS2.card,
    borderRadius: 26,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 0,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 24 },
      android: { elevation: 14 },
    }),
  },

  /* Icon hero */
  iconHero: {
    width: '140%', paddingVertical: 28,
    alignItems: 'center', marginBottom: 20,
  },
  iconRing: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 2.5,
    alignItems: 'center', justifyContent: 'center',
  },

  title: {
    fontSize: 20, fontWeight: '900',
    marginBottom: 8, textAlign: 'center', letterSpacing: -0.3,
  },
  message: {
    fontSize: 13.5, color: COLORS2.subtext,
    textAlign: 'center', lineHeight: 21,
    marginBottom: 14, paddingHorizontal: 4,
  },

  /* Info strip */
  infoStrip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: COLORS2.accent,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS2.border,
    paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: 20, width: '100%',
  },
  infoText: { flex: 1, fontSize: 12, color: COLORS2.subtext, lineHeight: 17 },

  /* Warning strip */
  warningStrip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: DANGER_LIGHT,
    borderRadius: 12, borderWidth: 1, borderColor: DANGER_BORDER,
    paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: 16, width: '100%',
  },
  warningText: { flex: 1, fontSize: 12, color: DANGER, lineHeight: 17 },

  /* Type section */
  typeSection: { width: '100%', marginBottom: 16 },
  typeHint: {
    fontSize: 12.5, color: COLORS2.subtext,
    textAlign: 'center', marginBottom: 10,
  },
  typeKeyword: { fontWeight: '900', color: COLORS2.text },
  typeInput: {
    borderWidth: 2, borderColor: COLORS2.border,
    borderRadius: 14, paddingVertical: 13,
    fontSize: 18, fontWeight: '900',
    color: COLORS2.text, backgroundColor: COLORS2.bg,
    letterSpacing: 4, textAlign: 'center',
  },
  typeInputDone: {
    borderColor: COLORS2.secondary,
    backgroundColor: COLORS2.accent,
    color: COLORS2.primary,
  },
  typeError: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    justifyContent: 'center', marginTop: 6,
  },
  typeErrorText: { fontSize: 11.5, color: DANGER_MID, fontWeight: '600' },
  typeSuccess: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    justifyContent: 'center', marginTop: 6,
  },
  typeSuccessText: { fontSize: 11.5, color: COLORS2.primary, fontWeight: '600' },

  /* Buttons */
  btnRow: { flexDirection: 'row', gap: 10, width: '100%' },
  cancelBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    backgroundColor: COLORS2.accent,
    borderWidth: 1.5, borderColor: COLORS2.border,
    borderRadius: 16, paddingVertical: 15,
  },
  cancelText: { fontSize: 14, fontWeight: '700', color: COLORS2.subtext },
  confirmBtn: {
    flex: 1.4, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 7,
    borderRadius: 16, paddingVertical: 15,
  },
  confirmText: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});
