import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Award, CheckCircle } from 'lucide-react-native';
import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';

export default function Step8Training() {
  const router = useRouter();
  const { formData, updateFormData, nextStep } = useParavetOnboarding();
  const [moduleStarted, setModuleStarted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const modules = [
    {
      id: 1,
      title: 'Using the Vetician App',
      duration: '3 mins',
      description: 'Learn how to navigate and use the Vetician mobile app to accept requests and manage visits.',
    },
    {
      id: 2,
      title: 'Reporting Visit Summaries',
      duration: '2 mins',
      description: 'How to document and report your visit activities accurately.',
    },
    {
      id: 3,
      title: 'When to Escalate to a Vet',
      duration: '4 mins',
      description: 'Understand critical conditions and when to involve veterinarians.',
    },
    {
      id: 4,
      title: 'Pet Handling Best Practices',
      duration: '3 mins',
      description: 'Safety techniques for handling different types of pets professionally.',
    },
  ];

  const handleStartModule = () => {
    Alert.alert(
      'Training Module',
      'This is a quick 5-10 minute training to help you get started with Vetician.\n\nYou\'ll learn:\n• App navigation\n• Visit procedures\n• Safety guidelines\n• Best practices',
      [
        {
          text: 'Start Training',
          onPress: () => {
            setModuleStarted(true);
            setTimeout(() => {
              Alert.alert(
                'Training Complete!',
                'Excellent! You\'ve completed the training module.',
                [
                  {
                    text: 'Take Quiz',
                    onPress: () => startQuiz(),
                  },
                ]
              );
            }, 2000);
          },
        },
        {
          text: 'Skip for Now',
          onPress: () => {
            updateFormData('trainingCompleted', true);
            updateFormData('quizPassed', false);
            if (nextStep()) {
              router.push('./step9_preview');
            }
          },
        },
      ]
    );
  };

  const startQuiz = () => {
    setQuizStarted(true);
    Alert.alert(
      'Quick Quiz',
      'Answer the following question:\n\nWhat should you do if you encounter a critical condition?',
      [
        {
          text: 'Escalate to a veterinarian immediately',
          onPress: () => {
            Alert.alert(
              '🎉 Correct!',
              'Congratulations! You passed the quiz and earned the "Vetician Verified Paravet" badge!',
              [
                {
                  text: 'Continue',
                  onPress: () => {
                    updateFormData('trainingCompleted', true);
                    updateFormData('quizPassed', true);
                    if (nextStep()) {
                      router.push('./step9_preview');
                    }
                  },
                },
              ]
            );
          },
        },
        {
          text: 'Try to handle it myself',
          onPress: () => {
            Alert.alert(
              'Not Quite',
              'Remember: Always escalate serious issues to a veterinarian. Try again!',
              [{ text: 'Got it', onPress: () => setQuizStarted(false) }]
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Step 8 of 9</Text>
        <Text style={styles.heading}>Training Module</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '89%' }]} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>
          Complete this quick training to earn your "Vetician Verified Paravet" badge (Optional but Recommended)
        </Text>

        {/* Training Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewIcon}>
            <Play size={32} color="#00B0FF" />
          </View>
          <View style={styles.overviewContent}>
            <Text style={styles.overviewTitle}>5-10 Minutes Training</Text>
            <Text style={styles.overviewDescription}>
              Interactive video modules on app usage, best practices, and safety guidelines.
            </Text>
          </View>
        </View>

        {/* Module List */}
        <Text style={styles.modulesTitle}>Training Modules Included</Text>
        {modules.map((module) => (
          <View key={module.id} style={styles.moduleCard}>
            <View style={styles.moduleIcon}>
              <Play size={16} color="#fff" />
            </View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDescription}>{module.description}</Text>
            </View>
            <Text style={styles.moduleDuration}>{module.duration}</Text>
          </View>
        ))}

        {/* Benefits Box */}
        <View style={styles.benefitsBox}>
          <View style={styles.benefitItem}>
            <Award size={20} color="#FF9500" />
            <Text style={styles.benefitText}>Earn "Vetician Verified Paravet" badge</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#34C759" />
            <Text style={styles.benefitText}>Increase visibility to pet owners</Text>
          </View>
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color="#34C759" />
            <Text style={styles.benefitText}>Higher chances of receiving requests</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartModule}
          >
            <Play size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryButtonText}>START TRAINING</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              updateFormData('trainingCompleted', false);
              updateFormData('quizPassed', false);
              if (nextStep()) {
                router.push('./step9_preview');
              }
            }}
          >
            <Text style={styles.secondaryButtonText}>SKIP FOR NOW</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>BACK</Text>
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
  overviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  overviewIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E8F4FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  overviewContent: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  overviewDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  modulesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  moduleIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#00B0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  moduleDescription: {
    fontSize: 11,
    color: '#666',
    lineHeight: 14,
  },
  moduleDuration: {
    fontSize: 11,
    fontWeight: '500',
    color: '#999',
  },
  benefitsBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
    marginLeft: 12,
  },
  actionButtonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#00B0FF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    marginTop: 12,
  },
  backButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d0d5dc',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
