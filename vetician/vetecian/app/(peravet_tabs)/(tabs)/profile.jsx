

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { signOutUser } from '../../../store/slices/authSlice';
import { 
  User, Mail, Calendar, MapPin, Phone, Edit3, LogOut, Settings, 
  Shield, TrendingUp, CheckCircle, AlertCircle, ChevronRight, Award
} from 'lucide-react-native';
import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function Profile() {
  const { user } = useSelector(state => state.auth);
  const { formData } = useParavetOnboarding();
  const dispatch = useDispatch();
  const router = useRouter();

  const [sections, setSections] = useState({
    personalInfo: { completed: false, step: 1 },
    verification: { completed: false, step: 2 },
    experienceSkills: { completed: false, step: 3 },
    bankDetails: { completed: false, step: 4 },
  });

  useEffect(() => {
    const checkCompletion = () => {
      const personalInfoComplete = !!(formData.fullName && formData.mobileNumber && formData.email && formData.city);
      const verificationComplete = !!(formData.governmentIdUrl && formData.certificationProofUrl);
      const experienceComplete = !!(formData.yearsOfExperience && formData.areasOfExpertise?.length > 0);
      const bankDetailsComplete = !!(formData.accountHolderName && formData.paymentValue && formData.pan);

      setSections({
        personalInfo: { completed: personalInfoComplete, step: 1 },
        verification: { completed: verificationComplete, step: 2 },
        experienceSkills: { completed: experienceComplete, step: 3 },
        bankDetails: { completed: bankDetailsComplete, step: 4 },
      });
    };
    checkCompletion();
  }, [formData]);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      await dispatch(signOutUser());
      router.replace('/(auth)/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const completedSections = Object.values(sections).filter(s => s.completed).length;
  const totalSections = Object.keys(sections).length;
  const overallStrength = Math.round((completedSections / totalSections) * 100);

  const sectionConfig = {
    personalInfo: { title: 'Basic Info', icon: User, color: '#6366F1', step: 1 },
    verification: { title: 'Verification', icon: Shield, color: '#8B5CF6', step: 2 },
    experienceSkills: { title: 'Experience', icon: TrendingUp, color: '#10B981', step: 3 },
    bankDetails: { title: 'Bank & Payouts', icon: Award, color: '#F59E0B', step: 4 },
  };

  const handleEditSection = (sectionKey) => {
    const stepMap = { personalInfo: 3, verification: 4, experienceSkills: 5, bankDetails: 6 };
    router.push(`/(peravet_tabs)/onboarding/step${stepMap[sectionKey]}_${sectionKey === 'personalInfo' ? 'personal_info' : sectionKey === 'verification' ? 'documents' : sectionKey === 'experienceSkills' ? 'experience' : 'payment'}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* --- HEADER --- */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Profile</Text>
        </View>

        {/* --- USER CARD --- */}
        <View style={styles.userCardContainer}>
          <TouchableOpacity style={styles.userCard} onPress={() => router.push('/(peravet_tabs)/(tabs)/ProfileDetails')}>
            <View style={styles.userCardContent}>
              <View style={styles.userAvatarSmall}>
                <User size={24} color="#6366F1" strokeWidth={2} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userNameCard}>{user?.name || 'Veterinary Partner'}</Text>
                <Text style={styles.userPhoneCard}>{user?.phone || 'Not Set'}</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* --- PROFILE STRENGTH CARD --- */}
        <View style={styles.strengthCardContainer}>
          <View style={styles.strengthCard}>
            <View style={styles.strengthHeader}>
              <Text style={styles.strengthTitle}>Profile Strength</Text>
              <Text style={styles.strengthPercent}>{overallStrength}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressBarFill, { width: `${overallStrength}%` }]} />
            </View>
            <Text style={styles.strengthSubtext}>Complete your profile to start receiving bookings</Text>
          </View>
        </View>

        {/* --- ONBOARDING SECTIONS AS MENU ITEMS --- */}
        <View style={styles.sectionsContainer}>
          {Object.entries(sectionConfig).map(([key, config]) => {
            const isCompleted = sections[key].completed;
            const Icon = config.icon;
            return (
              <TouchableOpacity 
                key={key}
                style={styles.menuItem}
                onPress={() => handleEditSection(key)}
                activeOpacity={0.6}
              >
                <View style={[styles.menuItemIconBg, { backgroundColor: `${config.color}15` }]}>
                  <Icon size={22} color={config.color} strokeWidth={2} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{config.title}</Text>
                  <Text style={[styles.menuItemStatus, { color: isCompleted ? '#10B981' : '#94A3B8' }]}>
                    {isCompleted ? 'Completed' : 'Action Required'}
                  </Text>
                </View>
                {isCompleted ? (
                  <CheckCircle size={20} color="#10B981" strokeWidth={2} />
                ) : (
                  <ChevronRight size={20} color="#CBD5E1" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* --- QUICK INFO --- */}
        <View style={styles.quickInfoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <MapPin size={16} color="#6366F1" />
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{user?.location || 'Not Set'}</Text>
            </View>
            <View style={styles.infoBox}>
              <Phone size={16} color="#6366F1" />
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phone || 'Not Set'}</Text>
            </View>
          </View>
        </View>

        {/* --- SIGN OUT BUTTON --- */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <View style={styles.signOutIconBg}>
              <LogOut size={20} color="#EF4444" strokeWidth={2} />
            </View>
            <Text style={styles.signOutBtnText}>Sign Out of Account</Text>
            <ChevronRight size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },

  /* Header */
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },

  /* User Card */
  userCardContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 0,
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameCard: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  userPhoneCard: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  /* Strength Card */
  strengthCardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  strengthCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  strengthTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  strengthPercent: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366F1',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  strengthSubtext: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    fontWeight: '500',
  },

  /* Sections Menu */
  sectionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuItemIconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  menuItemStatus: {
    fontSize: 12,
    fontWeight: '500',
  },

  /* Quick Info */
  quickInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },

  /* Sign Out */
  signOutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 8,
  },
  signOutIconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  signOutBtnText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
});