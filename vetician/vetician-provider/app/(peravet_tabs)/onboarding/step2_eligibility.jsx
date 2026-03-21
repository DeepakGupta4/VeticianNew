import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Info, ChevronRight } from 'lucide-react-native';

export default function Step2Eligibility() {
  const router = useRouter();

  const handleYesPress = () => {
    // User confirmed they have certification, proceed to step 3
    router.push('./step3_personal_info');
  };

  const handleLearnMore = () => {
    // Redirect to info page
    Alert.alert(
      'Training & Certification',
      'Vetician offers training programs and resources to help you get certified as a paravet professional. Visit our website for more information.',
      [
        { text: 'Dismiss', onPress: () => {} },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Step 2 of 9</Text>
        <Text style={styles.heading}>Role & Eligibility</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '22%' }]} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.questionBox}>
          <Text style={styles.question}>
            Are you a certified paraveterinary professional or trained animal healthcare worker?
          </Text>
        </View>

        {/* Option 1: Yes, I have certification */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={handleYesPress}
        >
          <View style={styles.optionHeader}>
            <CheckCircle size={24} color="#34C759" />
            <Text style={styles.optionTitle}>Yes, I have certification/training</Text>
          </View>
          <Text style={styles.optionDescription}>
            I have completed formal training or certification in paraveterinary services
          </Text>
          <ChevronRight size={20} color="#999" style={styles.optionChevron} />
        </TouchableOpacity>

        {/* Option 2: Learn More */}
        <TouchableOpacity 
          style={[styles.optionCard, styles.optionCardSecondary]}
          onPress={handleLearnMore}
        >
          <View style={styles.optionHeader}>
            <Info size={24} color="#FF9500" />
            <Text style={[styles.optionTitle, styles.optionTitleSecondary]}>
              I want to learn more before joining
            </Text>
          </View>
          <Text style={styles.optionDescription}>
            Explore Vetician's training programs and resources
          </Text>
          <ChevronRight size={20} color="#999" style={styles.optionChevron} />
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Info size={20} color="#00B0FF" />
          <Text style={styles.infoText}>
            Only certified or trained paraveterinary professionals can join the Vetician Partner Program to ensure quality service for pet owners.
          </Text>
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
  },
  questionBox: {
    backgroundColor: '#E8F4FD',
    borderLeftWidth: 4,
    borderLeftColor: '#00B0FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 22,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'column',
  },
  optionCardSecondary: {
    borderColor: '#FF9500',
    backgroundColor: '#FFFAF0',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 12,
    flex: 1,
  },
  optionTitleSecondary: {
    color: '#1a1a1a',
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginLeft: 36,
    marginBottom: 12,
  },
  optionChevron: {
    alignSelf: 'flex-end',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FD',
    borderRadius: 8,
    padding: 12,
    marginTop: 24,
  },
  infoText: {
    fontSize: 13,
    color: '#0099CC',
    lineHeight: 18,
    marginLeft: 12,
    flex: 1,
  },
});
