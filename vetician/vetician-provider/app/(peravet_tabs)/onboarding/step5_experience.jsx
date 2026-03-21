

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Check, ArrowLeft, Clock } from 'lucide-react-native';
import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';

// Define theme colors for consistency
const THEME = {
  primary: '#0066FF',
  primaryLight: '#E5F0FF',
  textMain: '#111827',
  textSecondary: '#6B7280',
  background: '#F5F7FA',
  cardBg: '#FFFFFF',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
};

export default function Step5Experience() {
  const router = useRouter();
  const { formData, updateFormData, updateArrayField, errors, nextStep } = useParavetOnboarding();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  const expertiseCategories = {
    'Clinical Care': [
      'Wound Care & Dressing', 'Injection Administration (IV/IM/SC)', 'Vaccination Support',
      'IV Fluid Therapy', 'Catheter Placement', 'Vital Signs Monitoring',
      'Emergency First Aid', 'Medication Administration'
    ],
    'Diagnostic Support': [
      'Blood Collection', 'Urine Sample Collection', 'Lab Sample Handling',
      'X-ray Assistance', 'Ultrasound Assistance', 'ECG Assistance', 'Basic Diagnostics'
    ],
    'Surgical Assistance': [
      'Pre-operative Preparation', 'OT Assistance', 'Post-operative Care',
      'Anesthesia Monitoring Support', 'Sterilization & Instrument Handling'
    ],
    'Pet Care Services': [
      'Pet Grooming', 'Nail Trimming', 'Ear Cleaning',
      'Oral Hygiene Support', 'Tick & Flea Treatment', 'Deworming Support'
    ],
    'Home Visit Services': [
      'Home Vaccination', 'Home Wound Dressing', 'Home IV Therapy', 'Elderly Pet Care Support'
    ]
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const getFilteredSkills = () => {
    if (!searchQuery) return expertiseCategories;
    
    const filtered = {};
    Object.keys(expertiseCategories).forEach(category => {
      const matchingSkills = expertiseCategories[category].filter(skill =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchingSkills.length > 0) {
        filtered[category] = matchingSkills;
      }
    });
    return filtered;
  };

  const languagesOptions = [
    'English', 'Hindi', 'Marathi', 'Tamil',
    'Telugu', 'Kannada', 'Malayalam', 'Bengali',
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleArrayItem = (field, value) => {
    const isSelected = formData[field]?.includes(value);
    updateArrayField(field, value, !isSelected);
  };

  const handleNext = () => {
    if (nextStep()) {
      router.push('./step6_payment');
    }
  };

  const isFormValid = formData.yearsOfExperience &&
                      formData.areasOfExpertise.length > 0 &&
                      formData.languagesSpoken.length > 0 &&
                      formData.availabilityDays.length > 0;

  // Reusable Section Component
  const FormSection = ({ title, count, error, children }) => (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {count !== undefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count} selected</Text>
          </View>
        )}
      </View>
      {children}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.cardBg} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back} style={styles.backIcon}>
          <ArrowLeft size={24} color={THEME.textMain} />
        </TouchableOpacity>
        <View style={styles.headerTexts}>
          <Text style={styles.stepText}>Step 5 of 9</Text>
          <Text style={styles.headerTitle}>Experience & Skills</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '55%' }]} />
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Years of Experience */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Years of Experience <Text style={styles.required}>*</Text></Text>
          <View style={styles.gridContainer}>
            {[0, 1, 2, 3, 5, 10, 15, 20].map((year) => {
              const isSelected = formData.yearsOfExperience === String(year);
              return (
                <TouchableOpacity
                  key={year}
                  activeOpacity={0.7}
                  style={[styles.optionChip, isSelected && styles.optionChipActive]}
                  onPress={() => updateFormData('yearsOfExperience', String(year))}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                    {year === 0 ? 'Fresher' : year === 20 ? '20+ Yrs' : `${year} Yrs`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.yearsOfExperience && <Text style={styles.errorText}>{errors.yearsOfExperience}</Text>}
        </View>

        {/* Areas of Expertise */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Areas of Expertise <Text style={styles.required}>*</Text></Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{formData.areasOfExpertise.length} selected</Text>
            </View>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search skills..."
              placeholderTextColor={THEME.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Categorized Skills */}
          {Object.entries(getFilteredSkills()).map(([category, skills]) => (
            <View key={category} style={styles.categoryContainer}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleCategory(category)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.categoryIcon}>{expandedCategories[category] ? '−' : '+'}</Text>
              </TouchableOpacity>
              
              {expandedCategories[category] && (
                <View style={styles.skillsContainer}>
                  {skills.map((skill) => {
                    const isSelected = formData.areasOfExpertise.includes(skill);
                    return (
                      <TouchableOpacity
                        key={skill}
                        activeOpacity={0.7}
                        style={[styles.skillPill, isSelected && styles.skillPillActive]}
                        onPress={() => toggleArrayItem('areasOfExpertise', skill)}
                      >
                        {isSelected && <Check size={14} color="#FFF" style={styles.checkIcon} />}
                        <Text style={[styles.skillText, isSelected && styles.skillTextActive]}>{skill}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          ))}
          {errors.areasOfExpertise && <Text style={styles.errorText}>{errors.areasOfExpertise}</Text>}
        </View>

        {/* Languages Spoken */}
        <FormSection 
          title="Languages Spoken" 
          count={formData.languagesSpoken.length}
          error={errors.languagesSpoken}
        >
          <View style={styles.wrapContainer}>
            {languagesOptions.map((lang) => {
              const isSelected = formData.languagesSpoken.includes(lang);
              return (
                <TouchableOpacity
                  key={lang}
                  activeOpacity={0.7}
                  style={[styles.pill, isSelected && styles.pillActive]}
                  onPress={() => toggleArrayItem('languagesSpoken', lang)}
                >
                   {isSelected && <Check size={14} color="#FFF" style={styles.checkIcon} />}
                  <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>{lang}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </FormSection>

        {/* Availability Days */}
        <FormSection 
          title="Availability - Days" 
          count={formData.availabilityDays.length}
          error={errors.availabilityDays}
        >
          <View style={styles.daysGrid}>
            {daysOfWeek.map((day) => {
              const isSelected = formData.availabilityDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  activeOpacity={0.7}
                  style={[styles.dayCircle, isSelected && styles.dayCircleActive]}
                  onPress={() => toggleArrayItem('availabilityDays', day)}
                >
                  <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </FormSection>

        {/* Time Range */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Availability - Time Range</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeInputWrapper}>
              <Text style={styles.labelSmall}>From</Text>
              <View style={styles.inputContainer}>
                <Clock size={18} color={THEME.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="09:00"
                  placeholderTextColor={THEME.textSecondary}
                  value={formData.availabilityStartTime}
                  onChangeText={(value) => updateFormData('availabilityStartTime', value)}
                  maxLength={5}
                />
              </View>
            </View>
            <View style={styles.timeInputWrapper}>
              <Text style={styles.labelSmall}>To</Text>
              <View style={styles.inputContainer}>
                <Clock size={18} color={THEME.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="18:00"
                  placeholderTextColor={THEME.textSecondary}
                  value={formData.availabilityEndTime}
                  onChangeText={(value) => updateFormData('availabilityEndTime', value)}
                  maxLength={5}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Spacer for bottom buttons */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer / Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.btnSecondary} 
          onPress={router.back}
          activeOpacity={0.8}
        >
          <Text style={styles.btnSecondaryText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.btnPrimary, !isFormValid && styles.btnDisabled]}
          onPress={handleNext}
          disabled={!isFormValid}
          activeOpacity={0.8}
        >
          <Text style={styles.btnPrimaryText}>Next Step</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: THEME.cardBg,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backIcon: {
    marginRight: 16,
    padding: 4,
  },
  stepText: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.textMain,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME.primary,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  
  // Cards
  card: {
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textMain,
  },
  required: {
    color: THEME.error,
  },
  badge: {
    backgroundColor: THEME.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '600',
  },
  errorText: {
    color: THEME.error,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },

  // Experience Chips
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionChip: {
    width: '23%', // approx 4 columns
    margin: '1%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: THEME.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionChipActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.textMain,
  },
  optionTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },

  // Tags/Pills
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  pillActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  checkIcon: {
    marginRight: 6,
  },
  pillText: {
    fontSize: 14,
    color: THEME.textMain,
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },

  // Search
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: THEME.textMain,
  },

  // Categories
  categoryContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.textMain,
  },
  categoryIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  skillsContainer: {
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#FFF',
  },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  skillPillActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  skillText: {
    fontSize: 13,
    color: THEME.textMain,
    fontWeight: '500',
  },
  skillTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },

  // Days
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: THEME.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: THEME.success, // Green for availability usually works well
    borderColor: THEME.success,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textMain,
  },
  dayTextActive: {
    color: '#FFF',
  },

  // Inputs
  timeRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  timeInputWrapper: {
    flex: 1,
  },
  labelSmall: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textSecondary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: THEME.textMain,
    fontWeight: '500',
  },

  // Footer
  footer: {
    padding: 20,
    backgroundColor: THEME.cardBg,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    flexDirection: 'row',
    gap: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 20, // Add more padding for iPhone X home bar if needed
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.textMain,
  },
  btnPrimary: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    // Shadow for button pop
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});

