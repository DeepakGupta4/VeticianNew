import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Shield, AlertTriangle, Sparkles, ClipboardList } from 'lucide-react-native';
import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';

export default function Step7CodeOfConduct() {
  const router = useRouter();
  const { updateFormData } = useParavetOnboarding();
  const [agreed, setAgreed] = useState(false);

  const policies = [
    {
      icon: <AlertTriangle size={20} color="#F59E0B" />,
      bg: '#FFFBEB',
      title: 'No Unauthorized Treatments',
      description: 'Only perform services you are certified for. Never exceed your scope of practice.',
    },
    {
      icon: <Shield size={20} color="#EF4444" />,
      bg: '#FEF2F2',
      title: 'Always Escalate Serious Issues',
      description: 'If you encounter a critical condition, immediately escalate to a veterinarian.',
    },
    {
      icon: <Sparkles size={20} color="#8B5CF6" />,
      bg: '#F5F3FF',
      title: 'Maintain Hygiene & Professionalism',
      description: 'Follow strict hygiene protocols, arrive on time, and maintain professional behavior.',
    },
    {
      icon: <CheckCircle size={20} color="#4CAF50" />,
      bg: '#E8F5E9',
      title: 'Get Consent Before Procedures',
      description: 'Always explain procedures to pet owners and get their explicit consent.',
    },
    {
      icon: <Shield size={20} color="#3B82F6" />,
      bg: '#EFF6FF',
      title: 'Respect & Safety First',
      description: 'Treat pet owners and pets with respect. Follow all safety guidelines.',
    },
    {
      icon: <ClipboardList size={20} color="#4CAF50" />,
      bg: '#E8F5E9',
      title: 'Document Everything',
      description: 'Maintain detailed records of all visits and procedures performed.',
    },
  ];

  const handleAgree = () => {
    if (!agreed) return;
    updateFormData('agreedToCodeOfConduct', true);
    router.push('./step8_training');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepText}>Step 7 of 9</Text>
        <Text style={styles.heading}>Code of Conduct & Safety</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '78%' }]} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Intro Card */}
        <View style={styles.introCard}>
          <Shield size={28} color="#4CAF50" />
          <Text style={styles.introText}>
            As a Vetician Partner, please review and agree to our Code of Conduct and Safety Guidelines before proceeding.
          </Text>
        </View>

        {/* Policies */}
        {policies.map((policy, index) => (
          <View key={index} style={styles.policyCard}>
            <View style={[styles.policyIconBox, { backgroundColor: policy.bg }]}>
              {policy.icon}
            </View>
            <View style={styles.policyContent}>
              <Text style={styles.policyTitle}>{policy.title}</Text>
              <Text style={styles.policyDesc}>{policy.description}</Text>
            </View>
          </View>
        ))}

        {/* Agreement Checkbox */}
        <TouchableOpacity
          style={[styles.agreementBox, agreed && styles.agreementBoxChecked]}
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <CheckCircle size={18} color="#fff" fill="#4CAF50" />}
          </View>
          <Text style={styles.agreementText}>
            I have read and agree to follow the Vetician Code of Conduct and Safety Guidelines
          </Text>
        </TouchableOpacity>

        {/* Warning Box */}
        <View style={styles.warningBox}>
          <AlertTriangle size={16} color="#B45309" />
          <Text style={styles.warningText}>
            Violation of these guidelines may result in suspension or removal from the platform.
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextBtn, !agreed && styles.nextBtnDisabled]}
          onPress={handleAgree}
        >
          <CheckCircle size={18} color="#fff" />
          <Text style={styles.nextBtnText}>I AGREE & CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e1e5e9',
  },
  stepText: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 4 },
  heading: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  progressContainer: { height: 4, backgroundColor: '#e1e5e9' },
  progressBar: { height: 4, backgroundColor: '#4CAF50' },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 16 },

  introCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#E8F5E9', borderRadius: 12, padding: 16,
    marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#4CAF50',
  },
  introText: { flex: 1, fontSize: 14, color: '#2E7D32', lineHeight: 20 },

  policyCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#e1e5e9',
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 }, shadowRadius: 3,
  },
  policyIconBox: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  policyContent: { flex: 1 },
  policyTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  policyDesc: { fontSize: 12, color: '#666', lineHeight: 17 },

  agreementBox: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    borderWidth: 2, borderColor: '#e1e5e9', marginTop: 8, marginBottom: 12,
  },
  agreementBoxChecked: { borderColor: '#4CAF50', backgroundColor: '#E8F5E9' },
  checkbox: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 2,
    borderColor: '#ccc', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxChecked: { borderColor: '#4CAF50', backgroundColor: '#4CAF50' },
  agreementText: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1a1a1a', lineHeight: 20 },

  warningBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#FFFBEB', borderRadius: 10, padding: 12,
    borderLeftWidth: 3, borderLeftColor: '#F59E0B',
  },
  warningText: { flex: 1, fontSize: 12, color: '#92400E', lineHeight: 18 },

  footer: {
    flexDirection: 'row', gap: 12, padding: 20,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e1e5e9',
  },
  backBtn: {
    flex: 1, backgroundColor: '#f0f2f5', borderRadius: 10,
    paddingVertical: 15, alignItems: 'center',
  },
  backBtnText: { fontSize: 15, fontWeight: '600', color: '#333' },
  nextBtn: {
    flex: 2, backgroundColor: '#4CAF50', borderRadius: 10,
    paddingVertical: 15, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
    elevation: 3, shadowColor: '#4CAF50', shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 6,
  },
  nextBtnDisabled: { backgroundColor: '#ccc', elevation: 0, shadowOpacity: 0 },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
