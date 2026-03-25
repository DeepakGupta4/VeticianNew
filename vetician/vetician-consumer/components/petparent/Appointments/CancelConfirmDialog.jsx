// components/appointments/CancelConfirmDialog.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS2 } from './colors';

/**
 * CancelConfirmDialog
 * A polished in-app confirmation dialog (no native Alert).
 *
 * Props:
 *   visible     — boolean
 *   serviceName — string  e.g. "Grooming"
 *   onConfirm   — () => void
 *   onDismiss   — () => void
 */
export default function CancelConfirmDialog({
  visible,
  serviceName,
  onConfirm,
  onDismiss,
}) {
  const scaleAnim   = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue:         1,
          tension:         80,
          friction:        8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue:         1,
          duration:        180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Animated.View
          style={[
            styles.dialog,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          {/* Stop press propagation so touching the box doesn't close it */}
          <Pressable>
            {/* Icon */}
            <View style={styles.iconWrap}>
              <MaterialIcons name="event-busy" size={28} color="#C62828" />
            </View>

            <Text style={styles.title}>Cancel Appointment?</Text>
            <Text style={styles.body}>
              Are you sure you want to cancel your{' '}
              <Text style={styles.boldText}>{serviceName}</Text> appointment?
              {'\n'}This action cannot be undone.
            </Text>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.keepBtn}
                onPress={onDismiss}
                activeOpacity={0.8}
              >
                <Text style={styles.keepBtnText}>Keep It</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onConfirm}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems:      'center',
    justifyContent:  'center',
    padding:         24,
  },
  dialog: {
    width:           '100%',
    maxWidth:        320,
    backgroundColor: COLORS2.card,
    borderRadius:    20,
    padding:         24,
    alignItems:      'center',
  },
  iconWrap: {
    width:           56,
    height:          56,
    borderRadius:    16,
    backgroundColor: '#FFEBEE',
    alignItems:      'center',
    justifyContent:  'center',
    alignSelf:       'center',
    marginBottom:    16,
  },
  title: {
    fontSize:     17,
    fontWeight:   '700',
    color:        COLORS2.text,
    textAlign:    'center',
    marginBottom:  8,
  },
  body: {
    fontSize:     14,
    color:        COLORS2.subtext,
    textAlign:    'center',
    lineHeight:   21,
    marginBottom: 24,
  },
  boldText: {
    fontWeight: '700',
    color:      COLORS2.text,
  },
  btnRow: {
    flexDirection: 'row',
    gap:           10,
    width:         '100%',
  },
  keepBtn: {
    flex:            1,
    paddingVertical: 13,
    borderRadius:    12,
    backgroundColor: COLORS2.accent,
    borderWidth:     1,
    borderColor:     COLORS2.border,
    alignItems:      'center',
  },
  keepBtnText: {
    fontSize:   14,
    fontWeight: '600',
    color:      COLORS2.primary,
  },
  cancelBtn: {
    flex:            1,
    paddingVertical: 13,
    borderRadius:    12,
    backgroundColor: '#FFEBEE',
    alignItems:      'center',
  },
  cancelBtnText: {
    fontSize:   14,
    fontWeight: '600',
    color:      '#C62828',
  },
});
