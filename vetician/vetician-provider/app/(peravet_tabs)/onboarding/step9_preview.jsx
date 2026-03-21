import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Clock, FileText, Award } from 'lucide-react-native';
import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitParavetOnboarding } from '../../../services/paravetApi';


export default function Step9Preview() {
  const router = useRouter();
  const { formData, resetOnboarding, setIsLoading, isLoading, submitOnboarding } = useParavetOnboarding();
  const { user } = useSelector(state => state.auth);
  const [submitted, setSubmitted] = useState(false);

  const profileSections = [
    {
      title: 'Personal Information',
      icon: '👤',
      items: [
        { label: 'Full Name', value: formData.fullName },
        { label: 'Mobile', value: formData.mobileNumber },
        { label: 'Email', value: formData.email },
        { label: 'City', value: formData.city },
        { label: 'Service Area', value: formData.serviceArea },
      ],
    },
    {
      title: 'Professional Details',
      icon: '📚',
      items: [
        { label: 'Experience', value: `${formData.yearsOfExperience} years` },
        { label: 'Areas of Expertise', value: formData.areasOfExpertise.join(', ') },
        { label: 'Languages', value: formData.languagesSpoken.join(', ') },
      ],
    },
    {
      title: 'Payment Details',
      icon: '💰',
      items: [
        { label: 'Payment Method', value: formData.paymentMethod === 'upi' ? 'UPI' : 'Bank Account' },
      ],
    },
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please login again.');
        setIsLoading(false);
        return;
      }
      
      console.log('Submitting onboarding data:', formData);
      
      // Use the context's submitOnboarding function which saves to database
      const result = await submitOnboarding(userId);
      
      console.log('Submission result:', result);
      
      if (result.success) {
        setSubmitted(true);
        // Set flag for home page popup
        await AsyncStorage.setItem('onboarding_completed', 'true');
        // Redirect to home page
        setTimeout(() => {
          resetOnboarding();
          router.replace('/(peravet_tabs)/(tabs)');
        }, 1500);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to submit application. Please try again.');
    }
  };

  if (submitted) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <CheckCircle size={80} color="#34C759" fill="#34C759" />
          </View>
          <Text style={styles.successTitle}>Application Submitted!</Text>
          <Text style={styles.successMessage}>
            Thank you for applying to the Vetician Paravet Partner Program.
          </Text>

          <View style={styles.nextStepsContainer}>
            <Text style={styles.nextStepsTitle}>What Happens Next?</Text>
            
            <View style={styles.nextStepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Documents Verification</Text>
                <Text style={styles.stepDescription}>
                  Our team will verify your documents (24 hours)
                </Text>
              </View>
            </View>

            <View style={styles.nextStepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Admin Review</Text>
                <Text style={styles.stepDescription}>
                  Internal team or partner vet will review (24 hours)
                </Text>
              </View>
            </View>

            <View style={styles.nextStepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Approval & Activation</Text>
                <Text style={styles.stepDescription}>
                  Once approved, you can start accepting requests
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.notificationBox}>
            <Clock size={20} color="#00B0FF" />
            <Text style={styles.notificationText}>
              We'll notify you via email and SMS when your application is approved.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => {
              resetOnboarding();
              router.replace('/(peravet_tabs)/(tabs)');
            }}
          >
            <Text style={styles.dashboardButtonText}>GO TO DASHBOARD</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Step 9 of 9</Text>
        <Text style={styles.heading}>Review Your Profile</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '100%' }]} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>
          Please review your information before submitting. Changes cannot be made after submission.
        </Text>

        {/* Profile Preview */}
        {profileSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{section.icon}</Text>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.itemRow}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemValue}>{item.value || '—'}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Documents Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📄</Text>
            <Text style={styles.sectionTitle}>Documents</Text>
          </View>
          <View style={styles.documentItem}>
            <CheckCircle size={18} color="#34C759" />
            <Text style={styles.documentLabel}>Government ID</Text>
          </View>
          <View style={styles.documentItem}>
            <CheckCircle size={18} color="#34C759" />
            <Text style={styles.documentLabel}>Certification Proof</Text>
          </View>
          {formData.vetRecommendationUrl && (
            <View style={styles.documentItem}>
              <CheckCircle size={18} color="#34C759" />
              <Text style={styles.documentLabel}>Vet Recommendation</Text>
            </View>
          )}
          <View style={styles.documentItem}>
            <CheckCircle size={18} color="#34C759" />
            <Text style={styles.documentLabel}>Profile Photo</Text>
          </View>
        </View>

        {/* Badge Info */}
        {formData.quizPassed && (
          <View style={styles.badgeBox}>
            <Award size={24} color="#FF9500" />
            <View style={styles.badgeContent}>
              <Text style={styles.badgeTitle}>Vetician Verified Paravet Badge</Text>
              <Text style={styles.badgeDescription}>
                You've earned this badge by completing training and quiz
              </Text>
            </View>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.timelineBox}>
          <Text style={styles.timelineTitle}>Approval Timeline</Text>
          <Text style={styles.timelineText}>
            📧 Email verification: 1 hour\n
            ✓ Documents review: 24 hours\n
            👥 Admin review: 24 hours\n
            🎉 Approval: Within 48 hours total
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <FileText size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>SUBMIT APPLICATION</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('./step3_personal_info')}
        >
          <Text style={styles.editButtonText}>EDIT INFORMATION</Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>BACK</Text>
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
    marginBottom: 24,
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  documentLabel: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
    marginLeft: 10,
  },
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFAF0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  badgeContent: {
    marginLeft: 12,
    flex: 1,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    color: '#666',
  },
  timelineBox: {
    backgroundColor: '#E8F4FD',
    borderLeftWidth: 4,
    borderLeftColor: '#00B0FF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 24,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  timelineText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  backButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d0d5dc',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  // Success screen styles
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#34C759',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  nextStepsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  nextStepsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  nextStepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00B0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: '#666',
  },
  notificationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  notificationText: {
    fontSize: 12,
    color: '#0099CC',
    marginLeft: 10,
    flex: 1,
  },
  dashboardButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  dashboardButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
