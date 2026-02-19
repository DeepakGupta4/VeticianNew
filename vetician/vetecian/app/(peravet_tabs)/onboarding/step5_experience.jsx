// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { ChevronDown, Check } from 'lucide-react-native';
// import { useParavetOnboarding } from '../../../contexts/ParavetOnboardingContext';

// export default function Step5Experience() {
//   const router = useRouter();
//   const { formData, updateFormData, updateArrayField, errors, nextStep } = useParavetOnboarding();
//   const [expandedSection, setExpandedSection] = useState(null);

//   const areasOfExpertiseOptions = [
//     'Wound Care',
//     'Injections',
//     'Vaccinations',
//     'Blood Collection',
//     'Post-op Care',
//     'Medication Administration',
//     'Pet Grooming',
//     'Basic Diagnostics',
//   ];

//   const languagesOptions = [
//     'English',
//     'Hindi',
//     'Marathi',
//     'Tamil',
//     'Telugu',
//     'Kannada',
//     'Malayalam',
//     'Bengali',
//   ];

//   const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

//   const toggleArrayItem = (field, value) => {
//     if (formData[field]?.includes(value)) {
//       updateArrayField(field, value, false);
//     } else {
//       updateArrayField(field, value, true);
//     }
//   };

//   const handleNext = () => {
//     if (nextStep()) {
//       router.push('./step6_payment');
//     }
//   };

//   const handleBack = () => {
//     router.back();
//   };

//   const isFormValid = formData.yearsOfExperience &&
//                       formData.areasOfExpertise.length > 0 &&
//                       formData.languagesSpoken.length > 0 &&
//                       formData.availabilityDays.length > 0;

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>Step 5 of 9</Text>
//         <Text style={styles.heading}>Experience & Skills</Text>
//       </View>

//       {/* Progress Bar */}
//       <View style={styles.progressContainer}>
//         <View style={[styles.progressBar, { width: '55%' }]} />
//       </View>

//       {/* Content */}
//       <View style={styles.contentContainer}>
//         {/* Years of Experience */}
//         <View style={styles.formGroup}>
//           <Text style={styles.label}>Years of Experience *</Text>
//           <View style={styles.experienceContainer}>
//             {[0, 1, 2, 3, 5, 10, 15, 20].map((year) => (
//               <TouchableOpacity
//                 key={year}
//                 style={[
//                   styles.experienceChip,
//                   formData.yearsOfExperience === String(year) && styles.experienceChipActive,
//                 ]}
//                 onPress={() => updateFormData('yearsOfExperience', String(year))}
//               >
//                 <Text style={[
//                   styles.experienceChipText,
//                   formData.yearsOfExperience === String(year) && styles.experienceChipTextActive,
//                 ]}>
//                   {year === 0 ? 'Fresher' : year === 20 ? '20+' : `${year}yr`}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           {errors.yearsOfExperience && <Text style={styles.errorText}>{errors.yearsOfExperience}</Text>}
//         </View>

//         {/* Areas of Expertise */}
//         <View style={styles.formGroup}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.label}>Areas of Expertise *</Text>
//             <Text style={styles.selectedCount}>{formData.areasOfExpertise.length} selected</Text>
//           </View>
//           <View style={styles.chipsContainer}>
//             {areasOfExpertiseOptions.map((area) => (
//               <TouchableOpacity
//                 key={area}
//                 style={[
//                   styles.chip,
//                   formData.areasOfExpertise.includes(area) && styles.chipActive,
//                 ]}
//                 onPress={() => toggleArrayItem('areasOfExpertise', area)}
//               >
//                 {formData.areasOfExpertise.includes(area) && (
//                   <Check size={14} color="#fff" style={{ marginRight: 4 }} />
//                 )}
//                 <Text style={[
//                   styles.chipText,
//                   formData.areasOfExpertise.includes(area) && styles.chipTextActive,
//                 ]}>
//                   {area}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           {errors.areasOfExpertise && <Text style={styles.errorText}>{errors.areasOfExpertise}</Text>}
//         </View>

//         {/* Languages Spoken */}
//         <View style={styles.formGroup}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.label}>Languages Spoken *</Text>
//             <Text style={styles.selectedCount}>{formData.languagesSpoken.length} selected</Text>
//           </View>
//           <View style={styles.chipsContainer}>
//             {languagesOptions.map((lang) => (
//               <TouchableOpacity
//                 key={lang}
//                 style={[
//                   styles.chip,
//                   formData.languagesSpoken.includes(lang) && styles.chipActive,
//                 ]}
//                 onPress={() => toggleArrayItem('languagesSpoken', lang)}
//               >
//                 {formData.languagesSpoken.includes(lang) && (
//                   <Check size={14} color="#fff" style={{ marginRight: 4 }} />
//                 )}
//                 <Text style={[
//                   styles.chipText,
//                   formData.languagesSpoken.includes(lang) && styles.chipTextActive,
//                 ]}>
//                   {lang}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           {errors.languagesSpoken && <Text style={styles.errorText}>{errors.languagesSpoken}</Text>}
//         </View>

//         {/* Availability */}
//         <View style={styles.formGroup}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.label}>Availability - Days *</Text>
//             <Text style={styles.selectedCount}>{formData.availabilityDays.length} selected</Text>
//           </View>
//           <View style={styles.daysContainer}>
//             {daysOfWeek.map((day) => (
//               <TouchableOpacity
//                 key={day}
//                 style={[
//                   styles.dayChip,
//                   formData.availabilityDays.includes(day) && styles.dayChipActive,
//                 ]}
//                 onPress={() => toggleArrayItem('availabilityDays', day)}
//               >
//                 <Text style={[
//                   styles.dayChipText,
//                   formData.availabilityDays.includes(day) && styles.dayChipTextActive,
//                 ]}>
//                   {day}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           {errors.availabilityDays && <Text style={styles.errorText}>{errors.availabilityDays}</Text>}
//         </View>

//         {/* Time Range */}
//         <View style={styles.formGroup}>
//           <Text style={styles.label}>Availability - Time Range</Text>
//           <View style={styles.timeContainer}>
//             <View style={styles.timeInput}>
//               <Text style={styles.timeLabel}>From</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="09:00"
//                 value={formData.availabilityStartTime}
//                 onChangeText={(value) => updateFormData('availabilityStartTime', value)}
//               />
//             </View>
//             <View style={styles.timeInput}>
//               <Text style={styles.timeLabel}>To</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="18:00"
//                 value={formData.availabilityEndTime}
//                 onChangeText={(value) => updateFormData('availabilityEndTime', value)}
//               />
//             </View>
//           </View>
//         </View>

//         {/* Navigation Buttons */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//             <Text style={styles.backButtonText}>BACK</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
//             onPress={handleNext}
//             disabled={!isFormValid}
//           >
//             <Text style={styles.nextButtonText}>NEXT</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     paddingHorizontal: 24,
//     paddingTop: 20,
//     paddingBottom: 12,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e1e5e9',
//   },
//   title: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 4,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   progressContainer: {
//     height: 4,
//     backgroundColor: '#e1e5e9',
//     width: '100%',
//   },
//   progressBar: {
//     height: 4,
//     backgroundColor: '#00B0FF',
//   },
//   contentContainer: {
//     padding: 24,
//     paddingBottom: 40,
//   },
//   formGroup: {
//     marginBottom: 24,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1a1a1a',
//     marginBottom: 12,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   selectedCount: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '500',
//   },
//   errorText: {
//     color: '#FF3B30',
//     fontSize: 12,
//     marginTop: 8,
//     fontWeight: '500',
//   },
//   experienceContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   experienceChip: {
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#d0d5dc',
//   },
//   experienceChipActive: {
//     backgroundColor: '#00B0FF',
//     borderColor: '#00B0FF',
//   },
//   experienceChipText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#333',
//   },
//   experienceChipTextActive: {
//     color: '#fff',
//   },
//   chipsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   chip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#d0d5dc',
//   },
//   chipActive: {
//     backgroundColor: '#00B0FF',
//     borderColor: '#00B0FF',
//   },
//   chipText: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#333',
//   },
//   chipTextActive: {
//     color: '#fff',
//   },
//   daysContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   dayChip: {
//     width: '24%',
//     aspectRatio: 1,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#d0d5dc',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   dayChipActive: {
//     backgroundColor: '#34C759',
//     borderColor: '#34C759',
//   },
//   dayChipText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#333',
//   },
//   dayChipTextActive: {
//     color: '#fff',
//   },
//   timeContainer: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   timeInput: {
//     flex: 1,
//   },
//   timeLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 6,
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#d0d5dc',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 13,
//     color: '#1a1a1a',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 24,
//   },
//   backButton: {
//     flex: 1,
//     backgroundColor: '#f0f2f5',
//     borderRadius: 8,
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   backButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   nextButton: {
//     flex: 1,
//     backgroundColor: '#00B0FF',
//     borderRadius: 8,
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   nextButtonDisabled: {
//     backgroundColor: '#ccc',
//   },
//   nextButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//   },
// });

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

  const areasOfExpertiseOptions = [
    'Wound Care', 'Injections', 'Vaccinations', 'Blood Collection',
    'Post-op Care', 'Medication Administration', 'Pet Grooming', 'Basic Diagnostics',
  ];

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
        <FormSection 
          title="Areas of Expertise" 
          count={formData.areasOfExpertise.length}
          error={errors.areasOfExpertise}
        >
          <View style={styles.wrapContainer}>
            {areasOfExpertiseOptions.map((area) => {
              const isSelected = formData.areasOfExpertise.includes(area);
              return (
                <TouchableOpacity
                  key={area}
                  activeOpacity={0.7}
                  style={[styles.pill, isSelected && styles.pillActive]}
                  onPress={() => toggleArrayItem('areasOfExpertise', area)}
                >
                  {isSelected && <Check size={14} color="#FFF" style={styles.checkIcon} />}
                  <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>{area}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </FormSection>

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

