import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, Platform, Switch, Alert, Linking,
  Modal, TextInput, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  X, ChevronRight, Bell, Lock, Globe, HelpCircle,
  Info, Trash2, LogOut, Shield, Phone, Mail, Eye, EyeOff
} from 'lucide-react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';
const NOTIF_KEY = 'vet_notif_settings';

/* ── Sub-components defined OUTSIDE to prevent re-mount on re-render ── */
const SectionHeader = ({ title }) => <Text style={styles.sectionHeader}>{title}</Text>;
const Divider = () => <View style={styles.divider} />;

const RowItem = ({ icon: Icon, iconColor, iconBg, label, value, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress}>
    <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
      <Icon size={19} color={iconColor} />
    </View>
    <View style={styles.rowContent}>
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
    </View>
    {onPress && <ChevronRight size={18} color="#ccc" />}
  </TouchableOpacity>
);

const PwdInput = ({ label, value, onChange, show, setShow }) => (
  <View style={styles.inputBlock}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrap}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        secureTextEntry={!show}
        autoCapitalize="none"
        placeholderTextColor="#bbb"
        placeholder="••••••••"
      />
      <TouchableOpacity onPress={() => setShow(!show)} style={styles.eyeBtn}>
        {show ? <EyeOff size={18} color="#888" /> : <Eye size={18} color="#888" />}
      </TouchableOpacity>
    </View>
  </View>
);

/* ── Main Component ── */
export default function Settings() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [notifAppointments, setNotifAppointments] = useState(true);
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifUpdates, setNotifUpdates] = useState(false);

  const [pwdModal, setPwdModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePwd, setShowDeletePwd] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(NOTIF_KEY).then(val => {
      if (val) {
        const saved = JSON.parse(val);
        setNotifAppointments(saved.appointments ?? true);
        setNotifReminders(saved.reminders ?? true);
        setNotifUpdates(saved.updates ?? false);
      }
    });
  }, []);

  const handleNotifChange = async (key, setter, value) => {
    setter(value);
    const current = { appointments: notifAppointments, reminders: notifReminders, updates: notifUpdates };
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify({ ...current, [key]: value }));
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          const token = await AsyncStorage.getItem('token');
          try {
            await fetch(`${API_URL}/auth/logout`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ refreshToken: token }),
            });
          } catch (_) {}
          await AsyncStorage.multiRemove(['token', 'userId', 'user', 'refreshToken']);
          dispatch({ type: 'auth/signOut' });
          router.replace('/(auth)/signin');
        }
      }
    ]);
  };

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) { Alert.alert('Error', 'Please fill all fields'); return; }
    if (newPwd.length < 6) { Alert.alert('Error', 'New password must be at least 6 characters'); return; }
    if (newPwd !== confirmPwd) { Alert.alert('Error', 'New passwords do not match'); return; }
    if (newPwd === currentPwd) { Alert.alert('Error', 'New password must be different from current'); return; }

    setPwdLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        Alert.alert('Success', 'Password changed successfully');
        setPwdModal(false);
        setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      } else {
        Alert.alert('Error', data.message || 'Failed to change password');
      }
    } catch {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { Alert.alert('Error', 'Please enter your password to confirm'); return; }
    setDeleteLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/delete-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: user?.email, password: deletePassword, loginType: user?.role }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await AsyncStorage.multiRemove(['token', 'userId', 'user', 'refreshToken']);
        dispatch({ type: 'auth/signOut' });
        Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
        router.replace('/(auth)/signin');
      } else {
        Alert.alert('Error', data.message || 'Failed to delete account');
      }
    } catch {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" translucent={false} />

      <LinearGradient colors={['#7CB342', '#558B2F']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSub}>Manage your preferences</Text>
          </View>
          <TouchableOpacity onPress={() => router.replace('/(doc_tabs)/(tabs)/profile')} style={styles.closeBtn}>
            <X size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <SectionHeader title="ACCOUNT" />
        <View style={styles.card}>
          <RowItem icon={Mail} iconColor="#2563EB" iconBg="#DBEAFE" label="Email" value={user?.email || 'Not set'} />
          <Divider />
          <RowItem icon={Phone} iconColor="#059669" iconBg="#D1FAE5" label="Phone" value={user?.phone || 'Not set'} />
          <Divider />
          <RowItem icon={Lock} iconColor="#9333EA" iconBg="#E9D5FF" label="Change Password" onPress={() => setPwdModal(true)} />
        </View>

        <SectionHeader title="NOTIFICATIONS" />
        <View style={styles.card}>
          {[
            { key: 'appointments', label: 'Appointment Alerts', sub: 'New booking notifications', color: '#D97706', bg: '#FEF3C7', value: notifAppointments, setter: setNotifAppointments },
            { key: 'reminders', label: 'Reminders', sub: 'Upcoming appointment reminders', color: '#EF4444', bg: '#FEE2E2', value: notifReminders, setter: setNotifReminders },
            { key: 'updates', label: 'App Updates', sub: 'News and feature updates', color: '#9333EA', bg: '#E9D5FF', value: notifUpdates, setter: setNotifUpdates },
          ].map((item, i, arr) => (
            <View key={item.key}>
              <View style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
                  <Bell size={19} color={item.color} />
                </View>
                <View style={styles.rowContent}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text style={styles.rowValue}>{item.sub}</Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={(v) => handleNotifChange(item.key, item.setter, v)}
                  trackColor={{ false: '#E5E7EB', true: '#7CB342' }}
                  thumbColor="#fff"
                />
              </View>
              {i < arr.length - 1 && <Divider />}
            </View>
          ))}
        </View>

        <SectionHeader title="PRIVACY & SECURITY" />
        <View style={styles.card}>
          <RowItem icon={Shield} iconColor="#0891B2" iconBg="#CFFAFE" label="Privacy Policy"
            onPress={() => router.push('/(doc_tabs)/privacy-policy')} />
          <Divider />
          <RowItem icon={Globe} iconColor="#7CB342" iconBg="#D1FAE5" label="Terms of Service"
            onPress={() => router.push('/(doc_tabs)/terms')} />
        </View>

        <SectionHeader title="SUPPORT" />
        <View style={styles.card}>
          <RowItem icon={HelpCircle} iconColor="#F59E0B" iconBg="#FEF3C7" label="Help & Support"
            onPress={() => Linking.openURL('mailto:support@vetician.com')} />
          <Divider />
          <RowItem icon={Info} iconColor="#6366F1" iconBg="#EDE9FE" label="About Vetician" value="Version 1.0.0" />
        </View>

        <SectionHeader title="ACCOUNT ACTIONS" />
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleSignOut} activeOpacity={0.7}>
            <View style={[styles.iconWrap, { backgroundColor: '#FEE2E2' }]}>
              <LogOut size={19} color="#EF4444" />
            </View>
            <Text style={[styles.rowLabel, { color: '#EF4444', flex: 1 }]}>Sign Out</Text>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity style={styles.row} onPress={() => setDeleteModal(true)} activeOpacity={0.7}>
            <View style={[styles.iconWrap, { backgroundColor: '#FEE2E2' }]}>
              <Trash2 size={19} color="#DC2626" />
            </View>
            <Text style={[styles.rowLabel, { color: '#DC2626', flex: 1 }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={pwdModal} animationType="slide" transparent onRequestClose={() => setPwdModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => { setPwdModal(false); setCurrentPwd(''); setNewPwd(''); setConfirmPwd(''); }}>
                <X size={22} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalDivider} />
            <PwdInput label="Current Password" value={currentPwd} onChange={setCurrentPwd} show={showCurrent} setShow={setShowCurrent} />
            <PwdInput label="New Password" value={newPwd} onChange={setNewPwd} show={showNew} setShow={setShowNew} />
            <PwdInput label="Confirm New Password" value={confirmPwd} onChange={setConfirmPwd} show={showConfirm} setShow={setShowConfirm} />
            <TouchableOpacity style={[styles.actionBtn, pwdLoading && { opacity: 0.6 }]} onPress={handleChangePassword} disabled={pwdLoading}>
              {pwdLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionBtnText}>Update Password</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal visible={deleteModal} animationType="slide" transparent onRequestClose={() => setDeleteModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#DC2626' }]}>Delete Account</Text>
              <TouchableOpacity onPress={() => { setDeleteModal(false); setDeletePassword(''); }}>
                <X size={22} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalDivider} />
            <Text style={styles.deleteWarning}>
              ⚠️ This will permanently delete your account, profile, clinics, and all data. This cannot be undone.
            </Text>
            <PwdInput label="Enter Password to Confirm" value={deletePassword} onChange={setDeletePassword} show={showDeletePwd} setShow={setShowDeletePwd} />
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#DC2626' }, deleteLoading && { opacity: 0.6 }]} onPress={handleDeleteAccount} disabled={deleteLoading}>
              {deleteLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionBtnText}>Permanently Delete Account</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    paddingTop: Platform.OS === 'android' ? 12 : 12,
    paddingBottom: 20, paddingHorizontal: 16,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
  scroll: { flex: 1 },
  sectionHeader: {
    fontSize: 11, fontWeight: '700', color: '#999',
    letterSpacing: 0.8, marginTop: 24, marginBottom: 8, marginHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  iconWrap: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '500', color: '#1A1A1A' },
  rowValue: { fontSize: 12, color: '#888', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 68 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  modalDivider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 20 },
  inputBlock: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F5F5', borderRadius: 12,
    paddingHorizontal: 14, borderWidth: 1, borderColor: '#E0E0E0',
  },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A', paddingVertical: 12 },
  eyeBtn: { padding: 4 },
  actionBtn: {
    backgroundColor: '#7CB342', borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 8,
  },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  deleteWarning: {
    fontSize: 13, color: '#DC2626', backgroundColor: '#FEE2E2',
    borderRadius: 10, padding: 12, marginBottom: 16, lineHeight: 20,
  },
});
