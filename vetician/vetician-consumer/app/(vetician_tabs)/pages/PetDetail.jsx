import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Text,
  Image,
} from 'react-native';
import {
  TextInput,
  Button,
  Chip,
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { registerPet, getPetsByUserId } from '../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7CB342',
    secondary: '#558B2F',
    error: '#f13c20',
  },
};

const G = '#7CB342';
const DG = '#558B2F';

const STEPS = [
  { label: 'Basic Info',  sub: "Your pet's name, species & gender" },
  { label: 'Physical',    sub: 'Size, weight & appearance' },
  { label: 'Health',      sub: 'Medical history & records' },
  { label: 'Notes',       sub: 'Any extra information' },
];

const menuItems = [
  { id: 'details',      title: 'Profile Details',         subtitle: 'Name, Breed, Birthday, etc.',       icon: 'paw' },
  { id: 'medical',      title: 'Medical Records',         subtitle: 'View Prescriptions & Lab Reports',  icon: 'medical-bag' },
  { id: 'appointments', title: 'Appointments & Orders',   subtitle: 'Check Invoices and Order details',  icon: 'calendar-check' },
  { id: 'vaccination',  title: 'Vaccination',             subtitle: 'View Pet Vaccination Records',      icon: 'needle' },
  { id: 'help',         title: 'Need Help',               subtitle: 'Whisker Your Worries Away',         icon: 'help-circle' },
  { id: 'membership',   title: 'Premium Membership',      subtitle: 'Check your membership utilisation', icon: 'heart' },
];

/* ─── Step Indicator ─────────────────────────────────────────────────────── */
function StepBar({ step }) {
  return (
    <View style={s.stepBar}>
      {STEPS.map((item, i) => {
        const done    = i < step - 1;
        const active  = i === step - 1;
        return (
          <React.Fragment key={i}>
            <View style={s.stepItem}>
              <View style={[s.stepDot, done && s.stepDotDone, active && s.stepDotActive]}>
                {done
                  ? <MaterialCommunityIcons name="check" size={13} color="#fff" />
                  : <Text style={[s.stepNum, active && s.stepNumActive]}>{i + 1}</Text>
                }
              </View>
              <Text style={[s.stepLabel, active && s.stepLabelActive]} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[s.stepLine, done && s.stepLineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

/* ─── Form ───────────────────────────────────────────────────────────────── */
function PetDetailForm({ onClose, onSuccess }) {
  const insets = useSafeAreaInsets();
  const [step, setStep]       = useState(1);
  const [errors, setErrors]   = useState({});
  const dispatch              = useDispatch();
  const { isLoading }         = useSelector(st => st.auth);

  const [formData, setFormData] = useState({
    name: '', species: 'Dog', breed: '', gender: 'Male',
    location: '', dob: '', bloodGroup: '', height: '', weight: '',
    color: '', distinctiveFeatures: '', allergies: '',
    currentMedications: '', chronicDiseases: '', injuries: '',
    surgeries: '', vaccinations: '', notes: '',
    petPhoto: null,
  });

  const set = (field, value) => {
    setFormData(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: null }));
  };

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera roll permission is needed');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      set('petPhoto', result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (uri) => {
    const ext = uri.split('.').pop().toLowerCase();
    const formDataUpload = new FormData();
    formDataUpload.append('file', { uri, name: `pet_${Date.now()}.${ext}`, type: `image/${ext === 'jpg' ? 'jpeg' : ext}` });
    formDataUpload.append('upload_preset', 'vetician');
    formDataUpload.append('cloud_name', 'dqwzfs4ox');
    const res = await fetch('https://api.cloudinary.com/v1_1/dqwzfs4ox/image/upload', {
      method: 'POST', body: formDataUpload,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!formData.name.trim())               e.name = 'Pet name is required';
      else if (formData.name.trim().length < 2) e.name = 'Min 2 characters';
      if (!formData.species)                   e.species = 'Species is required';
      if (!formData.gender)                    e.gender = 'Gender is required';
      if (!formData.breed.trim())              e.breed = 'Breed is required';
      if (!formData.location.trim())           e.location = 'Location is required';
      if (!formData.dob.trim())                e.dob = 'Date of birth is required';
    }
    if (s === 2) {
      if (!formData.bloodGroup)                e.bloodGroup = 'Blood group is required';
      if (!formData.height)                    e.height = 'Height is required';
      else if (isNaN(formData.height))         e.height = 'Must be a number';
      if (!formData.weight)                    e.weight = 'Weight is required';
      else if (isNaN(formData.weight))         e.weight = 'Must be a number';
      if (!formData.color.trim())              e.color = 'Color is required';
      if (!formData.distinctiveFeatures.trim()) e.distinctiveFeatures = 'Distinctive features are required';
    }
    if (s === 3) {
      if (!formData.allergies.trim())          e.allergies = 'Allergies info is required';
      if (!formData.currentMedications.trim()) e.currentMedications = 'Current medications is required';
      if (!formData.chronicDiseases.trim())    e.chronicDiseases = 'Chronic diseases info is required';
      if (!formData.injuries.trim())           e.injuries = 'Injuries info is required';
      if (!formData.surgeries.trim())          e.surgeries = 'Surgeries info is required';
      if (!formData.vaccinations.trim())       e.vaccinations = 'Vaccinations info is required';
    }
    if (s === 4) {
      if (!formData.notes.trim())              e.notes = 'Notes are required';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);

  const submit = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      let petPhotoUrl = null;
      if (formData.petPhoto) {
        petPhotoUrl = await uploadToCloudinary(formData.petPhoto);
      }
      await dispatch(registerPet({ ...formData, petPhoto: petPhotoUrl, userId })).unwrap();
      Alert.alert('Success! 🐾', 'Pet saved successfully!', [
        { text: 'OK', onPress: () => { onSuccess(); onClose(); } },
      ]);
    } catch (err) {
      Alert.alert('Error', typeof err === 'string' ? err : err?.message || 'Could not save pet');
    }
  };

  /* ── field helpers ── */
  const inp = (label, field, opts = {}) => (
    <View key={field} style={s.fieldWrap}>
      <TextInput
        label={label}
        value={formData[field]}
        onChangeText={v => set(field, v)}
        mode="outlined"
        style={s.input}
        outlineStyle={s.inputOutline}
        activeOutlineColor={G}
        error={!!errors[field]}
        {...opts}
      />
      {errors[field] && <Text style={s.err}>{errors[field]}</Text>}
    </View>
  );

  const chips = (label, field, options) => (
    <View style={s.fieldWrap}>
      <Text style={s.label}>{label}</Text>
      <View style={s.chipRow}>
        {options.map(o => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          return (
            <Chip
              key={val}
              selected={formData[field] === val}
              onPress={() => set(field, val)}
              style={[s.chip, formData[field] === val && s.chipOn]}
              selectedColor={G}
              textStyle={s.chipText}
            >{lbl}</Chip>
          );
        })}
      </View>
      {errors[field] && <Text style={s.err}>{errors[field]}</Text>}
    </View>
  );

  const seg = (label, field, options) => null;

  const multiInp = (label, field, icon) => (
    <View key={field} style={s.fieldWrap}>
      <TextInput
        label={label}
        value={formData[field]}
        onChangeText={v => set(field, v)}
        mode="outlined"
        style={[s.input, s.multiInput]}
        outlineStyle={s.inputOutline}
        activeOutlineColor={G}
        multiline
        numberOfLines={3}
        left={<TextInput.Icon icon={icon} color={G} />}
      />
    </View>
  );

  /* ── step content ── */
  const stepContent = () => {
    if (step === 1) return (
      <>
        {/* Pet Photo */}
        <View style={s.fieldWrap}>
          <Text style={s.label}>Pet Photo</Text>
          <TouchableOpacity style={s.photoBox} onPress={pickPhoto} activeOpacity={0.8}>
            {formData.petPhoto ? (
              <Image source={{ uri: formData.petPhoto }} style={s.photoPreview} />
            ) : (
              <View style={s.photoPlaceholder}>
                <MaterialCommunityIcons name="camera-plus-outline" size={32} color="#aaa" />
                <Text style={s.photoPlaceholderText}>Tap to add photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {inp('Pet name *', 'name', { left: <TextInput.Icon icon="paw" color={G} /> })}
        {chips('Species *', 'species', [
          { label: 'Dog', value: 'Dog' }, { label: 'Cat', value: 'Cat' },
          { label: 'Bird', value: 'Bird' }, { label: 'Other', value: 'Other' },
        ])}
        {inp('Breed', 'breed', { left: <TextInput.Icon icon="dog" color={G} /> })}
        {chips('Gender *', 'gender', [
          { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' },
          { label: 'Neutered', value: 'Neutered' }, { label: 'Spayed', value: 'Spayed' },
          { label: 'Unknown', value: 'Unknown' },
        ])}
        {inp('Location', 'location', { left: <TextInput.Icon icon="map-marker" color={G} /> })}
        {inp('Date of birth (YYYY-MM-DD)', 'dob', {
          left: <TextInput.Icon icon="calendar" color={G} />, placeholder: '2020-01-15',
        })}
      </>
    );

    if (step === 2) return (
      <>
        {chips('Blood Group', 'bloodGroup', ['A', 'B', 'AB', 'O', 'Unknown'])}
        {inp('Height (cm)', 'height', { keyboardType: 'numeric', left: <TextInput.Icon icon="ruler" color={G} /> })}
        {inp('Weight (kg)', 'weight', { keyboardType: 'numeric', left: <TextInput.Icon icon="scale" color={G} /> })}
        {inp('Color', 'color', { left: <TextInput.Icon icon="palette" color={G} /> })}
        {multiInp('Distinctive features', 'distinctiveFeatures', 'text-box-multiple')}
      </>
    );

    if (step === 3) return (
      <>
        {multiInp('Allergies (comma separated)', 'allergies', 'alert-circle')}
        {multiInp('Current medications', 'currentMedications', 'pill')}
        {multiInp('Chronic diseases', 'chronicDiseases', 'hospital-box')}
        {multiInp('Injuries', 'injuries', 'bandage')}
        {multiInp('Surgeries', 'surgeries', 'medical-bag')}
        {multiInp('Vaccinations', 'vaccinations', 'needle')}
      </>
    );

    if (step === 4) return (
      <>
        <View style={s.fieldWrap}>
          <TextInput
            label="Notes"
            value={formData.notes}
            onChangeText={v => set('notes', v)}
            mode="outlined"
            style={[s.input, s.notesInput]}
            outlineStyle={s.inputOutline}
            activeOutlineColor={G}
            multiline
            numberOfLines={5}
            left={<TextInput.Icon icon="note-text" color={G} />}
          />
        </View>
      </>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8' }}>
      <StatusBar backgroundColor={G} barStyle="light-content" translucent={false} />

      {/* ── Header ── */}
      <LinearGradient colors={[G, DG]} style={[s.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={onClose} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={s.headerMid}>
          <Text style={s.headerTitle}>Add Pet</Text>
          <Text style={s.headerSub}>{STEPS[step - 1].sub}</Text>
        </View>
        <View style={s.headerRight}>
          <Text style={s.headerStep}>{step}/4</Text>
        </View>
      </LinearGradient>

      {/* ── Step Bar ── */}
      <View style={s.stepBarWrap}>
        <StepBar step={step} />
      </View>

      {/* ── Body: scroll + fixed footer ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step title */}
          <View style={s.stepTitleRow}>
            <View style={s.stepTitleDot} />
            <Text style={s.stepTitleText}>{STEPS[step - 1].label}</Text>
          </View>

          {/* Fields card */}
          <View style={s.card}>
            {stepContent()}
          </View>

          {/* Spacer so last field never hides behind footer */}
          <View style={{ height: 16 }} />
        </ScrollView>

        {/* ── Footer (fixed) ── */}
        <View style={[s.footer, { paddingBottom: insets.bottom + 12 }]}>
          {step > 1 ? (
            <TouchableOpacity style={s.btnBack} onPress={prev} activeOpacity={0.8}>
              <MaterialCommunityIcons name="chevron-left" size={20} color={G} />
              <Text style={s.btnBackText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={s.btnPlaceholder} />
          )}

          {step < 4 ? (
            <TouchableOpacity style={s.btnNext} onPress={next} activeOpacity={0.85}>
              <Text style={s.btnNextText}>Next</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[s.btnNext, isLoading && { opacity: 0.7 }]}
              onPress={submit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="check-circle-outline" size={18} color="#fff" />
              <Text style={s.btnNextText}>{isLoading ? 'Saving…' : 'Save Pet'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ─── Pet Detail Page ───────────────────────────────────────────────────── */
const PetDetail = () => {
  const navigation  = useNavigation();
  const insets      = useSafeAreaInsets();
  const dispatch    = useDispatch();
  const pets        = useSelector(st => st.auth?.userPets?.data || []);
  const loading     = useSelector(st => st.auth?.userPets?.loading);
  const [showForm, setShowForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    dispatch(getPetsByUserId());
  }, []);

  if (showForm) {
    return (
      <PaperProvider theme={theme}>
        <PetDetailForm
          onClose={() => { setShowForm(false); setSelectedPet(null); }}
          onSuccess={() => dispatch(getPetsByUserId())}
        />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, backgroundColor: '#F4F6F8' }}>
        <StatusBar backgroundColor={DG} barStyle="light-content" translucent={false} />

        {/* Header */}
        <LinearGradient colors={[DG, G]} style={[pg.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={pg.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={pg.headerTitle}>My Pet</Text>
          <TouchableOpacity onPress={() => setShowForm(true)} style={pg.backBtn}>
            <MaterialCommunityIcons name="plus" size={22} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[pg.scroll, { paddingBottom: insets.bottom + 24 }]}
        >
          {loading ? (
            <View style={pg.centerBox}>
              <MaterialCommunityIcons name="loading" size={40} color={G} />
              <Text style={pg.emptyText}>Loading pets...</Text>
            </View>
          ) : pets.length === 0 ? (
            <View style={pg.centerBox}>
              <LinearGradient colors={[G, DG]} style={pg.emptyAvatar}>
                <MaterialCommunityIcons name="dog" size={50} color="#fff" />
              </LinearGradient>
              <Text style={pg.emptyTitle}>No pets added yet</Text>
              <Text style={pg.emptyText}>Tap + to add your first pet</Text>
              <TouchableOpacity style={pg.addBtn} onPress={() => setShowForm(true)} activeOpacity={0.85}>
                <MaterialCommunityIcons name="plus" size={16} color="#fff" />
                <Text style={pg.addBtnText}>Add New Pet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Pets List */}
              <View style={pg.petsSection}>
                <Text style={pg.sectionLabel}>Your Pets ({pets.length})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={pg.petsScroll}>
                  {pets.map((pet) => (
                    <TouchableOpacity
                      key={pet._id}
                      style={[pg.petCard, selectedPet?._id === pet._id && pg.petCardActive]}
                      onPress={() => setSelectedPet(pet)}
                      activeOpacity={0.85}
                    >
                      {pet.petPhoto ? (
                        <Image source={{ uri: pet.petPhoto }} style={pg.petCardImg} />
                      ) : (
                        <LinearGradient colors={[G, DG]} style={pg.petCardImg}>
                          <MaterialCommunityIcons
                            name={pet.species === 'Cat' ? 'cat' : pet.species === 'Bird' ? 'bird' : 'dog'}
                            size={32} color="#fff"
                          />
                        </LinearGradient>
                      )}
                      <Text style={pg.petCardName} numberOfLines={1}>{pet.name}</Text>
                      <Text style={pg.petCardSpecies}>{pet.species}</Text>
                      {selectedPet?._id === pet._id && (
                        <View style={pg.petCardCheck}>
                          <MaterialCommunityIcons name="check-circle" size={18} color={G} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={pg.addPetCard} onPress={() => setShowForm(true)} activeOpacity={0.85}>
                    <MaterialCommunityIcons name="plus-circle-outline" size={32} color={G} />
                    <Text style={pg.addPetCardText}>Add Pet</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Selected Pet Details */}
              {selectedPet ? (
                <View style={pg.detailCard}>
                  {/* Pet Header */}
                  <View style={pg.detailHeader}>
                    {selectedPet.petPhoto ? (
                      <Image source={{ uri: selectedPet.petPhoto }} style={pg.detailImg} />
                    ) : (
                      <LinearGradient colors={[G, DG]} style={pg.detailImg}>
                        <MaterialCommunityIcons
                          name={selectedPet.species === 'Cat' ? 'cat' : selectedPet.species === 'Bird' ? 'bird' : 'dog'}
                          size={40} color="#fff"
                        />
                      </LinearGradient>
                    )}
                    <View style={pg.detailHeaderText}>
                      <Text style={pg.detailName}>{selectedPet.name}</Text>
                      <Text style={pg.detailBreed}>{selectedPet.breed || selectedPet.species}</Text>
                      <View style={pg.detailBadgeRow}>
                        <View style={pg.badge}><Text style={pg.badgeText}>{selectedPet.gender}</Text></View>
                        {selectedPet.bloodGroup && <View style={pg.badge}><Text style={pg.badgeText}>{selectedPet.bloodGroup}</Text></View>}
                        {selectedPet.color && <View style={pg.badge}><Text style={pg.badgeText}>{selectedPet.color}</Text></View>}
                      </View>
                    </View>
                  </View>

                  {/* Info Rows */}
                  {[
                    { icon: 'map-marker', label: 'Location', value: selectedPet.location },
                    { icon: 'calendar', label: 'Date of Birth', value: selectedPet.dob ? new Date(selectedPet.dob).toDateString() : null },
                    { icon: 'ruler', label: 'Height', value: selectedPet.height ? `${selectedPet.height} cm` : null },
                    { icon: 'scale', label: 'Weight', value: selectedPet.weight ? `${selectedPet.weight} kg` : null },
                    { icon: 'text-box', label: 'Distinctive Features', value: selectedPet.distinctiveFeatures },
                  ].filter(r => r.value).map((row) => (
                    <View key={row.label} style={pg.infoRow}>
                      <MaterialCommunityIcons name={row.icon} size={18} color={G} style={{ marginRight: 10 }} />
                      <Text style={pg.infoLabel}>{row.label}:</Text>
                      <Text style={pg.infoValue}>{row.value}</Text>
                    </View>
                  ))}

                  {/* Health Section */}
                  <Text style={pg.subHeading}>Health Info</Text>
                  {[
                    { label: 'Allergies', value: selectedPet.allergies },
                    { label: 'Medications', value: selectedPet.currentMedications },
                    { label: 'Chronic Diseases', value: selectedPet.chronicDiseases },
                    { label: 'Injuries', value: selectedPet.injuries },
                    { label: 'Surgeries', value: selectedPet.surgeries },
                    { label: 'Vaccinations', value: selectedPet.vaccinations },
                    { label: 'Notes', value: selectedPet.notes },
                  ].filter(r => r.value).map((row) => (
                    <View key={row.label} style={pg.healthRow}>
                      <Text style={pg.healthLabel}>{row.label}</Text>
                      <Text style={pg.healthValue}>{row.value}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={pg.centerBox}>
                  <Text style={pg.emptyText}>Tap a pet to see details</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerMid: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.82)', marginTop: 2 },
  headerRight: { width: 38, alignItems: 'center' },
  headerStep: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },

  /* step bar */
  stepBarWrap: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  stepBar: { flexDirection: 'row', alignItems: 'center' },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#E0E0E0',
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: G },
  stepDotDone:   { backgroundColor: DG },
  stepNum: { fontSize: 11, fontWeight: '700', color: '#AAA' },
  stepNumActive: { color: '#fff' },
  stepLabel: { fontSize: 10, color: '#AAA', fontWeight: '500' },
  stepLabelActive: { color: G, fontWeight: '700' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#E0E0E0', marginHorizontal: 4, marginBottom: 14 },
  stepLineDone: { backgroundColor: DG },

  /* scroll — top padding 16, bottom 16 (extra spacer added in JSX) */
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 0 },

  /* step title */
  stepTitleRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 12,
  },
  stepTitleDot: { width: 4, height: 20, borderRadius: 2, backgroundColor: G },
  stepTitleText: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },

  /* card — uniform padding, no fixed height */
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  photoBox: {
    width: 110, height: 110, borderRadius: 55,
    alignSelf: 'center', marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed',
  },
  photoPreview: { width: '100%', height: '100%' },
  photoPlaceholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },
  photoPlaceholderText: { fontSize: 12, color: '#aaa', marginTop: 6 },
  /* fields — uniform vertical rhythm */
  fieldWrap: { marginBottom: 12 },
  input: { backgroundColor: '#fff' },
  inputOutline: { borderRadius: 10 },
  multiInput: { minHeight: 90 },
  notesInput: { minHeight: 140 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: { backgroundColor: '#F2F2F2' },
  chipOn: { backgroundColor: '#E8F5E9' },
  chipText: { fontSize: 13 },
  seg: { marginBottom: 4 },
  err: { fontSize: 12, color: '#f13c20', marginTop: 2, marginBottom: 2, paddingLeft: 4 },

  /* footer — always same height */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    gap: 12,
  },
  btnBack: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 50, borderRadius: 12,
    borderWidth: 1.5, borderColor: G,
    gap: 4,
  },
  btnBackText: { fontSize: 15, fontWeight: '600', color: G },
  btnNext: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 50, borderRadius: 12,
    backgroundColor: G,
    gap: 6,
  },
  btnNextText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  btnPlaceholder: { flex: 1 },
});

const pg = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 14,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontSize: 17, fontWeight: '700', color: '#fff',
  },
  scroll: { padding: 16 },

  // Empty state
  centerBox: {
    alignItems: 'center', paddingVertical: 40,
  },
  emptyAvatar: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 },
  emptyText: { fontSize: 13, color: '#999', marginBottom: 20 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: G, paddingHorizontal: 22, paddingVertical: 10,
    borderRadius: 24,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Pets horizontal scroll
  petsSection: { marginBottom: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#555', marginBottom: 10 },
  petsScroll: { paddingBottom: 4 },
  petCard: {
    width: 90, alignItems: 'center', marginRight: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 10,
    borderWidth: 2, borderColor: '#eee',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  petCardActive: { borderColor: G, backgroundColor: '#F1F8E9' },
  petCardImg: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6, overflow: 'hidden',
  },
  petCardName: { fontSize: 12, fontWeight: '700', color: '#1a1a1a', textAlign: 'center' },
  petCardSpecies: { fontSize: 10, color: '#999', marginTop: 2 },
  petCardCheck: { position: 'absolute', top: 6, right: 6 },
  addPetCard: {
    width: 90, alignItems: 'center', justifyContent: 'center', marginRight: 12,
    backgroundColor: '#F1F8E9', borderRadius: 14, padding: 10,
    borderWidth: 2, borderColor: G, borderStyle: 'dashed',
  },
  addPetCardText: { fontSize: 11, color: G, fontWeight: '600', marginTop: 4 },

  // Detail card
  detailCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  detailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  detailImg: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14, overflow: 'hidden',
  },
  detailHeaderText: { flex: 1 },
  detailName: { fontSize: 18, fontWeight: '800', color: '#1a1a1a' },
  detailBreed: { fontSize: 13, color: '#666', marginTop: 2, marginBottom: 8 },
  detailBadgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: {
    backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, color: G, fontWeight: '600' },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F3F3',
  },
  infoLabel: { fontSize: 13, color: '#888', fontWeight: '600', marginRight: 6 },
  infoValue: { fontSize: 13, color: '#1a1a1a', flex: 1 },
  subHeading: {
    fontSize: 14, fontWeight: '700', color: '#1a1a1a',
    marginTop: 16, marginBottom: 10,
    paddingLeft: 8, borderLeftWidth: 3, borderLeftColor: G,
  },
  healthRow: {
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F3F3',
  },
  healthLabel: { fontSize: 12, color: '#888', fontWeight: '600', marginBottom: 2 },
  healthValue: { fontSize: 13, color: '#1a1a1a' },
});

export default PetDetail;
