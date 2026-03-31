import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { signOut } from '../../store/slices/authSlice';

import { COLORS2 } from '../../constant/theme';
import Header from '../../components/petparent/setting/Header.jsx';
import ProfileCard from '../../components/petparent/setting/ProfileCard.jsx';
import {
  AccountSettings, SecuritySettings,
  NotificationSettings, PrivacySettings, SupportSettings,
} from '../../components/petparent/setting/SettingsSections.jsx';
import {
  ChangePasswordScreen, DetailScreen,
} from '../../components/petparent/setting/SettingsSubScreens.jsx';
import EditModal from '../../components/petparent/setting/EditModal.jsx';
import ConfirmDialog from '../../components/petparent/setting/ConfirmDialog.jsx';
import LogoutSection from '../../components/petparent/setting/LogoutSection.jsx';

const PRIVACY_POLICY = `Vetician is committed to protecting your privacy. We collect only the information necessary to provide our pet care services, including your name, contact details, and pet information.\n\nYour data is never sold to third parties. We use industry-standard encryption to protect your information. You may request deletion of your account and data at any time by contacting support.\n\nBy using Vetician, you agree to this policy. Last updated: March 2025.`;

const TERMS = `By using Vetician, you agree to use the platform only for lawful purposes. You are responsible for maintaining the confidentiality of your account credentials.\n\nVetician reserves the right to suspend accounts that violate our community guidelines. All bookings are subject to availability and our cancellation policy.\n\nThese terms are governed by the laws of India. Last updated: March 2025.`;

const HELP_CONTENT = `Frequently Asked Questions:\n\n1. How do I book a service?\nGo to the Home tab and select any service. Choose your preferred professional and time slot.\n\n2. How do I cancel a booking?\nGo to Orders, select the booking, and tap Cancel.\n\n3. How do I earn reward points?\nYou earn points automatically on every completed booking.\n\n4. How do I contact a vet?\nUse the Video Consultation feature from the Home screen.\n\nFor more help, contact our support team.`;

export default function SettingsScreen() {
  const router   = useRouter();
  const dispatch = useDispatch();

  const [profile, setProfile]             = useState({ name: 'Sarah Parker', phone: '+91 98765 43210', email: 'sarah@gmail.com' });
  const [notifications, setNotifications] = useState({ app: true, sms: false, email: true });
  const [twoFactor, setTwoFactor]         = useState(false);
  const [subScreen, setSubScreen]         = useState(null);
  const [editModal, setEditModal]         = useState({ visible: false, field: null, value: '' });
  const [confirmDialog, setConfirmDialog] = useState({ visible: false, type: null });

  const openEdit       = useCallback((field) => setEditModal({ visible: true, field, value: profile[field] }), [profile]);
  const handleSaveEdit = useCallback((field, value) => { setProfile(p => ({ ...p, [field]: value })); setEditModal({ visible: false, field: null, value: '' }); }, []);
  const closeEdit      = useCallback(() => setEditModal({ visible: false, field: null, value: '' }), []);
  const handleToggle   = useCallback((key) => setNotifications(p => ({ ...p, [key]: !p[key] })), []);

  const handleLogout        = useCallback(() => setConfirmDialog({ visible: true, type: 'logout' }), []);
  const handleDeleteAccount = useCallback(() => setConfirmDialog({ visible: true, type: 'delete' }), []);
  const handleCancelDialog  = useCallback(() => setConfirmDialog({ visible: false, type: null }), []);

  const handleConfirm = useCallback((type) => {
    setConfirmDialog({ visible: false, type: null });
    if (type === 'logout' || type === 'delete') {
      dispatch(signOut());
      router.replace('/(auth)/signin');
    }
  }, [router, dispatch]);

  if (subScreen === 'changePassword') return <ChangePasswordScreen onBack={() => setSubScreen(null)} />;
  if (subScreen === 'privacy')        return <DetailScreen title="Privacy Policy"     content={PRIVACY_POLICY} onBack={() => setSubScreen(null)} />;
  if (subScreen === 'terms')          return <DetailScreen title="Terms & Conditions" content={TERMS}          onBack={() => setSubScreen(null)} />;
  if (subScreen === 'help')           return <DetailScreen title="Help Center"        content={HELP_CONTENT}   onBack={() => setSubScreen(null)} />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS2.card} />
      <Header onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ProfileCard profile={profile} onEditPress={() => openEdit('name')} />
        <View style={styles.gap} />

        <AccountSettings
          onEditName={()  => openEdit('name')}
          onEditPhone={() => openEdit('phone')}
          onEditEmail={() => openEdit('email')}
        />
        <View style={styles.gap} />

        <SecuritySettings
          twoFactor={twoFactor}
          onChangePassword={() => setSubScreen('changePassword')}
          onToggle2FA={() => setTwoFactor(v => !v)}
        />
        <View style={styles.gap} />

        <NotificationSettings notifications={notifications} onToggle={handleToggle} />
        <View style={styles.gap} />

        <PrivacySettings
          onPrivacyPolicy={() => setSubScreen('privacy')}
          onTerms={() => setSubScreen('terms')}
        />
        <View style={styles.gap} />

        <SupportSettings
          onHelpCenter={() => setSubScreen('help')}
          onContactSupport={() => router.push('/(vetician_tabs)/help')}
        />
        <View style={styles.gap} />

        <LogoutSection onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />
        <View style={{ height: 40 }} />
      </ScrollView>

      <EditModal
        visible={editModal.visible}
        field={editModal.field}
        value={editModal.value}
        onSave={handleSaveEdit}
        onClose={closeEdit}
      />

      <ConfirmDialog
        visible={confirmDialog.visible}
        title={confirmDialog.type === 'logout' ? 'Log Out' : 'Delete Account'}
        message={
          confirmDialog.type === 'logout'
            ? 'Are you sure you want to log out of your account?'
            : 'This will permanently delete your account and all your data. This cannot be undone.'
        }
        icon={confirmDialog.type === 'logout' ? 'logout-variant' : 'delete-forever-outline'}
        confirmText={confirmDialog.type === 'logout' ? 'Log Out' : 'Delete'}
        confirmColor="#C62828"
        requireTyping={confirmDialog.type === 'delete' ? 'DELETE' : undefined}
        onConfirm={() => handleConfirm(confirmDialog.type)}
        onCancel={handleCancelDialog}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS2.bg },
  content: { padding: 16, paddingTop: 20 },
  gap: { height: 12 },
});
