import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  TextInput,
  Button,
  Chip,
  SegmentedButtons,
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { registerPet } from '../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7CB342',
    secondary: '#558B2F',
    tertiary: '#558B2F',
    error: '#f13c20',
  },
};

const PRIMARY_GREEN = '#7CB342';
const DARK_GREEN = '#558B2F';

const menuItems = [
  {
    id: 'details',
    title: 'Profile Details',
    subtitle: 'Name, Breed, Birthday, etc.',
    icon: 'paw',
  },
  {
    id: 'medical',
    title: 'Medical Records',
    subtitle: 'View Prescriptions & Lab Reports',
    icon: 'medical-bag',
  },
  {
    id: 'appointments',
    title: 'Appointments & Orders',
    subtitle: 'Check Invoices and Order details',
    icon: 'calendar-check',
  },
  {
    id: 'vaccination',
    title: 'Vaccination',
    subtitle: 'View Pet Vaccination Records',
    icon: 'syringe',
  },
  {
    id: 'help',
    title: 'Need Help',
    subtitle: 'Whisker Your Worries Away',
    icon: 'help-circle',
  },
  {
    id: 'membership',
    title: 'Premium Membership',
    subtitle: 'Check your membership utilisation',
    icon: 'heart',
  },
];

function PetDetailForm({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    location: '',
    dob: '',
    bloodGroup: '',
    height: '',
    weight: '',
    color: '',
    distinctiveFeatures: '',
    allergies: '',
    currentMedications: '',
    chronicDiseases: '',
    injuries: '',
    surgeries: '',
    vaccinations: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);

  const speciesOptions = [
    { label: 'Dog', value: 'Dog' },
    { label: 'Cat', value: 'Cat' },
    { label: 'Bird', value: 'Bird' },
    { label: 'Other', value: 'Other' }
  ];

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Neutered', value: 'Neutered' },
    { label: 'Spayed', value: 'Spayed' },
    { label: 'Unknown', value: 'Unknown' }
  ];

  const bloodGroupOptions = ['A', 'B', 'AB', 'O', 'Unknown'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Pet name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (!formData.species) {
        newErrors.species = 'Species is required';
      }

      if (!formData.gender) {
        newErrors.gender = 'Gender is required';
      }
    }

    if (currentStep === 2) {
      if (formData.height && isNaN(formData.height)) {
        newErrors.height = 'Height must be a number';
      }

      if (formData.weight && isNaN(formData.weight)) {
        newErrors.weight = 'Weight must be a number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const result = await dispatch(registerPet({ ...formData, userId })).unwrap();

      if (result.success) {
        Alert.alert(
          'Success',
          'Pet information has been saved successfully!',
          [{ text: 'OK', onPress: () => {
            onSuccess();
            onClose();
          }}]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'An error occurred while saving pet information'
      );
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={formStyles.section}>
            <Text variant="headlineSmall" style={formStyles.sectionTitle}>Basic Information</Text>

            <TextInput
              label="Pet name *"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              mode="outlined"
              style={formStyles.input}
              activeOutlineColor={theme.colors.primary}
              error={!!errors.name}
              left={<TextInput.Icon icon="paw" color={theme.colors.primary} />}
            />
            {errors.name && <Text style={formStyles.errorText}>{errors.name}</Text>}

            <Text variant="labelLarge" style={formStyles.label}>Species *</Text>
            <View style={formStyles.chipContainer}>
              {speciesOptions.map((species) => (
                <Chip
                  key={species.value}
                  selected={formData.species === species.value}
                  onPress={() => handleInputChange('species', species.value)}
                  style={[
                    formStyles.chip,
                    formData.species === species.value && formStyles.chipSelected
                  ]}
                  selectedColor={theme.colors.primary}
                >
                  {species.label}
                </Chip>
              ))}
            </View>
            {errors.species && <Text style={formStyles.errorText}>{errors.species}</Text>}

            <TextInput
              label="Breed"
              value={formData.breed}
              onChangeText={(value) => handleInputChange('breed', value)}
              mode="outlined"
              style={formStyles.input}
              activeOutlineColor={theme.colors.primary}
              left={<TextInput.Icon icon="dog" color={theme.colors.primary} />}
            />

            <Text variant="labelLarge" style={formStyles.label}>Gender *</Text>
            <SegmentedButtons
              value={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              buttons={genderOptions.map(option => ({
                value: option.value,
                label: option.label,
              }))}
              style={formStyles.segmentedButtons}
            />
            {errors.gender && <Text style={formStyles.errorText}>{errors.gender}</Text>}

            <TextInput
              label="Location"
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              mode="outlined"
              style={formStyles.input}
              activeOutlineColor={theme.colors.primary}
              left={<TextInput.Icon icon="map-marker" color={theme.colors.primary} />}
            />

            <TextInput
              label="Date of birth (YYYY-MM-DD)"
              value={formData.dob}
              onChangeText={(value) => handleInputChange('dob', value)}
              mode="outlined"
              style={formStyles.input}
              activeOutlineColor={theme.colors.primary}
              placeholder="2020-01-15"
              left={<TextInput.Icon icon="calendar" color={theme.colors.primary} />}
            />
          </View>
        );
      case 2:
        return (
          <View style={formStyles.section}>
            <Text variant="headlineSmall" style={formStyles.sectionTitle}>Physical Characteristics</Text>

            <Text variant="labelLarge" style={formStyles.label}>Blood Group</Text>
            <View style={formStyles.chipContainer}>
              {bloodGroupOptions.map((group) => (
                <Chip
                  key={group}
                  selected={formData.bloodGroup === group}
                  onPress={() => handleInputChange('bloodGroup', group)}
                  style={[
                    formStyles.chip,
                    formData.bloodGroup === group && formStyles.chipSelected
                  ]}
                  selectedColor={theme.colors.primary}
                >
                  {group}
                </Chip>
              ))}
            </View>

            <TextInput
              label="Height (cm)"
              value={formData.height}
              onChangeText={(value) => handleInputChange('height', value)}
              mode="outlined"
              style={formStyles.input}
              activeOutlineColor={theme.colors.primary}
              keyboardType="numeric"
              error={!!errors.height}
              left={<TextInput.Icon icon="ruler" color={theme.colors.primary} />}
            />
            {errors.height && <Text style={formStyles.errorText}>{errors.height}</Text>}

            <TextInput
              label="Weight (kg)"
              value={formData.weight}
              onChangeText={(value) => handleInputChange('weight', value)}
              mode="outlined"
              style={formStyles.input}
              activeOutlineColor={theme.colors.primary}
              keyboardType="numeric"
              error={!!errors.weight}
              left={<TextInput.Icon icon="scale" color={theme.colors.primary} />}
            />
            {errors.weight && <Text style={formStyles.errorText}>{errors.weight}</Text>}

            <TextInput
              label="Color"
              value={formData.color}
              onChangeText={(value) => handleInputChange('color', value)}
              mode="outlined"
              style={formStyles.input}
              activeOutlineColor={theme.colors.primary}
              left={<TextInput.Icon icon="palette" color={theme.colors.primary} />}
            />

            <TextInput
              label="Distinctive features"
              value={formData.distinctiveFeatures}
              onChangeText={(value) => handleInputChange('distinctiveFeatures', value)}
              mode="outlined"
              style={[formStyles.input, formStyles.multilineInput]}
              activeOutlineColor={theme.colors.primary}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="text-box-multiple" color={theme.colors.primary} />}
            />
          </View>
        );
      case 3:
        return (
          <View style={formStyles.section}>
            <Text variant="headlineSmall" style={formStyles.sectionTitle}>Health Information</Text>

            <TextInput
              label="Allergies (comma separated)"
              value={formData.allergies}
              onChangeText={(value) => handleInputChange('allergies', value)}
              mode="outlined"
              style={[formStyles.input, formStyles.multilineInput]}
              activeOutlineColor={theme.colors.primary}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="alert-circle" color={theme.colors.primary} />}
            />

            <TextInput
              label="Current medications"
              value={formData.currentMedications}
              onChangeText={(value) => handleInputChange('currentMedications', value)}
              mode="outlined"
              style={[formStyles.input, formStyles.multilineInput]}
              activeOutlineColor={theme.colors.primary}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="pill" color={theme.colors.primary} />}
            />

            <TextInput
              label="Chronic diseases"
              value={formData.chronicDiseases}
              onChangeText={(value) => handleInputChange('chronicDiseases', value)}
              mode="outlined"
              style={[formStyles.input, formStyles.multilineInput]}
              activeOutlineColor={theme.colors.primary}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="hospital-box" color={theme.colors.primary} />}
            />

            <TextInput
              label="Injuries"
              value={formData.injuries}
              onChangeText={(value) => handleInputChange('injuries', value)}
              mode="outlined"
              style={[formStyles.input, formStyles.multilineInput]}
              activeOutlineColor={theme.colors.primary}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="bandage" color={theme.colors.primary} />}
            />

            <TextInput
              label="Surgeries"
              value={formData.surgeries}
              onChangeText={(value) => handleInputChange('surgeries', value)}
              mode="outlined"
              style={[formStyles.input, formStyles.multilineInput]}
              activeOutlineColor={theme.colors.primary}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="medical-bag" color={theme.colors.primary} />}
            />

            <TextInput
              label="Vaccinations"
              value={formData.vaccinations}
              onChangeText={(value) => handleInputChange('vaccinations', value)}
              mode="outlined"
              style={[formStyles.input, formStyles.multilineInput]}
              activeOutlineColor={theme.colors.primary}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="needle" color={theme.colors.primary} />}
            />
          </View>
        );
      case 4:
        return (
          <View style={formStyles.section}>
            <Text variant="headlineSmall" style={formStyles.sectionTitle}>Additional Information</Text>

            <TextInput
              label="Notes"
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              mode="outlined"
              style={[formStyles.input, formStyles.multilineInput]}
              activeOutlineColor={theme.colors.primary}
              multiline
              numberOfLines={5}
              left={<TextInput.Icon icon="note-text" color={theme.colors.primary} />}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={formStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={formStyles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={formStyles.content}>
          <View style={formStyles.header}>
            <TouchableOpacity onPress={onClose} style={formStyles.backButton}>
              <MaterialCommunityIcons name="chevron-left" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <View style={formStyles.headerText}>
              <Text variant="displaySmall" style={formStyles.title}>Pet Information</Text>
              <Text variant="labelLarge" style={formStyles.subtitle}>Step {step} of 4</Text>
            </View>
          </View>

          <View style={formStyles.form}>
            {renderStep()}

            <View style={formStyles.buttonContainer}>
              {step > 1 && (
                <Button
                  mode="outlined"
                  onPress={prevStep}
                  style={formStyles.button}
                  textColor={theme.colors.primary}
                  icon="chevron-left"
                >
                  Previous
                </Button>
              )}

              {step < 4 ? (
                <Button
                  mode="contained"
                  onPress={nextStep}
                  style={[formStyles.button, step > 1 && formStyles.buttonMargin]}
                  buttonColor={theme.colors.primary}
                  icon="chevron-right"
                  contentStyle={formStyles.buttonContent}
                >
                  Next
                </Button>
              ) : (
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={[formStyles.button, step > 1 && formStyles.buttonMargin]}
                  buttonColor={theme.colors.secondary}
                  loading={isLoading}
                  icon="check-circle"
                  contentStyle={formStyles.buttonContent}
                >
                  Submit
                </Button>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function PetTab() {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState('lebra');
  const [showForm, setShowForm] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingBottom: 0,
    },
    headerSection: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      shadowColor: '#558B2F',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    profileTitle: {
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 20,
      color: '#FFFFFF',
    },
    headerActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    actionText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    profileImageContainer: {
      alignItems: 'center',
      marginVertical: 16,
    },
    profileImage: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: '#F0F0F0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentSection: {
      paddingHorizontal: 12,
      paddingVertical: 16,
      gap: 8,
    },
    contentWrapper: {
      flexGrow: 1,
      paddingBottom: 100,
    },
  });

  if (showForm) {
    return (
      <PaperProvider theme={theme}>
        <PetDetailForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {}}
        />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.contentWrapper}
        >
          <LinearGradient
            colors={['#558B2F', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.headerSection}
          >
            <Text style={styles.profileTitle}>{selectedPet}'s Profile</Text>

            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.replace('/(vetician_tabs)/(tabs)/index')}
              >
                <MaterialCommunityIcons
                  name="arrow-left-right"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.actionText}>Switch Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="plus"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.actionText}>Add Pet</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <MaterialCommunityIcons
                  name="dog"
                  size={80}
                  color="#D0D0D0"
                />
              </View>
            </View>
          </LinearGradient>

          <View style={styles.contentSection}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.95}
                onPress={() => {
                  if (item.id === 'details') {
                    setShowForm(true);
                  }
                }}
              >
                <Card style={{ marginVertical: 4 }}>
                  <Card.Content style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
                        <View style={{ width: 44, height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                          <MaterialCommunityIcons
                            name={item.icon}
                            size={24}
                            color={PRIMARY_GREEN}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 15, fontWeight: '600', color: '#1F1F1F', marginBottom: 2 }}>
                            {item.title}
                          </Text>
                          <Text style={{ fontSize: 12, color: '#999999', fontWeight: '400' }}>
                            {item.subtitle}
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginLeft: 8 }}>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={24}
                          color="#DDDDDD"
                        />
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 10,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  chip: {
    backgroundColor: '#f0f0f0',
  },
  chipSelected: {
    backgroundColor: '#E8F5E9',
  },
  segmentedButtons: {
    marginBottom: 18,
  },
  errorText: {
    color: '#f13c20',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
    paddingLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 10,
  },
  button: {
    flex: 1,
    minHeight: 48,
  },
  buttonContent: {
    height: 48,
  },
  buttonMargin: {
    marginLeft: 10,
  },
});
