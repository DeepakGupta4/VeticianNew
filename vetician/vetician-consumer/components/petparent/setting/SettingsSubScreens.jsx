import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Platform, KeyboardAvoidingView, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';
import Header from './Header';

// ── Shared InputField ────────────────────────────────────────────────────────
const InputField = ({ label, value, onChangeText, keyboardType, placeholder }) => (
  <View style={fieldStyles.wrap}>
    <Text style={fieldStyles.label}>{label}</Text>
    <TextInput
      style={fieldStyles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || 'default'}
      placeholder={placeholder}
      placeholderTextColor={COLORS2.subtext}
      autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
    />
  </View>
);

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: {
    fontSize: 11, fontWeight: '700', color: COLORS2.subtext,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
  },
  input: {
    borderWidth: 1.5, borderColor: COLORS2.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: COLORS2.text, backgroundColor: COLORS2.card,
  },
});

// ── ChangePasswordScreen ─────────────────────────────────────────────────────
export const ChangePasswordScreen = ({ onBack }) => {
  const [current, setCurrent]       = useState('');
  const [newPwd, setNewPwd]         = useState('');
  const [confirm, setConfirm]       = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = () => {
    if (!current || !newPwd || !confirm) { Alert.alert('Error', 'Please fill all fields.'); return; }
    if (newPwd !== confirm)              { Alert.alert('Error', 'New passwords do not match.'); return; }
    if (newPwd.length < 8)              { Alert.alert('Error', 'Password must be at least 8 characters.'); return; }
    Alert.alert('Success', 'Password updated successfully.', [{ text: 'OK', onPress: onBack }]);
  };

  const PwdInput = ({ label, value, onChange, show, onToggle }) => (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={pwdStyles.inputWrap}>
        <TextInput
          style={[fieldStyles.input, { flex: 1, borderWidth: 0, backgroundColor: 'transparent' }]}
          value={value}
          onChangeText={onChange}
          secureTextEntry={!show}
          placeholder="••••••••"
          placeholderTextColor={COLORS2.subtext}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={onToggle} style={pwdStyles.eyeBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS2.subtext} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS2.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Change Password" subtitle="" onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        <View style={sharedStyles.infoBox}>
          <MaterialCommunityIcons name="information-outline" size={16} color={COLORS2.primary} />
          <Text style={sharedStyles.infoText}>Choose a strong password with at least 8 characters.</Text>
        </View>
        <View style={sharedStyles.card}>
          <PwdInput label="Current Password" value={current} onChange={setCurrent} show={showCurrent} onToggle={() => setShowCurrent(p => !p)} />
          <PwdInput label="New Password"     value={newPwd}  onChange={setNewPwd}  show={showNew}     onToggle={() => setShowNew(p => !p)} />
          <PwdInput label="Confirm Password" value={confirm} onChange={setConfirm} show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />
        </View>
        <TouchableOpacity style={sharedStyles.saveBtn} onPress={handleUpdate} activeOpacity={0.85}>
          <MaterialCommunityIcons name="lock-check-outline" size={18} color="#fff" />
          <Text style={sharedStyles.saveBtnText}>Update Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const pwdStyles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS2.border,
    borderRadius: 12, backgroundColor: COLORS2.card, paddingRight: 10,
  },
  eyeBtn: { padding: 6 },
});

// ── DetailScreen ─────────────────────────────────────────────────────────────
export const DetailScreen = ({ title, content, onBack }) => (
  <View style={{ flex: 1, backgroundColor: COLORS2.bg }}>
    <Header title={title} subtitle="" onBack={onBack} />
    <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
      <View style={sharedStyles.card}>
        <Text style={sharedStyles.body}>{content}</Text>
      </View>
    </ScrollView>
  </View>
);

// ── Shared styles ─────────────────────────────────────────────────────────────
const sharedStyles = StyleSheet.create({
  infoBox: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: COLORS2.accent, borderWidth: 1, borderColor: COLORS2.border,
    borderRadius: 12, padding: 14, marginBottom: 14,
  },
  infoText: { flex: 1, fontSize: 13, color: COLORS2.subtext, lineHeight: 20 },
  card: {
    backgroundColor: COLORS2.card, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS2.border, padding: 16, marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: COLORS2.primary, borderRadius: 14,
    paddingVertical: 15, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  body: { fontSize: 14, color: COLORS2.subtext, lineHeight: 22 },
});
