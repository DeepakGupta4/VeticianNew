import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StyleSheet, Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';

const FIELD_CONFIG = {
  name: {
    label: 'Full Name',
    icon: 'account-circle-outline',
    keyboardType: 'default',
    placeholder: 'e.g. Sarah Parker',
    autoCapitalize: 'words',
    maxLength: 40,
    hint: 'This name will appear on your profile and bookings.',
    validate: (v) => v.trim().length < 2 ? 'Name must be at least 2 characters' : null,
  },
  phone: {
    label: 'Mobile Number',
    icon: 'phone-outline',
    keyboardType: 'phone-pad',
    placeholder: '+91 98765 43210',
    autoCapitalize: 'none',
    maxLength: 15,
    hint: 'We use this to send booking confirmations.',
    validate: (v) => v.trim().length < 8 ? 'Enter a valid phone number' : null,
  },
  email: {
    label: 'Email Address',
    icon: 'email-outline',
    keyboardType: 'email-address',
    placeholder: 'you@example.com',
    autoCapitalize: 'none',
    maxLength: 60,
    hint: 'Used for receipts and account recovery.',
    validate: (v) => !/\S+@\S+\.\S+/.test(v) ? 'Enter a valid email address' : null,
  },
};

const EditModal = ({ visible, field, value, onSave, onClose }) => {
  const [inputVal, setInputVal] = useState(value || '');
  const [error, setError]       = useState(null);
  const [focused, setFocused]   = useState(false);

  const slideAnim   = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const config = FIELD_CONFIG[field] || FIELD_CONFIG.name;

  useEffect(() => {
    if (visible) {
      setInputVal(value || '');
      setError(null);
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(slideAnim,   { toValue: 0, useNativeDriver: true, friction: 8, tension: 80 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(slideAnim,   { toValue: 300, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleSave = () => {
    const err = config.validate?.(inputVal);
    if (err) { setError(err); return; }
    onSave(field, inputVal.trim());
  };

  const handleChange = (text) => {
    setInputVal(text);
    if (error) setError(config.validate?.(text) || null);
  };

  const charCount   = inputVal.length;
  const isValid     = !error && inputVal.trim().length > 0;
  const borderColor = error ? '#C62828' : focused ? COLORS2.primary : COLORS2.border;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        </Animated.View>

        {/* Sheet */}
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>

          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconWrap}>
              <MaterialCommunityIcons name={config.icon} size={22} color={COLORS2.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Edit {config.label}</Text>
              <Text style={styles.headerSub}>Update your {config.label.toLowerCase()}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <MaterialCommunityIcons name="close" size={18} color={COLORS2.subtext} />
            </TouchableOpacity>
          </View>

          {/* Hint */}
          <View style={styles.hintRow}>
            <MaterialCommunityIcons name="information-outline" size={13} color={COLORS2.secondary} />
            <Text style={styles.hintText}>{config.hint}</Text>
          </View>

          {/* Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>{config.label}</Text>
            <View style={[styles.inputWrap, { borderColor }]}>
              <MaterialCommunityIcons
                name={config.icon}
                size={18}
                color={focused ? COLORS2.primary : COLORS2.subtext}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={inputVal}
                onChangeText={handleChange}
                keyboardType={config.keyboardType}
                placeholder={config.placeholder}
                placeholderTextColor={COLORS2.subtext}
                autoCapitalize={config.autoCapitalize}
                autoFocus
                maxLength={config.maxLength}
                returnKeyType="done"
                onSubmitEditing={handleSave}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              {inputVal.length > 0 && (
                <TouchableOpacity onPress={() => { setInputVal(''); setError(null); }} style={styles.clearBtn} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="close-circle" size={18} color={COLORS2.subtext} />
                </TouchableOpacity>
              )}
            </View>

            {/* Error / char count row */}
            <View style={styles.inputFooter}>
              {error ? (
                <View style={styles.errorRow}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={13} color="#C62828" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : (
                <View style={styles.errorRow}>
                  {isValid && (
                    <>
                      <MaterialCommunityIcons name="check-circle-outline" size={13} color={COLORS2.primary} />
                      <Text style={styles.validText}>Looks good!</Text>
                    </>
                  )}
                </View>
              )}
              <Text style={styles.charCount}>{charCount}/{config.maxLength}</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.75}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={!isValid}
            >
              <MaterialCommunityIcons name="check" size={17} color="#fff" />
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: COLORS2.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    paddingTop: 12,
  },

  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS2.border,
    alignSelf: 'center', marginBottom: 20,
  },

  /* Header */
  header: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 14,
  },
  headerIconWrap: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: COLORS2.accent,
    borderWidth: 1.5, borderColor: COLORS2.border,
    alignItems: 'center', justifyContent: 'center',
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: COLORS2.text },
  headerSub: { fontSize: 12, color: COLORS2.subtext, marginTop: 2 },
  closeBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: COLORS2.accent,
    borderWidth: 1, borderColor: COLORS2.border,
    alignItems: 'center', justifyContent: 'center',
  },

  /* Hint */
  hintRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 7,
    backgroundColor: COLORS2.accent,
    borderRadius: 10, borderWidth: 1, borderColor: COLORS2.border,
    paddingHorizontal: 12, paddingVertical: 9,
    marginBottom: 20,
  },
  hintText: { flex: 1, fontSize: 12, color: COLORS2.subtext, lineHeight: 17 },

  /* Input */
  inputSection: { marginBottom: 20 },
  inputLabel: {
    fontSize: 11, fontWeight: '800', color: COLORS2.subtext,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderRadius: 14,
    backgroundColor: COLORS2.bg, paddingRight: 10,
  },
  inputIcon: { paddingHorizontal: 12 },
  input: {
    flex: 1, fontSize: 16, fontWeight: '600',
    color: COLORS2.text, paddingVertical: 14,
  },
  clearBtn: { padding: 4 },
  inputFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 6, paddingHorizontal: 2,
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  errorText: { fontSize: 12, color: '#C62828', fontWeight: '600' },
  validText: { fontSize: 12, color: COLORS2.primary, fontWeight: '600' },
  charCount: { fontSize: 11, color: COLORS2.subtext },

  /* Buttons */
  btnRow: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS2.accent,
    borderWidth: 1.5, borderColor: COLORS2.border,
    borderRadius: 14, paddingVertical: 15,
  },
  cancelText: { fontSize: 14, fontWeight: '700', color: COLORS2.subtext },
  saveBtn: {
    flex: 1.6, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 7,
    backgroundColor: COLORS2.primary,
    borderRadius: 14, paddingVertical: 15,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveText: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});

export default EditModal;
