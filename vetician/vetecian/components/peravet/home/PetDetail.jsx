import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Menu } from 'lucide-react-native';
import { registerPet } from '../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PetDetail() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    location: '',
    dob: '',

    // Physical Characteristics
    bloodGroup: '',
    height: '',
    weight: '',
    color: '',
    distinctiveFeatures: '',

    // Health Information
    allergies: '',
    currentMedications: '',
    chronicDiseases: '',
    injuries: '',
    surgeries: '',
    vaccinations: '',

    // Additional Information
    notes: ''
  });

  const navigation = useNavigation();
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  const router = useRouter();

  const speciesOptions = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Other'];
  const genderOptions = ['Male', 'Female', 'Neutered', 'Spayed', 'Unknown'];
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

  // Add to handleSubmit
  const handleSubmit = async () => {
    // if (!validateStep(step)) return;

    try {
      const userId = await AsyncStorage.getItem('userId');
      // console.log(formData)
      const result = await dispatch(registerPet({ ...formData, userId })).unwrap();
      console.log(result)

      if (result.success) {
        Alert.alert(
          'Success',
          'Pet information has been saved successfully!',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Pet name*"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Species*</Text>
              <View style={styles.optionsContainer}>
                {speciesOptions.map((species) => (
                  <TouchableOpacity
                    key={species}
                    style={[
                      styles.optionButton,
                      formData.species === species && styles.selectedOption
                    ]}
                    onPress={() => handleInputChange('species', species)}
                  >
                    <Text style={styles.optionText}>{species}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Breed"
                value={formData.breed}
                onChangeText={(value) => handleInputChange('breed', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender*</Text>
              <View style={styles.optionsContainer}>
                {genderOptions.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.optionButton,
                      formData.gender === gender && styles.selectedOption
                    ]}
                    onPress={() => handleInputChange('gender', gender)}
                  >
                    <Text style={styles.optionText}>{gender}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Date of birth (YYYY-MM-DD)"
                value={formData.dob}
                onChangeText={(value) => handleInputChange('dob', value)}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Characteristics</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Blood Group</Text>
              <View style={styles.optionsContainer}>
                {bloodGroupOptions.map((group) => (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.optionButton,
                      formData.bloodGroup === group && styles.selectedOption
                    ]}
                    onPress={() => handleInputChange('bloodGroup', group)}
                  >
                    <Text style={styles.optionText}>{group}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.height && styles.inputError]}
                placeholder="Height (cm)"
                value={formData.height}
                onChangeText={(value) => handleInputChange('height', value)}
                keyboardType="numeric"
              />
              {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.weight && styles.inputError]}
                placeholder="Weight (kg)"
                value={formData.weight}
                onChangeText={(value) => handleInputChange('weight', value)}
                keyboardType="numeric"
              />
              {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Color"
                value={formData.color}
                onChangeText={(value) => handleInputChange('color', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Distinctive features"
                value={formData.distinctiveFeatures}
                onChangeText={(value) => handleInputChange('distinctiveFeatures', value)}
                multiline
              />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Information</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Allergies (comma separated)"
                value={formData.allergies}
                onChangeText={(value) => handleInputChange('allergies', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Current medications"
                value={formData.currentMedications}
                onChangeText={(value) => handleInputChange('currentMedications', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Chronic diseases"
                value={formData.chronicDiseases}
                onChangeText={(value) => handleInputChange('chronicDiseases', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Injuries"
                value={formData.injuries}
                onChangeText={(value) => handleInputChange('injuries', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Surgeries"
                value={formData.surgeries}
                onChangeText={(value) => handleInputChange('surgeries', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Vaccinations"
                value={formData.vaccinations}
                onChangeText={(value) => handleInputChange('vaccinations', value)}
                multiline
              />
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Notes"
                value={formData.notes}
                onChangeText={(value) => handleInputChange('notes', value)}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
              <Menu size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Pet Information</Text>
              <Text style={styles.subtitle}>Step {step} of 4</Text>
            </View>
          </View>

          <View style={styles.form}>
            {renderStep()}

            <View style={styles.buttonContainer}>
              {step > 1 && (
                <TouchableOpacity
                  style={[styles.navButton, styles.prevButton]}
                  onPress={prevStep}
                >
                  <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>
              )}

              {step < 4 ? (
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={nextStep}
                >
                  <Text style={styles.navButtonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.navButton, styles.submitButton]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.navButtonText}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 50,
  },
  menuButton: {
    marginRight: 20,
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginBottom: 20,
    paddingLeft: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  navButton: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  prevButton: {
    backgroundColor: '#007AFF',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  submitButton: {
    backgroundColor: '#34C759',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  prevButtonText: {
    color: '#333',
  },
});