import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';

const { width } = Dimensions.get('window');

export default function Step7CodeOfConduct() {
  const router = useRouter();
  const { formData, updateFormData, nextStep } = useParavetOnboarding();

  const policies = [
    {
      icon: '⚠️',
      title: 'No Unauthorized Treatments',
      description: 'Only perform services you are certified for. Never exceed your scope of practice.',
    },
    {
      icon: '🚨',
      title: 'Always Escalate Serious Issues',
      description: 'If you encounter a critical condition, immediately escalate to a veterinarian.',
    },
    {
      icon: '✨',
      title: 'Maintain Hygiene & Professionalism',
      description: 'Follow strict hygiene protocols, arrive on time, and maintain professional behavior.',
    },
    {
      icon: '🤝',
      title: 'Get Consent Before Procedures',
      description: 'Always explain procedures to pet owners and get their explicit consent.',
    },
    {
      icon: '🛡️',
      title: 'Respect & Safety First',
      description: 'Treat pet owners and pets with respect. Follow all safety guidelines.',
    },
    {
      icon: '📋',
      title: 'Document Everything',
      description: 'Maintain detailed records of all visits and procedures performed.',
    },
  ];

  const handleAgree = () => {
    updateFormData('agreedToCodeOfConduct', true);
    if (nextStep()) {
      router.push('./step8_training');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Step 7 of 9</Text>
        <Text style={styles.heading}>Code of Conduct & Safety</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '78%' }]} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>
          As a Vetician Partner, please review and agree to our Code of Conduct and Safety Guidelines
        </Text>

        {/* Policies */}
        <View style={styles.policiesContainer}>
          {policies.map((policy, index) => (
            <View key={index} style={styles.policyCard}>
              <View style={styles.policyIcon}>
                <Text style={styles.policyIconText}>{policy.icon}</Text>
              </View>
              <View style={styles.policyContent}>
                <Text style={styles.policyTitle}>{policy.title}</Text>
                <Text style={styles.policyDescription}>{policy.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Agreement Checkbox */}
        <TouchableOpacity
          style={styles.agreementBox}
          onPress={() => updateFormData('agreedToCodeOfConduct', !formData.agreedToCodeOfConduct)}
        >
          <View style={[
            styles.checkbox,
            formData.agreedToCodeOfConduct && styles.checkboxChecked,
          ]}>
            {formData.agreedToCodeOfConduct && (
              <CheckCircle2 size={20} color="#34C759" fill="#34C759" />
            )}
          </View>
          <Text style={styles.agreementText}>
            I agree to follow the Vetician Code of Conduct and Safety Guidelines
          </Text>
        </TouchableOpacity>

        {/* Terms Note */}
        <View style={styles.termsBox}>
          <Text style={styles.termsText}>
            By proceeding, you understand that violation of these guidelines may result in suspension or removal from the platform.
          </Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>BACK</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !formData.agreedToCodeOfConduct && styles.nextButtonDisabled,
            ]}
            onPress={handleAgree}
            disabled={!formData.agreedToCodeOfConduct}
          >
            <Text style={styles.nextButtonText}>I AGREE & CONTINUE</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e1e5e9',
    width: '100%',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#00B0FF',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  policiesContainer: {
    marginBottom: 24,
  },
  policyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  policyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  policyIconText: {
    fontSize: 20,
  },
  policyContent: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  policyDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  agreementBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d0d5dc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: '#34C759',
    backgroundColor: 'transparent',
  },
  agreementText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
    lineHeight: 18,
  },
  termsBox: {
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
    borderRadius: 8,
    padding: 12,
    marginBottom: 32,
  },
  termsText: {
    fontSize: 12,
    color: '#B8860B',
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
