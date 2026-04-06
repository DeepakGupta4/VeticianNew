import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { Clock, CheckCircle, FileText, AlertCircle, LogOut, RefreshCw } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { COLORS, RADIUS, SPACING, SHADOWS, FONT } from '../../constant/theme';

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
    { icon: FileText,    label: 'Profile Submitted',  done: true,  activeColor: COLORS.primary },
    { icon: Clock,       label: 'Admin Review',        done: false, activeColor: COLORS.amber },
    { icon: CheckCircle, label: 'Account Activated',   done: false, activeColor: COLORS.textMuted },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>UNDER REVIEW</Text>
        </View>

        {/* Icon */}
        <View style={styles.iconWrap}>
          <Clock size={52} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Verification Pending</Text>
        <Text style={styles.subtitle}>
          Your profile has been submitted successfully. Our team will review your documents and activate your account within 7 business days.
        </Text>

        {/* Progress Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsHeading}>Application Progress</Text>
          {steps.map((step, i) => (
            <View key={i}>
              <View style={styles.stepRow}>
                <View style={[styles.stepIcon, { backgroundColor: step.done ? COLORS.primaryPale : '#F3F4F6' }]}>
                  <step.icon size={20} color={step.done ? step.activeColor : COLORS.textMuted} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepLabel, !step.done && styles.stepLabelPending]}>
                    {step.label}
                  </Text>
                  <Text style={styles.stepStatus}>
                    {step.done ? 'Completed' : i === 1 ? 'In progress…' : 'Waiting'}
                  </Text>
                </View>
                {step.done && <CheckCircle size={18} color={COLORS.primary} />}
              </View>
              {i < steps.length - 1 && <View style={styles.stepDivider} />}
            </View>
          ))}
        </View>

        {/* Info box */}
        <View style={styles.infoBox}>
          <AlertCircle size={18} color={COLORS.primary} />
          <Text style={styles.infoText}>
            You will be notified once your account is approved. Ensure your documents are clear and valid.
          </Text>
        </View>

        {/* Check Status */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleCheckStatus} disabled={checking}>
          {checking
            ? <ActivityIndicator color={COLORS.white} />
            : <>
                <RefreshCw size={18} color={COLORS.white} />
                <Text style={styles.primaryBtnText}>Check Approval Status</Text>
              </>
          }
        </TouchableOpacity>

        {/* Edit Profile */}
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => router.push('/(doc_tabs)/onboarding/veterinarian_detail')}
        >
          <FileText size={18} color={COLORS.primary} />
          <Text style={styles.outlineBtnText}>Edit / Resubmit Profile</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={16} color={COLORS.red} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 56,
    paddingBottom: SPACING.xl,
  },
  badge: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: RADIUS.xl,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: SPACING.lg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: FONT.bold,
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primaryPale,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  title: {
    fontSize: 26,
    fontWeight: FONT.bold,
    color: COLORS.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  stepsCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  stepsHeading: {
    fontSize: 13,
    fontWeight: FONT.bold,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  stepDivider: {
    height: 20,
    width: 1.5,
    backgroundColor: COLORS.border,
    marginLeft: 19,
    marginVertical: 2,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: FONT.bold,
    color: COLORS.textDark,
  },
  stepLabelPending: {
    color: COLORS.textMuted,
    fontWeight: FONT.medium,
  },
  stepStatus: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  infoBox: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: COLORS.primaryPale,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    gap: 10,
    marginBottom: SPACING.lg,
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONT.bold,
  },
  outlineBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  outlineBtnText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: FONT.bold,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    marginTop: 4,
  },
  logoutText: {
    color: COLORS.red,
    fontSize: 14,
    fontWeight: FONT.medium,
  },
});
