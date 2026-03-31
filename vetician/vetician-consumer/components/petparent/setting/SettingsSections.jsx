import React from 'react';
import { View, Text, Switch, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS2 } from '../../../constant/theme';
import SettingItem from './SettingItem';

export const SectionCard = ({ iconName, title, children }) => (
  <View style={sectionStyles.card}>
    <View style={sectionStyles.sectionHeader}>
      <View style={sectionStyles.iconBox}>
        <MaterialCommunityIcons name={iconName} size={15} color={COLORS2.primary} />
      </View>
      <Text style={sectionStyles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS2.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS2.border,
    overflow: 'hidden',
    marginBottom: 2,
    ...Platform.select({
      ios:     { shadowColor: '#1A3A08', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8,
  },
  iconBox: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: COLORS2.accent, borderWidth: 1, borderColor: COLORS2.border,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 11, fontWeight: '800', color: COLORS2.primary,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
});

export const AccountSettings = ({ onEditName, onEditPhone, onEditEmail }) => (
  <SectionCard iconName="account-circle-outline" title="Account Settings">
    <SettingItem icon="account-edit-outline" label="Change Name" subtitle="Update your display name" onPress={onEditName} />
    
    <SettingItem icon="email-edit-outline" label="Change Email" subtitle="Update your email address" onPress={onEditEmail} isLast />
  </SectionCard>
);

export const SecuritySettings = ({ twoFactor, onChangePassword, onToggle2FA }) => (
  <SectionCard iconName="shield-lock-outline" title="Security">
    <SettingItem
      icon="lock-reset"
      label="Change Password"
      subtitle="Update your login password"
      onPress={onChangePassword}
    />
   
  </SectionCard>
);

export const NotificationSettings = ({ notifications, onToggle }) => {
  const items = [
    { key: 'app',   icon: 'bell-outline',    label: 'App Notifications', subtitle: 'Push alerts from Vetician' },
    { key: 'sms',   icon: 'message-outline', label: 'SMS Notifications', subtitle: 'Text message alerts' },
    { key: 'email', icon: 'email-outline',   label: 'Email Notifications', subtitle: 'Updates to your inbox' },
  ];
  return (
    <SectionCard iconName="bell-outline" title="Notifications">
      {items.map((item, i) => (
        <SettingItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          subtitle={item.subtitle}
          isLast={i === items.length - 1}
          onPress={() => onToggle(item.key)}
          rightEl={
            <Switch
              value={notifications[item.key]}
              onValueChange={() => onToggle(item.key)}
              trackColor={{ false: COLORS2.border, true: COLORS2.secondary }}
              thumbColor={COLORS2.card}
              ios_backgroundColor={COLORS2.border}
            />
          }
        />
      ))}
    </SectionCard>
  );
};

export const PrivacySettings = ({ onPrivacyPolicy, onTerms }) => (
  <SectionCard iconName="shield-account-outline" title="Privacy">
    <SettingItem icon="shield-account-outline" label="Privacy Policy" subtitle="How we handle your data" onPress={onPrivacyPolicy} />
    <SettingItem icon="file-document-outline" label="Terms & Conditions" subtitle="Rules governing app use" onPress={onTerms} isLast />
  </SectionCard>
);

export const SupportSettings = ({ onHelpCenter, onContactSupport }) => (
  <SectionCard iconName="headset" title="Support">
    <SettingItem icon="headset" label="Contact Support" subtitle="Get help from our team" onPress={onContactSupport} isLast />
  </SectionCard>
);

export default AccountSettings;
