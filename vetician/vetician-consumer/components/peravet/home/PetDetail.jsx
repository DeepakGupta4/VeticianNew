import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Menu, ChevronLeft } from 'lucide-react-native';
import { registerPet } from '../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIMARY = '#7CB342';
const stepLabels = ['Basic', 'Physical', 'Health', 'Notes'];

export default function PetDetail() {
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

  const navigation = useNavigation();
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);
  const router = useRouter();

  const speciesOptions = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Other'];
  const genderOptions = ['Male', 'Female', 'Neutered', 'Spayed', 'Unknown'];
  const bloodGroupOptions = ['A', 'B', 'AB', 'O', 'Unknown'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Pet name is required';
      else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
      if (!formData.species) newErrors.species = 'Species is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    }
    if (currentStep === 2) {
      if (formData.height && isNaN(formData.height)) newErrors.height = 'Height must be a number';
      if (formData.weight && isNaN(formData.weight)) newErrors.weight = 'Weight must be a number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep(step + 1); };
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const result = await dispatch(registerPet({ ...formData, userId })).unwrap();
      if (result.success) {
        Alert.alert('Success', 'Pet information has been saved successfully!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred while saving pet information');
    }
  };

  const ChipRow = ({ options, selected, onSelect }) => (
    <View style={styles.chipRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected === opt && styles.chipSelected]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.chipText, selected === opt && styles.chipTextSelected]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const Field = ({ children }) => <View style={styles.fieldWrap}>{children}</View>;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <Field>
              <TextInput style={[styles.input, errors.name && styles.inputError]} placeholder="Pet name *" value={formData.name} onChangeText={v => handleInputChange('name', v)} autoCapitalize="words" />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </Field>
            <Field>
              <Text style={styles.label}>Species *</Text>
              <ChipRow options={speciesOptions} selected={formData.species} onSelect={v => handleInputChange('species', v)} />
              {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}
            </Field>
            <Field>
              <TextInput style={styles.input} placeholder="Breed" value={formData.breed} onChangeText={v => handleInputChange('breed', v)} />
            </Field>
            <Field>
              <Text style={styles.label}>Gender *</Text>
              <ChipRow options={genderOptions} selected={formData.gender} onSelect={v => handleInputChange('gender', v)} />
              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            </Field>
            <Field>
              <TextInput style={styles.input} placeholder="Location" value={formData.location} onChangeText={v => handleInputChange('location', v)} />
            </Field>
            <Field>
              <TextInput style={styles.input} placeholder="Date of birth (YYYY-MM-DD)" value={formData.dob} onChangeText={v => handleInputChange('dob', v)} />
            </Field>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.sectionTitle}>Physical Characteristics</Text>
            <Field>
              <Text style={styles.label}>Blood Group</Text>
              <ChipRow options={bloodGroupOptions} selected={formData.bloodGroup} onSelect={v => handleInputChange('bloodGroup', v)} />
            </Field>
            <Field>
              <TextInput style={[styles.input, errors.height && styles.inputError]} placeholder="Height (cm)" value={formData.height} onChangeText={v => handleInputChange('height', v)} keyboardType="numeric" />
              {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
            </Field>
            <Field>
              <TextInput style={[styles.input, errors.weight && styles.inputError]} placeholder="Weight (kg)" value={formData.weight} onChangeText={v => handleInputChange('weight', v)} keyboardType="numeric" />
              {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
            </Field>
            <Field>
              <TextInput style={styles.input} placeholder="Color" value={formData.color} onChangeText={v => handleInputChange('color', v)} />
            </Field>
            <Field>
              <TextInput style={[styles.input, styles.multiline]} placeholder="Distinctive features" value={formData.distinctiveFeatures} onChangeText={v => handleInputChange('distinctiveFeatures', v)} multiline />
            </Field>
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.sectionTitle}>Health Information</Text>
            {[
              { field: 'allergies', placeholder: 'Allergies (comma separated)' },
              { field: 'currentMedications', placeholder: 'Current medications' },
              { field: 'chronicDiseases', placeholder: 'Chronic diseases' },
              { field: 'injuries', placeholder: 'Injuries' },
              { field: 'surgeries', placeholder: 'Surgeries' },
              { field: 'vaccinations', placeholder: 'Vaccinations' },
            ].map(({ field, placeholder }) => (
              <Field key={field}>
                <TextInput style={[styles.input, styles.multiline]} placeholder={placeholder} value={formData[field]} onChangeText={v => handleInputChange(field, v)} multiline />
              </Field>
            ))}
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <Field>
              <TextInput style={[styles.input, styles.multilineLg]} placeholder="Notes" value={formData.notes} onChangeText={v => handleInputChange('notes', v)} multiline numberOfLines={5} />
            </Field>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuBtn}>
          <Menu size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Pet Information</Text>
          <Text style={styles.subtitle}>Step {step} of 4</Text>
        </View>
      </View>

      {/* Step Progress Bar */}
      <View style={styles.stepBar}>
        {stepLabels.map((label, i) => (
          <View key={i} style={styles.stepItem}>
            <View style={[styles.stepDot, i + 1 <= step && styles.stepDotActive]}>
              <Text style={[styles.stepDotText, i + 1 <= step && styles.stepDotTextActive]}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, i + 1 === step && styles.stepLabelActive]}>{label}</Text>
            {i < 3 && <View style={[styles.stepLine, i + 1 < step && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {renderStep()}
        </View>
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        {step > 1 ? (
          <TouchableOpacity style={[styles.footerBtn, styles.prevBtn]} onPress={prevStep}>
            <Text style={styles.prevBtnText}>Previous</Text>
          </TouchableOpacity>
        ) : <View style={styles.footerBtn} />}

        {step < 4 ? (
          <TouchableOpacity style={[styles.footerBtn, styles.nextBtn]} onPress={nextStep}>
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.footerBtn, styles.submitBtn]} onPress={handleSubmit}>
            <Text style={styles.nextBtnText}>{isLoading ? 'Saving...' : 'Submit'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  // Fixed header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuBtn: { marginRight: 14, padding: 4 },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  // Step bar
  stepBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stepItem: { alignItems: 'center', flexDirection: 'row' },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: PRIMARY },
  stepDotText: { fontSize: 12, fontWeight: '700', color: '#999' },
  stepDotTextActive: { color: '#fff' },
  stepLabel: { fontSize: 11, color: '#aaa', marginLeft: 4, marginRight: 4 },
  stepLabelActive: { color: PRIMARY, fontWeight: '600' },
  stepLine: { width: 20, height: 2, backgroundColor: '#e0e0e0', marginHorizontal: 2 },
  stepLineActive: { backgroundColor: PRIMARY },
  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 16 },
  fieldWrap: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 8 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#1a1a1a',
  },
  multiline: { height: 90, textAlignVertical: 'top', paddingTop: 12 },
  multilineLg: { height: 130, textAlignVertical: 'top', paddingTop: 12 },
  inputError: { borderColor: '#f13c20' },
  errorText: { color: '#f13c20', fontSize: 12, marginTop: 4, paddingLeft: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 7, paddingHorizontal: 13, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f8f9fa' },
  chipSelected: { backgroundColor: '#E8F5E9', borderColor: PRIMARY },
  chipText: { fontSize: 13, color: '#555' },
  chipTextSelected: { color: PRIMARY, fontWeight: '600' },
  // Fixed footer
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerBtn: { flex: 1, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  prevBtn: { borderWidth: 1.5, borderColor: PRIMARY, backgroundColor: '#fff' },
  prevBtnText: { color: PRIMARY, fontSize: 15, fontWeight: '600' },
  nextBtn: { backgroundColor: PRIMARY },
  submitBtn: { backgroundColor: '#558B2F' },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
