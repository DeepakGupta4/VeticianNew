import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { Clock, CheckCircle, FileText, AlertCircle, LogOut, RefreshCw } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export default function PendingApproval() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://vetician-backend-kovk.onrender.com/api';

      const res = await fetch(`${API_URL}/auth/veterinarian/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && data.data?.profile?.isVerified) {
        router.replace('/(doc_tabs)/(tabs)');
      } else {
        alert('Your profile is still under review. Please wait for admin approval.');
      }
    } catch (e) {
      alert('Could not check status. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'userId', 'user', 'refreshToken']);
    dispatch({ type: 'auth/signOut' });
    router.replace('/(auth)/signin');
  };

  const steps = [
    { icon: FileText, label: 'Profile Submitted', done: true, color: '#10B981' },
    { icon: Clock,    label: 'Admin Review',      done: false, color: '#F59E0B' },
    { icon: CheckCircle, label: 'Account Activated', done: false, color: '#6B7280' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Icon */}
      <View style={styles.iconWrap}>
        <Clock size={56} color="#F59E0B" />
      </View>

      <Text style={styles.title}>Verification Pending</Text>
      <Text style={styles.subtitle}>
        Your profile has been submitted successfully. Our admin will review your documents and activate your account within 7 business days.
      </Text>

      {/* Steps */}
      <View style={styles.stepsCard}>
        {steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={[styles.stepIcon, { backgroundColor: step.color + '20' }]}>
              <step.icon size={20} color={step.color} />
            </View>
            <Text style={[styles.stepLabel, !step.done && styles.stepLabelPending]}>
              {step.label}
            </Text>
            {step.done && <CheckCircle size={16} color="#10B981" />}
          </View>
        ))}
      </View>

      {/* Info box */}
      <View style={styles.infoBox}>
        <AlertCircle size={18} color="#3B82F6" />
        <Text style={styles.infoText}>
          You will be notified once your account is approved. Make sure your documents are clear and valid.
        </Text>
      </View>

      {/* Check Status Button */}
      <TouchableOpacity style={styles.checkBtn} onPress={handleCheckStatus} disabled={checking}>
        {checking
          ? <ActivityIndicator color="#fff" />
          : <>
              <RefreshCw size={18} color="#fff" />
              <Text style={styles.checkBtnText}>Check Approval Status</Text>
            </>
        }
      </TouchableOpacity>

      {/* Edit Profile */}
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => router.push('/(doc_tabs)/onboarding/veterinarian_detail')}
      >
        <FileText size={18} color="#4A90E2" />
        <Text style={styles.editBtnText}>Edit / Resubmit Profile</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={18} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  stepsCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  stepLabelPending: {
    color: '#9CA3AF',
  },
  infoBox: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    marginBottom: 28,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1D4ED8',
    lineHeight: 20,
  },
  checkBtn: {
    width: '100%',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  checkBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  editBtnText: {
    color: '#4A90E2',
    fontSize: 15,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '500',
  },
});
