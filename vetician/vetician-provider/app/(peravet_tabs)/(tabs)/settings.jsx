import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Bell, Shield, Palette, Globe, CircleHelp as HelpCircle, ChevronRight, LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut as signOutThunk } from '../../../store/slices/authSlice';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

export default function Settings() {
  const { user } = useSelector(state => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = async () => {
    console.log('🔵 handleLogout called - Starting immediate logout');
    try {
      console.log('🔓 Starting logout process...');
      
      // Dispatch the signOut thunk which handles backend API call and storage cleanup
      console.log('🚀 About to dispatch signOutThunk...');
      await dispatch(signOutThunk()).unwrap();
      
      console.log('✅ Logout complete!');
      
      // Navigate to sign in
      console.log('🔄 Navigating to sign in screen...');
      router.replace('/(auth)/signin');
      console.log('✅ Navigation complete!');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Force logout even if there's an error
      console.log('⚠️ Force logout initiated due to error');
      await AsyncStorage.clear();
      dispatch({ type: 'auth/signOut' });
      router.replace('/(auth)/signin');
      console.log('✅ Force logout complete');
    }
  };

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          title: 'Notifications',
          subtitle: 'Manage your notification preferences',
          type: 'switch',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: Palette,
          title: 'Dark Mode',
          subtitle: 'Switch between light and dark themes',
          type: 'switch',
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled,
        },
        {
          icon: Globe,
          title: 'Language',
          subtitle: 'English (US)',
          type: 'navigate',
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          icon: Shield,
          title: 'Privacy Settings',
          subtitle: 'Manage your privacy preferences',
          type: 'navigate',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          type: 'navigate',
          onPress: () => router.push('/(peravet_tabs)/(tabs)/help'),
        },
      ],
    },
  ];

  const renderSettingItem = (item, index) => (
    <TouchableOpacity 
      key={index} 
      style={styles.settingItem}
      onPress={item.onPress}
    >
      <View style={styles.settingIcon}>
        <item.icon size={20} color="#007AFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      <View style={styles.settingAction}>
        {item.type === 'switch' ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#e1e5e9', true: '#007AFF' }}
            thumbColor="#fff"
          />
        ) : (
          <ChevronRight size={20} color="#666" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your app preferences</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
        </View>

        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupContainer}>
              {group.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </View>
          </View>
        ))}

        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>App Information</Text>
          <View style={styles.appInfoContainer}>
            <View style={styles.appInfoItem}>
              <Text style={styles.appInfoLabel}>Version</Text>
              <Text style={styles.appInfoValue}>1.0.0</Text>
            </View>
            <View style={[styles.appInfoItem, { borderBottomWidth: 0 }]}>
              <Text style={styles.appInfoLabel}>Build</Text>
              <Text style={styles.appInfoValue}>100</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 24,
  },
  userSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    marginBottom: 32,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  settingsGroup: {
    marginBottom: 32,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  groupContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingAction: {
    marginLeft: 16,
  },
  appInfo: {
    marginTop: 16,
  },
  appInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  appInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  appInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 8,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  appInfoLabel: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  appInfoValue: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});